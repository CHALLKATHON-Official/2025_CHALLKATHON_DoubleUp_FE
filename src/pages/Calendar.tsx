import { useState, useEffect } from "react";
import CalendarBox from "../components/CalendarBox";
import AddTodoModal from "../components/AddTodoModal";
import MenuButton from "../components/MenuButton";
import { db } from "../firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Todo 항목 타입 정의
interface Todo {
  task: string;
  checked: boolean;
}

// 날짜를 'YYYY-MM-DD' 형식의 문자열로 변환
const formatDateKey = (date: Date) => {
  return date.toISOString().split("T")[0];
};

// 날짜의 시각 정보를 제거 (자정 00:00:00 기준으로 설정)
const getStartOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const CalendarPage = () => {
  // 선택된 날짜 상태 (기본값: 오늘 날짜)
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    getStartOfDay(new Date())
  );

  // 날짜별 할 일 목록을 저장하는 객체
  const [todos, setTodos] = useState<Record<string, Todo[]>>({});

  // 할 일 추가 모달 열림 여부
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 현재 로그인한 사용자 UID (로컬 스토리지에서 불러옴)
  const uid = localStorage.getItem("uid");

  // 새 할 일 추가
  const handleAddTodo = async (task: string) => {
    if (!selectedDate || !uid) return;

    const dateKey = formatDateKey(selectedDate);
    const todoDocRef = doc(db, "user", uid, "todos", dateKey);

    const newTodo = { task, checked: false };

    // 기존 할 일 불러오기
    const docSnap = await getDoc(todoDocRef);
    const existingTodos = docSnap.exists() ? docSnap.data().tasks || [] : [];

    // 새 할 일 Firestore에 저장
    await setDoc(todoDocRef, { tasks: [...existingTodos, newTodo] });

    // 로컬 상태 업데이트
    setTodos((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTodo],
    }));

    setIsModalOpen(false);
  };

  // 선택한 날짜의 할 일을 Firestore에서 불러오기
  const fetchTodos = async (date: Date) => {
    if (!uid) return;

    const dateKey = formatDateKey(date);
    const todoDocRef = doc(db, "user", uid, "todos", dateKey);
    const docSnap = await getDoc(todoDocRef);

    const tasks = docSnap.exists() ? docSnap.data().tasks || [] : [];

    // 상태에 해당 날짜의 할 일 저장
    setTodos((prev) => ({
      ...prev,
      [dateKey]: tasks,
    }));
  };

  // 선택한 날짜가 바뀔 때마다 할 일 fetch
  useEffect(() => {
    fetchTodos(selectedDate);
  }, [selectedDate]);

  // 체크박스 토글 시 완료 상태 변경
  const toggleTodoChecked = async (index: number) => {
    if (!selectedDate || !uid) return;

    const dateKey = formatDateKey(selectedDate);
    const todoDocRef = doc(db, "user", uid, "todos", dateKey);

    const updated = [...(todos[dateKey] || [])];
    updated[index].checked = !updated[index].checked;

    setTodos((prev) => ({
      ...prev,
      [dateKey]: updated,
    }));

    await setDoc(todoDocRef, { tasks: updated });
  };

  // 할 일 삭제
  const deleteTodo = async (index: number) => {
    if (!selectedDate || !uid) return;

    const dateKey = formatDateKey(selectedDate);
    const todoDocRef = doc(db, "user", uid, "todos", dateKey);

    const updated = [...(todos[dateKey] || [])];
    updated.splice(index, 1);

    setTodos((prev) => ({
      ...prev,
      [dateKey]: updated,
    }));

    await setDoc(todoDocRef, { tasks: updated });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 relative">
      {/* 메뉴 버튼 */}
      <MenuButton />

      {/* 캘린더 박스 컴포넌트 - 날짜 선택 시 setSelectedDate 실행 */}
      <CalendarBox
        selectedDate={selectedDate}
        onDateSelect={(date) => setSelectedDate(getStartOfDay(date))}
      />

      {/* 할 일 목록 박스 */}
      <div className="bg-white mt-4 w-[300px] rounded-xl border border-gray-300 p-4 shadow-sm text-sm relative">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">할 일 목록</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xl font-bold"
          >
            +
          </button>
        </div>

        <div>
          {/* 할 일 목록이 있을 때와 없을 때 조건 분기 */}
          {todos[formatDateKey(selectedDate)]?.length ? (
            todos[formatDateKey(selectedDate)].map((todo, index) => (
              <div key={index} className="mb-2 flex justify-between items-center">
                <p className={todo.checked ? "line-through text-gray-400" : ""}>
                  {todo.task}
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.checked}
                    onChange={() => toggleTodoChecked(index)}
                  />
                  <button
                    onClick={() => deleteTodo(index)}
                    className="text-xs font-bold"
                  >
                    X
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">할 일이 없습니다.</p>
          )}
        </div>
      </div>

      {/* 할 일 추가 모달 */}
      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTodo}
      />
    </div>
  );
};

export default CalendarPage;