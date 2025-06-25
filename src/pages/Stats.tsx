// pages/Stats.tsx
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import CalendarBox from "../components/CalendarBox";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import BlueArrow from "../images/blueArrow.png";

const getWeekRange = (date: Date): Date[] => {
  const start = new Date(date);
  const day = start.getDay();
  start.setDate(start.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

const getMonthRange = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
};

const formatLabel = (date: Date) => {
  const weekDay = date.toLocaleDateString("ko-KR", { weekday: "short" });
  return `${weekDay} (${date.getMonth() + 1}/${date.getDate()})`;
};

const Stats = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cycleCount, setCycleCount] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/calendar");
  };

  const fetchTodaySummary = async (date: Date) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const key = date.toISOString().slice(0, 10);
    const ref = doc(db, "user", user.uid, "focusRecords", key);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    setCycleCount(data.cycleCount || 0);
    setFocusTime(data.focusTime || 0);
  };

  const fetchFocusData = async (dates: Date[], setter: (data: any[]) => void) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const result: any[] = await Promise.all(
      dates.map(async (date) => {
        const key = date.toISOString().slice(0, 10);
        const ref = doc(db, "user", user.uid, "focusRecords", key);
        const snap = await getDoc(ref);
        const count = snap.exists() ? snap.data().cycleCount || 0 : 0;
        return {
          date,
          label: formatLabel(date),
          count,
        };
      })
    );

    setter(result);
  };

  useEffect(() => {
    fetchTodaySummary(selectedDate);
    fetchFocusData(getWeekRange(selectedDate), setWeeklyData);
    fetchFocusData(getMonthRange(selectedDate), setMonthlyData);
  }, [selectedDate]);

  const hours = Math.floor(focusTime / 60);
  const minutes = focusTime % 60;

  return (
    <div className="min-h-screen px-4 py-6 flex flex-col items-center bg-blue-50">
      <button
        onClick={goBack}
        className="absolute top-4 left-4 flex items-center gap-1 text-sm hover:text-black"
      >
        <img src={BlueArrow} alt="goBack" className="w-8 h-8" />
      </button>
      <h1 className="text-3xl font-bold mb-8 mt-8 text-gray-800 font-['IBM_Plex_Sans_KR']">통계 보기</h1>

      <CalendarBox selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      <div className="w-full max-w-[700px] bg-white border-gray-300 mt-8 border rounded-xl p-6">
        {/* 오늘 집중 시간 텍스트 */}
        <div className="text-center mt-6 text-lg text-gray-700 font-['IBM_Plex_Sans_KR']">
          오늘은 {hours}시간 {minutes}분 집중하셨어요. <br/> 🍅 총 {cycleCount}회 완료
        </div>
        {/* 그래프 영역 */}
        <div className="w-full max-w-4xl mt-10">
          <h2 className="text-xl font-semibold text-red-400 mb-2 font-['IBM_Plex_Sans_KR']">주간 집중 통계</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>

          <h2 className="text-xl font-semibold text-green-600 mt-10 mb-2 font-['IBM_Plex_Sans_KR']">월간 집중 통계</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" interval={4} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#50C878" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* 확인 버튼 */}
      <button
        onClick={() => navigate("/settings")}
        className="mt-10 bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-lg shadow font-['IBM_Plex_Sans_KR']"
      >
        확인
      </button>
    </div>
  );
};

export default Stats;