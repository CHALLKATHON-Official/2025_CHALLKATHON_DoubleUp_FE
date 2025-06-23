// 타이머 페이지
import Timer from "../components/Timer";

const TimerPage = () => {
  return(
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* 타이머 위에 넣을 이미지 - 수정 가능*/}
      <img src="src\images\studyingRabbit.png" alt="studyingImage" className="w-24 h-24 mb-6" />
      
      {/* 타이머 컴포넌트 불러옴 */}
      <Timer/>
    </div>
  )
};

export default TimerPage;
