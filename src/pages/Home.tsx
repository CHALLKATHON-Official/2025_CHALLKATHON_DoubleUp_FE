// src/pages/Home.tsx
import { Link } from "react-router-dom";

const Home = () => {
  const pages = [
    { path: "/login", name: "🔐 로그인" },
    { path: "/calendar", name: "📅 캘린더" },
    { path: "/timer", name: "⏱ 타이머" },
    { path: "/friends", name: "👥 친구" },
    { path: "/settings", name: "⚙️ 설정" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">25Hrs 홈</h1>
      <div className="flex flex-col gap-3">
        {pages.map((page) => (
          <Link key={page.path} to={page.path}>
            <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition">
              {page.name}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;