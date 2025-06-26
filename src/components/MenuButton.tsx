//메뉴 버튼 - 캘린더에서 다른 페이지로 넘어갈 때
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MenuButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  //각 설정한 경로로 이동
  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="absolute top-4 right-4 z-50 font-['IBM_Plex_Sans_KR']">
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl px-2 py-1 rounded hover:bg-gray-200"
        >
          ☰
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-md text-sm">
            {/* 친구목록 페이지로 이동 */}
            <button
              onClick={() => handleNavigate("/friends")}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              친구 목록
            </button>
            {/* 설정 페이지로 이동 */}
            <button
              onClick={() => handleNavigate("/settings")}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              설정
            </button>
            {/* 타이머 페이지로 이동 */}
            <button
              onClick={() => handleNavigate("/timer")}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              타이머 시작
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuButton;