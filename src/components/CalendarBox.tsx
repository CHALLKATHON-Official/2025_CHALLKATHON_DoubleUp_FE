// components/CalendarBox.tsx
import { useState } from "react";

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const CalendarBox = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const daysArray: (number | null)[] = [
    ...Array.from({ length: firstDayIndex }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-300 p-4 min-w-[320px] text-sm shadow-sm h-[400px] flex flex-col justify-between">
      {/* 상단 (연도 + 월 + 버튼) */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-gray-800 text-sm">
          {year}년 {month + 1}월
        </span>
        <div className="flex space-x-1">
          <button
            onClick={goToPreviousMonth}
            className="w-6 h-6 text-sm text-gray-500 hover:text-black rounded hover:bg-gray-200 transition"
          >
            &lt;
          </button>
          <button
            onClick={goToNextMonth}
            className="w-6 h-6 text-sm text-gray-500 hover:text-black rounded hover:bg-gray-200 transition"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 text-center text-gray-500 mb-2">
        {weekDays.map((day, idx) => (
          <div key={idx}>{day}</div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 grow text-center text-gray-800 gap-y-1">
        {daysArray.map((day, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center h-full py-[2px]"
          >
            {day ?? ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarBox;