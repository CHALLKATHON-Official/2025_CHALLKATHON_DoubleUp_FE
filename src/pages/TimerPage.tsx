import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Timer from "../components/Timer";
import rabbitImg from "../images/studyingRabbit.png";

const TimerPage = () => {
  const [mode, setMode] = useState<"work" | "break">("work");
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/calendar");
  };

  return (
    <div className="min-h-screen font-['IBM_Plex_Sans_KR'] bg-[var(--color-bg)] flex flex-col items-center justify-center relative">
      {/* 화면 왼쪽 상단 고정 뒤로가기 버튼 */}
      <button
        onClick={goBack}
        className="absolute top-4 left-4 flex items-center text-base"
      >
        ❮ 뒤로가기
      </button>

      {/* 토끼 이미지 */}
      <img src={rabbitImg} alt="studying" className="w-24 h-24 sm:w-32 sm:h-32 mb-6" />

      {/* 타이머 */}
      <Timer mode={mode} onRunningChange={setIsRunning} />

      {/* 공부 / 휴식 모드 전환 */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => setMode("work")}
          disabled={isRunning}
          className={`text-2xl px-3 py-2 rounded-lg shadow w-20 sm:w-24 ${
            mode === "work" ? "bg-[var(--color-btn-hover)]" : "bg-[var(--color-btn)]"
          } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          📖
        </button>
        <button
          onClick={() => setMode("break")}
          disabled={isRunning}
          className={`text-2xl px-3 py-2 rounded-lg shadow w-20 sm:w-24 ${
            mode === "break" ? "bg-[var(--color-btn-hover)]" : "bg-[var(--color-btn)]"
          } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          💤
        </button>
      </div>
    </div>
  );
};

export default TimerPage;