import React, { useState, useEffect } from "react";

// 부모 컴포넌트로부터 전달받는 props 정의
interface CalendarBoxProps {
  selectedDate: Date; // 현재 선택된 날짜
  onDateSelect: (date: Date) => void; // 날짜 클릭 시 호출되는 함수
}

// 요일 배열
const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const CalendarBox: React.FC<CalendarBoxProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  // 현재 달력에 표시할 날짜 상태
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate);

  // props로 전달된 selectedDate가 바뀔 때 currentDate도 갱신
  useEffect(() => {
    setCurrentDate(selectedDate);
  }, [selectedDate]);

  // 현재 연도 및 월 추출
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0부터 시작 (1월 = 0)

  // 해당 월의 총 일수 반환
  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  // 해당 월의 1일이 무슨 요일인지 반환 (0 = 일요일, 6 = 토요일)
  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 현재 달의 일 수 및 시작 요일 인덱스 계산
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  // 달력에 표시할 날짜 배열 구성 (앞쪽 공백 + 실제 날짜)
  const daysArray: (number | null)[] = [
    ...Array.from({ length: firstDayIndex }, () => null), // 앞쪽 빈칸
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1), // 실제 날짜
  ];

  // 두 날짜가 같은 날인지 비교
  const isSameDate = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  return (
    <div className="bg-white rounded-xl border border-gray-300 p-4 sm:p-6 w-full max-w-3xl min-h-[400px] text-base sm:text-xl shadow-sm font-['IBM_Plex_Sans_KR']">
      {/* 상단: 연도/월 및 좌우 이동 버튼 */}
      <div className="flex justify-between items-center mb-2 pb-5">
        <span className="font-bold text-gray-800 text-lg sm:text-2xl">
          {year}년 {month + 1}월
        </span>
        <div className="flex space-x-1">
          <button
            onClick={goToPreviousMonth}
            className="w-6 h-6 text-xl text-gray-500 hover:text-black rounded hover:bg-gray-200 transition"
          >
            &lt;
          </button>
          <button
            onClick={goToNextMonth}
            className="w-6 h-6 text-xl text-gray-500 hover:text-black rounded hover:bg-gray-200 transition"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* 요일 표시 */}
      <div className="grid grid-cols-7 text-center text-gray-500 mb-2 text-sm sm:text-base">
        {weekDays.map((day, idx) => (
          <div key={idx}>{day}</div>
        ))}
      </div>

      {/* 날짜 렌더링 */}
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-7 gap-x-6 sm:gap-x-11 gap-y-4 text-center text-gray-800">
          {daysArray.map((day, idx) => {
            const thisDate = day ? new Date(year, month, day) : null;

            // 해당 날짜가 현재 선택된 날짜인지 확인
            const isSelected =
              thisDate !== null && isSameDate(thisDate, selectedDate);

            return (
              <div
                key={idx}
                onClick={() => thisDate && onDateSelect(thisDate)} // 날짜 클릭 시 날짜 전달
                className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center leading-none cursor-pointer text-sm sm:text-lg transition ${
                  isSelected ? "bg-[var(--color-accent)] text-white rounded-full" : ""
                }`}
              >
                {day ?? ""} {/* null이면 빈칸 */}
              </div>
            );
          })}
        </div>
      </div>

      
    </div>
  );
};

export default CalendarBox;