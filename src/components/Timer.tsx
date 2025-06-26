//타이머
import { useEffect, useState, useRef } from "react";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Modal from "./Modal";

interface TimerProps {
  mode: "work" | "break";
  onRunningChange?: (running: boolean) => void;
}
//집중 시간 25분, 휴식 시간 5분 설정
const WORK_SEC = 25 * 60;
const BREAK_SEC = 5 * 60;
//한국 기준 날짜 키
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

  const todayKey = getKSTDateKey(new Date()); //날짜
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user?.uid ?? "unknown";
  const userCycleKey = `todayCycle-${uid}-${todayKey}`; //날짜 별 25분 사이클 횟수

  //모드 전환 시 타이머 리셋(타이머 동작 x)
  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(mode === "work" ? WORK_SEC : BREAK_SEC);
    }
  }, [mode]);
  //타이머 동작 여부
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
  //사이클 수 가져오기
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
  //타이머 실행
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
          saveFocusToFirestore(); //기록 저장
        }

        return 0;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [isRunning, mode, cycleCount, userCycleKey]);
//DB에 기록 저장
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
//시작 정지 핸들러
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
    <div className="flex flex-col items-center gap-6 px-4 py-8 sm:p-6 select-none font-['IBM_Plex_Sans_KR']">
      {/* 타이머 종료시 보이는 모달 */}
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
      {/* 남은 시간, 진행도 표시 */}
      <div
        className="relative grid place-items-center rounded-full border-4 border-[var(--color-btn)] w-60 h-60 sm:w-80 sm:h-80"
        style={{
          background: `conic-gradient(var(--color-timer) ${progress}%, transparent 0)`,
        }}
      >
        <span className="text-3xl font-bold">{minuteTime}</span>
      </div>
      {/* 시작 정지 버튼 */}
      <button
        onClick={handleToggle}
        className={`px-4 py-2 mt-6 rounded-md shadow ${
          isRunning
            ? "bg-red-400 hover:bg-red-500 text-white"
            : "bg-[var(--color-btn)] hover:bg-[var(--color-btn-hover)] text-white"
        }`}
      >
        {isRunning ? "정지하기" : "시작하기"}
      </button>
      {/* 집중 시간 텍스트 */}
      {mode === "work" && (
        <div className="text-gray-600 text-center text-sm sm:text-base mt-2">
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