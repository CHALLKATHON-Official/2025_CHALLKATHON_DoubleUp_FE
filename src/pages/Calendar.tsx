//캘린더 페이지
import { useState, useEffect } from "react";
import CalendarBox from "../components/CalendarBox";
import AddTodoModal from "../components/AddTodoModal";
import MenuButton from "../components/MenuButton";
import { db } from "../firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface Todo {
  task: string;
  checked: boolean;
}

const formatDateKey = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const getStartOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    getStartOfDay(new Date())
  );
  const [todos, setTodos] = useState<Record<string, Todo[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  // auth 상태 확인 및 uid 설정
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("UID 감지됨:", user.uid);
        setUid(user.uid);
      } else {
        console.warn("로그인한 사용자가 없습니다.");
      }
    });
    return () => unsubscribe();
  }, []);
  //Todo 추가
  const handleAddTodo = async (task: string) => {
    if (!selectedDate || !uid) return;

    const dateKey = formatDateKey(selectedDate);
    const todoDocRef = doc(db, "user", uid, "todos", dateKey);
    const newTodo = { task, checked: false };

    const docSnap = await getDoc(todoDocRef);
    const existingTodos = docSnap.exists() ? docSnap.data().tasks || [] : [];

    await setDoc(todoDocRef, { tasks: [...existingTodos, newTodo] });

    setTodos((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTodo],
    }));

    setIsModalOpen(false);
  };
  //선택한 날짜에 Todo 저장
  const fetchTodos = async (date: Date) => {
    if (!uid) {
      console.warn("UID 없음으로 fetchTodos 중단됨");
      return;
    }

    const dateKey = formatDateKey(date);
    const todoDocRef = doc(db, "user", uid, "todos", dateKey);
    const docSnap = await getDoc(todoDocRef);
    const tasks = docSnap.exists() ? docSnap.data().tasks || [] : [];

    console.log("불러온 할 일:", dateKey, tasks);

    setTodos((prev) => ({
      ...prev,
      [dateKey]: tasks,
    }));
  };
  //사용자 계정, 선택한 날짜에 맞게 Todo적용
  useEffect(() => {
    if (uid && selectedDate) {
      fetchTodos(selectedDate);
    }
  }, [uid, selectedDate]);
  //Todo 완료/삭제 토글
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
  //Todo 삭제
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
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-start py-10 px-4 pt-20">
      <MenuButton />
      {/* 캘린더 영역 */}
      <CalendarBox
        selectedDate={selectedDate}
        onDateSelect={(date) => setSelectedDate(getStartOfDay(date))}
      />
      {/* Todo 영역 */}
      <div className="bg-white rounded-xl border border-gray-300 p-4 sm:p-6 mt-6 w-full max-w-3xl min-h-[300px] text-base sm:text-xl shadow-sm font-['IBM_Plex_Sans_KR']">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold ml-2 pt-1 text-lg sm:text-xl">할 일 목록</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xl sm:text-2xl font-bold mr-4"
          >
            +
          </button>
        </div>

        <div>
          {todos[formatDateKey(selectedDate)]?.length ? (
            todos[formatDateKey(selectedDate)].map((todo, index) => (
              <div key={index} className="mb-2 flex justify-between items-center ml-2 sm:ml-4 pt-2">
                <p className={`flex-1 text-sm sm:text-base ${todo.checked ? "line-through text-gray-400" : ""}`}>
                  {todo.task}
                </p>
                {/* Todo 체크 토글 */}
                <div className="flex items-center gap-2 mr-2 sm:mr-4">
                  <button
                    onClick={() => toggleTodoChecked(index)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      todo.checked ? "bg-[var(--color-accent)] border-[var(--color-accent)]" : "border-gray-400"
                    }`}
                  >
                    {todo.checked && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  {/* Todo 삭제 */}
                  <button
                    onClick={() => deleteTodo(index)}
                    className="text-[var(--color-btn)] hover:text-[var(--color-btn-hover)] transition duration-150"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm sm:text-base">할 일이 없습니다.</p>
          )}
        </div>
      </div>

      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTodo}
      />
    </div>
  );
};

export default CalendarPage;