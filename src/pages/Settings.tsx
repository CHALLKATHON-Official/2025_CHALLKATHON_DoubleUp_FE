// Settings.tsx
import { useNavigate } from "react-router-dom";
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

  const goTheme = ()=>{
    navigate("/theme");
  }

  return (
    <div className="min-h-screen flex justify-center items-start pt-10 relative font-['IBM_Plex_Sans_KR'] bg-[var(--color-bg)]">
        {/* 왼쪽 상단 고정 뒤로가기 버튼 */}
        <button
          onClick={goBack}
          className="absolute top-4 left-4 flex items-center gap-1 text-base hover:text-black"
        >
        ❮ 뒤로가기
        </button>

        <div className="w-[90%] sm:w-full sm:max-w-sm h-[480px] shadow-md mt-9 border rounded-md px-4 sm:px-6 py-6 sm:py-8 bg-white">
          <p className="text-base sm:text-lg text-gray-500 mb-6">⚙ 설정</p>

        <div className="border-b border-gray-300 py-4">
          <p
            className="text-base sm:text-lg font-semibold text-black cursor-pointer hover:text-gray-600 transition"
            onClick={goStats}
          >
            통계 보기
          </p>
        </div>

        <div className="border-b border-gray-300 py-4">
          <p
            className="text-base sm:text-lg font-semibold text-black cursor-pointer hover:text-gray-600 transition"
            onClick={goTheme}
          >
            테마 설정
          </p>
        </div>

        <div className="border-b border-gray-300 py-4">
          <p
            className="text-base sm:text-lg font-semibold text-black cursor-pointer hover:text-gray-600 transition"
            onClick={() => setModalOpen(true)}
          >
            문의하기
          </p>
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
                className="px-4 py-1.5 text-sm sm:text-base text-white bg-[var(--color-btn)] rounded hover:bg-[var(--color-accent)]"
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