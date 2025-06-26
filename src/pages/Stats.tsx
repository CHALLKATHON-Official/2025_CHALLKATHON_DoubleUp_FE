//통계 페이지
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import CalendarBox from "../components/CalendarBox";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// KST 기준 날짜 키 생성 함수 추가
const getKSTDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
//주간 날짜 데이터
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
//월간 날짜 데이터
const getMonthRange = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
};
//주간 그래프용 날짜 표시(요일만)
const formatLabel = (date: Date) => {
  return date.toLocaleDateString("ko-KR", { weekday: "short" });
};
//월간 그래프용 날짜 표시
const formatMonthLabel = (date: Date) => {
  const day = date.getDate();
  return `${day}일`;
};


const Stats = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cycleCount, setCycleCount] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/settings");
  };

  const fetchTodaySummary = async (date: Date) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    // 수정: UTC 대신 로컬 기준 key 사용
    const key = getKSTDateKey(date);
    const ref = doc(db, "user", user.uid, "focusRecords", key);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    setCycleCount(data.cycleCount || 0);
    setFocusTime(data.focusTime || 0);
  };
  //사용자 별 집중(사이클)데이터 불러오기
  const fetchFocusData = async (dates: Date[], setter: (data: any[]) => void, labelFormatter: (date: Date)=>string)  => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const result: any[] = await Promise.all(
      dates.map(async (date) => {
        // 수정: UTC 대신 로컬 기준 key 사용
        const key = getKSTDateKey(date);
        const ref = doc(db, "user", user.uid, "focusRecords", key);
        const snap = await getDoc(ref);
        const count = snap.exists() ? snap.data().cycleCount || 0 : 0;
        return {
          date,
          label: labelFormatter(date),
          count,
        };
      })
    );

    setter(result);
  };
  //선택한 날짜에 맞게 적용
  useEffect(() => {
    fetchTodaySummary(selectedDate);
    fetchFocusData(getWeekRange(selectedDate), setWeeklyData, formatLabel);
    fetchFocusData(getMonthRange(selectedDate), setMonthlyData, formatMonthLabel);
  }, [selectedDate]);

  const hours = Math.floor(focusTime / 60);
  const minutes = focusTime % 60;

  return (
    <div className="min-h-screen px-4 py-6 flex flex-col items-center  bg-[var(--color-bg)] ">
      <button
        onClick={goBack}
        className="absolute top-4 left-4 flex items-center gap-1 text-base hover:text-black"
      >
        ❮ 뒤로가기
      </button>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 mt-6 sm:mt-8 text-gray-800 font-['IBM_Plex_Sans_KR']">통계 보기</h1>
      {/* 캘린더 영역 */}
      <CalendarBox selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      {/* 통계 그래프 영역 */}
      <div className="w-full max-w-[760px] bg-white border-gray-300 mt-6 sm:mt-8 border rounded-xl px-4 py-5 sm:p-6">
        <div className="text-center mt-6 text-base sm:text-lg text-gray-700 font-['IBM_Plex_Sans_KR']">
          {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일은 {hours}시간 {minutes}분 집중하셨어요. <br /> 🍅 총 {cycleCount}회 완료
        </div>
        <div className="w-full max-w-4xl mt-10">
          <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-week-graph)] mb-2 font-['IBM_Plex_Sans_KR']">주간 집중 통계</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 30, left: -30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              1<XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-week-graph)" />
            </BarChart>
          </ResponsiveContainer>

          <h2 className="text-xl font-semibold text-[var(--color-month-graph)] mt-10 mb-2 font-['IBM_Plex_Sans_KR']">월간 집중 통계</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: -30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" interval={4} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-month-graph)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <button
        onClick={() => navigate("/settings")}
        className="mt-10  bg-[var(--color-btn)]  hover:bg-[var(--color-btn-hover)]  text-white px-6 py-2 rounded-lg shadow font-['IBM_Plex_Sans_KR']"
      >
        확인
      </button>
    </div>
  );
};

export default Stats;