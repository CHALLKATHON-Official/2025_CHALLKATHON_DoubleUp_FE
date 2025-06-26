//로딩 페이지
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import appicon from "../images/appicon.png";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/LoginHome");
    }, 2000); // 2초 후 이동
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-white pt-10">
        <h1 className="text-3xl font-bold text-gret-700 font-['IBM_Plex_Sans_KR']">25H</h1>
      </div>
      <div className="min-h-[700px] flex flex-col items-center justify-center bg-white">      
        {/* 앱 아이콘 */}
        <img
          src={appicon}
          alt="25Hrs 로고"
          className="w-48 h-48 animate-pulse"
        />
        
        <p className="mt-2 text-3xl font-bold text-gray-700 pt-10 font-['IBM_Plex_Sans_KR']">로딩 중...</p>
        <p className="mt-2 text-xls text-gray-500 pt-10">⏱ 타이머를 감고 있어요... 조금만 기다려 주세요!</p>
      </div>
    </div>
    
  );
};

export default Home;