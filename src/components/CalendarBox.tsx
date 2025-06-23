// components/CalendarBox.tsx
import React from "react";

interface CalendarBoxProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const CalendarBox: React.FC<CalendarBoxProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

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

  const isSameDate = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  return (
    <div className="bg-white rounded-xl border border-gray-300 p-4 min-w-[320px] text-sm shadow-sm">
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

      <div className="grid grid-cols-7 text-center text-gray-500 mb-2">
        {weekDays.map((day, idx) => (
          <div key={idx}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-gray-800">
        {daysArray.map((day, idx) => {
          const thisDate = new Date(year, month, day || 1);
          const isSelected = day && selectedDate && isSameDate(thisDate, selectedDate);

          return (
            <div
              key={idx}
              onClick={() => day && onDateSelect(new Date(year, month, day))}
              className={`w-8 h-8 flex items-center justify-center leading-none cursor-pointer text-sm ${
                isSelected ? "bg-red-400 text-white rounded-full" : ""
              }`}

            >
              {day ?? ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarBox;