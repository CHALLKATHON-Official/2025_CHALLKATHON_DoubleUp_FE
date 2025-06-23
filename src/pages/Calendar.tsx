import { useState } from "react";
import CalendarBox from "../components/CalendarBox";
import AddTodoModal from "../components/AddTodoModal";
import MenuButton from "../components/MenuButton";

interface Todo {
  task: string;
  checked: boolean;
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [todos, setTodos] = useState<Record<string, Todo[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTodo = (task: string) => {
    if (!selectedDate) return;
    const dateKey = selectedDate.toDateString();
    const updatedTodos = {
      ...todos,
      [dateKey]: [...(todos[dateKey] || []), { task, checked: false }],
    };
    setTodos(updatedTodos);
    setIsModalOpen(false);
  };

  const toggleTodoChecked = (index: number) => {
    if (!selectedDate) return;
    const dateKey = selectedDate.toDateString();
    const updated = [...(todos[dateKey] || [])];
    updated[index].checked = !updated[index].checked;
    setTodos({ ...todos, [dateKey]: updated });
  };

  const deleteTodo = (index: number) => {
    if (!selectedDate) return;
    const dateKey = selectedDate.toDateString();
    const updated = [...(todos[dateKey] || [])];
    updated.splice(index, 1);
    setTodos({ ...todos, [dateKey]: updated });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 relative">
      <MenuButton />

      <CalendarBox selectedDate={selectedDate} onDateSelect={setSelectedDate} />

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
          {selectedDate ? (
            todos[selectedDate.toDateString()]?.length ? (
              todos[selectedDate.toDateString()].map((todo, index) => (
                <div
                  key={index}
                  className="mb-2 flex justify-between items-center"
                >
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
            )
          ) : (
            <p className="text-gray-400">날짜를 선택하세요.</p>
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