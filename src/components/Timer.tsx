import { useEffect, useState, useRef } from "react";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Modal from "./Modal";

interface TimerProps {
  mode: "work" | "break";
  onRunningChange?: (running: boolean) => void;
}

const WORK_SEC = 25 * 60;
const BREAK_SEC = 5 * 60;

const getKSTDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Timer = ({ mode, onRunningChange }: TimerProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(mode === "work" ? WORK_SEC : BREAK_SEC);
  const [cycleCount, setCycleCount] = useState(0);
  const [todayCycle, setTodayCycle] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const todayKey = getKSTDateKey(new Date());
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user?.uid ?? "unknown";
  const userCycleKey = `todayCycle-${uid}-${todayKey}`;

  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(mode === "work" ? WORK_SEC : BREAK_SEC);
    }
  }, [mode]);

  useEffect(() => {
    onRunningChange?.(isRunning);
  }, [isRunning]);

  useEffect(() => {
  return () => {
    if (isRunning) {
      updateDoc(doc(db, "user", uid), { isFocusing: false });
    }
  };
}, [isRunning, uid]);

  useEffect(() => {
    const fetchCycleCount = async () => {
      if (mode !== "work" || !user) return;

      const docRef = doc(db, "user", user.uid, "focusRecords", todayKey);
      const docSnap = await getDoc(docRef);

      let cycle = 0;
      if (docSnap.exists()) {
        const data = docSnap.data();
        cycle = data.cycleCount || 0;
      }

      setCycleCount(cycle);
      setTodayCycle(cycle);
      localStorage.setItem(userCycleKey, String(cycle));
    };

    fetchCycleCount();
  }, [mode, user, todayKey]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(async () => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        clearInterval(intervalRef.current!);
        setIsRunning(false);
        setShowModal(true);

        // 타이머 종료 시 isFocusing false 설정
        updateDoc(doc(db, "user", uid), { isFocusing: false });

        if (mode === "work") {
          const nextCycle = cycleCount + 1;
          setCycleCount(nextCycle);
          setTodayCycle(nextCycle);
          localStorage.setItem(userCycleKey, String(nextCycle));
          saveFocusToFirestore();
        }

        return 0;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [isRunning, mode, cycleCount, userCycleKey]);

  const saveFocusToFirestore = async () => {
    if (!user) return;

    const docRef = doc(db, "user", user.uid, "focusRecords", todayKey);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      await updateDoc(docRef, {
        cycleCount: (data.cycleCount || 0) + 1,
        focusTime: (data.focusTime || 0) + 25,
        lastUpdated: new Date(),
      });
    } else {
      await setDoc(docRef, {
        cycleCount: 1,
        focusTime: 25,
        lastUpdated: new Date(),
      });
    }
  };

  const handleToggle = async () => {
    if (isRunning) {
      clearInterval(intervalRef.current!);
      setIsRunning(false);
      await updateDoc(doc(db, "user", uid), { isFocusing: false }); // 수동 정지 시
    } else {
      setIsRunning(true);
      setShowModal(false);
      await updateDoc(doc(db, "user", uid), { isFocusing: true }); // 시작 시
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSecondsLeft(mode === "work" ? WORK_SEC : BREAK_SEC);
  };

  const minuteTime = new Date(secondsLeft * 1000).toISOString().substr(14, 5);
  const progress = (1 - secondsLeft / (mode === "work" ? WORK_SEC : BREAK_SEC)) * 100;

  return (
    <div className="flex flex-col items-center gap-6 select-none p-6 font-['IBM_Plex_Sans_KR']">
      <Modal isOpen={showModal} onClose={handleModalClose}>
        <div className="text-center">
          <p className="text-lg font-semibold">
            {mode === "work" ? "공부가 끝났습니다!" : "휴식이 끝났습니다!"}
          </p>
          <button
            onClick={handleModalClose}
            className="mt-4 px-4 py-2 bg-[var(--color-btn)] text-white rounded-md"
          >
            확인
          </button>
        </div>
      </Modal>

      <div
        className="relative grid place-items-center rounded-full border-4 border-[var(--color-btn)]"
        style={{
          width: "320px",
          height: "320px",
          background: `conic-gradient(var(--color-timer) ${progress}%, transparent 0)`,
        }}
      >
        <span className="text-3xl font-bold">{minuteTime}</span>
      </div>

      <button
        onClick={handleToggle}
        className={`px-6 py-2 mt-8 rounded-md shadow ${
          isRunning
            ? "bg-red-400 hover:bg-red-500 text-white"
            : "bg-[var(--color-btn)] hover:bg-[var(--color-btn-hover)] text-white"
        }`}
      >
        {isRunning ? "정지하기" : "시작하기"}
      </button>

      {mode === "work" && (
        <div className="text-gray-600 text-center">
          <p className="font-bold">{todayCycle}회</p>
          <p>
            오늘 {Math.floor((todayCycle * 25) / 60)}시간{" "}
            {(todayCycle * 25) % 60}분 집중 중
          </p>
        </div>
      )}
    </div>
  );
};

export default Timer;