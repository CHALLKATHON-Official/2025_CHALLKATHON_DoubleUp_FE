// 통계 페이지
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import WeeklyFocusChart from "../components/WeeklyFocusData";

const Stats = () => {
    const [cycleCount, setCycleCount ] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
    const fetchTodayFocus = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const today = new Date().toISOString().slice(0, 10);
      const docRef = doc(db, "focusSessions", `${user.uid}_${today}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCycleCount(docSnap.data().cycleCount || 0);
      }
    };

    fetchTodayFocus();
  }, []);

  const goBack=()=>{
    navigate("/settings");
  }

    const totalMinutes = cycleCount * 25;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">오늘의 집중시간</h1>
        <p className="text-base text-center mt-4 mb-8">
            오늘은 {hours}시간 {minutes}분 집중하셨어요!<br/>
            🍅 총 {cycleCount}번의 뽀모도로를 완료하셨습니다.
        </p>

        <div className="p-6 max-w-2xl w-full mx-auto space-y-6">
            <WeeklyFocusChart />
        </div>

        <button
            onClick={goBack}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow transition"
        >
            확인
        </button>
        </div>
    );
};

export default Stats;
