// Settings.tsx
import { useNavigate } from "react-router-dom";
import BlueArrow from "../images/blueArrow.png";
import { useState } from "react";
import Modal from "../components/Modal";

const Settings = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const goStats = () => {
    navigate("/stats");
  };

  const goBack = () => {
    navigate("/calendar");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-start pt-10 relative font-['IBM_Plex_Sans_KR']">
      {/* 왼쪽 상단 고정 뒤로가기 버튼 */}
      <button
        onClick={goBack}
        className="absolute top-4 left-4 flex items-center gap-1 text-sm hover:text-black"
      >
        <img src={BlueArrow} alt="goBack" className="w-8 h-8" />
      </button>

      <div className="w-[480px] h-[480px] bg-white shadow-md rounded-md px-6 py-8">
        <p className="text-lg text-gray-500 mb-6">💡 더보기</p>

        <div className="border-b border-gray-300 py-4">
          <p className="text-lg font-semibold text-black" onClick={goStats}>
            통계보기
          </p>
        </div>

        <div className="border-b border-gray-300 py-4">
          <p className="text-lg font-semibold text-black" onClick={()=>setModalOpen(true)}>문의하기</p>
        </div>
      </div>

      {/* CS모달 */}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={()=>setModalOpen(false)}>
          <div className="flex flex-col items-center p-5 text-center">
            <p className="mb-3 font-bold text-left pb-3">문의사항은<br />아래의 메일로 보내주세요!</p>
            <div className="mb-6 space-y-2 text-base text-gray-700">
              <p>📬 abc@gmail.com</p>
              <p>📬 def@gmail.com</p>
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-1 text-white bg-blue-400 rounded hover:bg-blue-300"
            >
              확인
            </button>

          </div>
        </Modal>
      )}
      </div>
  );
};

  

export default Settings;