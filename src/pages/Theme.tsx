import { useNavigate } from "react-router-dom";
//import BlueArrow from "../images/blueArrow.png";

//아직 수정중
export function setAppicon(path: string) {
  const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
  if (link) {
    link.href = path;
  } else {
    const newLink = document.createElement("link");
    newLink.rel = "icon";
    newLink.href = path;
    document.head.appendChild(newLink);
  }
}

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
    <div className="bg-[var(--color-bg)] min-h-screen">
      <button
        onClick={goBack}
        className="absolute top-4 left-4 flex items-center gap-1 text-sm hover:text-black"
      >
        {/* <img src={BlueArrow} alt="goBack" className="w-8 h-8" /> */}
        ❮ 뒤로가기
      </button>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">테마 선택</h1>
        <div className="flex gap-3">
          <button onClick={() => setTheme("default")} className="bg-gray-200 px-4 py-2 rounded">기본</button>
          <button onClick={() => setTheme("blue")} className="bg-blue-200 px-4 py-2 rounded">파랑</button>
          <button onClick={() => setTheme("pink")} className="bg-pink-200 px-4 py-2 rounded">핑크</button>
          <button onClick={() => setTheme("green")} className="bg-green-200 px-4 py-2 rounded">초록</button>
        </div>
      </div>
    </div>
  );
};

export default Theme;
