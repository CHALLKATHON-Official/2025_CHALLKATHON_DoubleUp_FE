// src/pages/Home.tsx
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* 앱 아이콘 */}
      <img
        src={appicon}
        alt="25Hrs 로고"
        className="w-32 h-32 animate-pulse"
      />
      <h1 className="mt-4 text-3xl font-bold text-blue-600">25Hrs</h1>
      <p className="mt-2 text-sm text-gray-500">로딩 중...</p>
    </div>
  );
};

export default Home;