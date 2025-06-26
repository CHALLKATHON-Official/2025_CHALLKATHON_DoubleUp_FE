//일주일 집중 시간 데이터
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

type FocusData = {
  date: string;    // 날짜
  minutes: number; // 하루 집중 시간(분)
};

const WeeklyFocusData = () => {
  const [data, setData] = useState<FocusData[]>([]);
  //로그인 상태 확인
  useEffect(() => {
    const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      
      const today = new Date();
      const dates: string[] = [];
      const docIds: string[] = [];
      //일주일 계산
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10); // yyyy-mm-dd
        dates.push(dateStr);
        //uid와 연월일 데이터 저장
        docIds.push(`${user.uid}_${dateStr}`);
      }
      //db에서 날짜별 집중시간 확인
      const results: FocusData[] = await Promise.all(
        docIds.map(async (id, idx) => {
          const snap = await getDoc(doc(db, "focusSessions", id));
          const cycleCount = snap.exists() ? snap.data().cycleCount || 0 : 0;
          return {
            date: dates[idx].replace("-", "/").slice(5), //월일
            minutes: cycleCount * 25,
          };
        })
      );

      setData(results);
    });

    return () => unsubscribe(); 
  }, []);
  

  return (
    <div className="p-4 min-w-[600px] bg-white rounded shadow">
      <p className="text-lg font-bold mb-3">일주일 집중 시간</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis 
            dataKey="date" 
            interval={0} 
            angle={-45} 
            textAnchor="end" 
            height={60}
            />
          <YAxis label={{ value: "분", angle: 0, position: "insideLeft" }} />
          <Tooltip formatter={(value: number) => `${value}분`} />
          <Bar dataKey="minutes" fill="#60a5fa" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyFocusData;
