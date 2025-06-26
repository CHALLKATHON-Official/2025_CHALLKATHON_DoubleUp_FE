import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

//초기 진입시 랜덤 닉네임
const generateRandomNickname = () => {
  const adjectives = ["행복한", "용감한", "신나는", "똑똑한"];
  const animals = ["토끼", "고양이", "사자", "너구리", "강아지", "돌고래"];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${animals[Math.floor(Math.random() * animals.length)]}${Math.floor(Math.random() * 100)}`;
};

const Welcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const uniqueID = location.state?.uniqueID || localStorage.getItem("uniqueID");
  const uid = localStorage.getItem("uid");

  const [nickname, setNickname] = useState("");

  //개인 아이디 확인 안되면(가입시 부여) 오류 페이지로
  useEffect(() => {
    if (!uniqueID || !uid) {
      navigate("/NotFound");
    } else {
      const random = generateRandomNickname();
      setNickname(random);
    }
  }, [uniqueID, uid, navigate]);

  //닉네임 설정
  const handleStart = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요!");
      return;
    }

    try {
      const userRef = doc(db, "user", uid!);
      await updateDoc(userRef, {
        nickname: nickname.trim(),
      });
      localStorage.setItem("nickname", nickname.trim());
      navigate("/calendar");
    } catch (error) {
      console.error("닉네임 저장 실패:", error);
      alert("닉네임 저장 중 오류가 발생했어요.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">가입을 환영합니다!</h1>

      <div className="mb-4 w-full max-w-xs">
        <label className="block text-gray-600 mb-1">닉네임을 입력해주세요</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="닉네임을 입력하세요"
        />
      </div>

      <ul className="mb-6 text-sm text-gray-500 space-y-1">
        <li>📢 고유 ID 설정은 최초 가입 시 랜덤 생성됩니다.</li>
        <li>📢 닉네임은 언제든지 수정 가능해요.</li>
      </ul>

      <button
        onClick={handleStart}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow transition"
      >
        시작하기
      </button>
    </div>
  );
};

export default Welcome;