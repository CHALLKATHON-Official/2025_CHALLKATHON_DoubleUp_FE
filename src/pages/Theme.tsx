import { useNavigate } from "react-router-dom";
//import BlueArrow from "../images/blueArrow.png";


function setTheme(theme: "default" | "blue" | "pink" | "green") {
  if (theme === "default") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }
}

const Theme = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/settings");
  };


  return (
    <div className="flex pt-10 justify-center bg-[var(--color-bg)] font-['IBM_Plex_Sans_KR'] min-h-screen">
      <div className="w-[90%] sm:w-full sm:max-w-sm h-[480px] shadow-md mt-9 border rounded-md px-4 sm:px-6 py-6 sm:py-8 bg-white">
        <button
          onClick={goBack}
          className="absolute top-4 left-4 flex items-center gap-1 text-base hover:text-black"
        >
          ❮ 뒤로가기
        </button>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center pb-10">테마 선택</h1>
          <div className="flex flex-col items-center justify-center gap-7">
            <button onClick={() => setTheme("default")} className="bg-gray-200 px-4 py-2 rounded">기본</button>
            <button onClick={() => setTheme("blue")} className="bg-blue-200 px-4 py-2 rounded">파랑</button>
            <button onClick={() => setTheme("pink")} className="bg-pink-200 px-4 py-2 rounded">핑크</button>
            <button onClick={() => setTheme("green")} className="bg-green-200 px-4 py-2 rounded">초록</button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Theme;
