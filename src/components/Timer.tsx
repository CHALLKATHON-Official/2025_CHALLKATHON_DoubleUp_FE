// 25분 타이머와 시작버튼, 애니메이션 또는 그림이 포함된 ppomodoro 타이머 컴포넌트

import { useEffect, useState, useRef } from "react";
import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

//확인용을 1분 해놓음 이후 수정
const Work_sec = 1 * 60; //작업 시간 25분
const Break_sec = 1 * 60; //쉬는 시간 5분 

//타이머
const Timer = () =>{
    const [mode, setMode] = useState<"idle"|"work"|"break">("idle");
    //남은 시간
    const [secondsLeft, setSecondsLeft] = useState(Work_sec);
    //25분 반복 횟수
    const todayKey = new Date().toISOString().slice(0, 10); // 연월일
    const [todayCycle, setTodayCycle] = useState<number>(
    Number(localStorage.getItem(`todayCycle-${todayKey}`) ?? 0)
    );

    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    //포커스 이동 막기 - 확인 필요
    useEffect(() => {
        if (!isRunning) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = ""; // 크롬용
        };

        //탭전환 막는 법 다시 생각
        const handleVisibility = () => {
            if (document.hidden) {
            alert("아직 타이머가 진행 중입니다.");
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
        }, [isRunning]);

    //타이머 작동
    useEffect(() => {
        if (!isRunning) return;

        intervalRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev > 1) return prev - 1;

                // 시간 종료 시 상태 전환
                //work -> break
                if (mode === "work") {
                    setTodayCycle((c) => {
                        const auth = getAuth();
                        const user = auth.currentUser;
                        if (user) {
                        const docRef = doc(db, "focusSessions", `${user.uid}_${todayKey}`);
                        setDoc(docRef, {
                            uid: user.uid,
                            date: todayKey,
                            cycleCount: c+1,
                        }, { merge: true });
                        }
                        return c + 1;
                    });
                    setMode("break");
                    return Break_sec;
                }
                
                if (mode === "break") {
                    alert("휴식이 끝났습니다. 다시 시작하세요!");
                    setMode("idle");
                    setIsRunning(false);
                    return Work_sec;
                }

                return prev;
                });
            }, 1000);

            return () => clearInterval(intervalRef.current!);
        }, [isRunning, mode]);

    //초단위 숫자 분단위로 변경하여 표시
    const minuteTime = new Date(secondsLeft * 1000).toISOString().substr(14, 5);
    const progress =
        mode === "work"
        ? (1 - secondsLeft / Work_sec) * 100
        : (1 - secondsLeft / Break_sec) * 100;

    //타이머 시작 핸들러
        const startTimer = () => {
        if (mode === "idle") setMode("work");
        setIsRunning(true);
    };

    //UI
    return (
        <div className="flex flex-col items-center gap-6 select-none">

        {/* 원형 타이머 */}
        <div
            className="relative grid place-items-center rounded-full border-4 border-blue-300"
            style={{
            width: "260px",
            height: "260px",
            background: `conic-gradient(#bfdbfe ${progress}%, transparent 0)`,
            }}
        >
            <span className="text-3xl font-bold">{minuteTime}</span>
        </div>

        {/* 버튼 영역 */}
        <button
            onClick={startTimer}
            disabled={isRunning && mode === "work"} // work 중엔 중단 불가
            className={`px-6 py-2 rounded-md shadow ${
            isRunning
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-300 hover:bg-blue-400 text-white"
            }`}
        >
            {isRunning ? "진행 중..." : "시작하기"}
        </button>

        {/* 누적 시간 표시 */}
        {/* 횟수는 확인용 - 경우에 따라 추가 가능 */}
        <p className="text-gray-600">
            <span className="font-semibold">
            <p className="flex items-center justify-center">{todayCycle}회</p>
            오늘 {Math.floor((todayCycle * 25) / 60)} 시간  {(todayCycle * 25) % 60} 분 집중하는 중...
            </span>
        </p>
    </div>
    );
};
export default Timer;
