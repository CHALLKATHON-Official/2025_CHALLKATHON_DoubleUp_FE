// Settings.tsx
import { useNavigate } from "react-router-dom";
import BlueArrow from "../images/blueArrow.png";

const Settings = () => {
  const navigate = useNavigate();

  const goStats = () => {
    navigate("/stats");
  };

  const goBack = () => {
    navigate("/calendar");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10 relative">
      {/* 왼쪽 상단 고정 뒤로가기 버튼 */}
      <button
        onClick={goBack}
        className="absolute top-4 left-4 flex items-center gap-1 text-sm hover:text-black"
      >
        <img src={BlueArrow} alt="goBack" className="w-8 h-8" />
      </button>

      <div className="w-[320px] bg-white shadow-md rounded-md px-6 py-8">
        <p className="text-sm text-gray-300 mb-6">설정 화면</p>

        <div className="border-b border-gray-300 py-4">
          <p className="text-lg font-semibold text-black" onClick={goStats}>
            통계보기
          </p>
        </div>

        <div className="border-b border-gray-300 py-4">
          <p className="text-lg font-semibold text-black">문의하기</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;