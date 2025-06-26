//Todo 추가 모달
import React, { useState } from "react";

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: string) => void;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [task, setTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      onAdd(task.trim());
      setTask("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg p-6 w-72 min-h-[100px] min-w-[400px]">
        <h2 className="text-lg font-bold mb-4">할 일 추가</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="할 일 입력"
            className="border rounded px-2 py-1"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-500 border px-3 py-1.5 "
            >
              취소
            </button>
            <button
              type="submit"
              className="text-white px-3 py-1.5 text-sm bg-[var(--color-btn)] rounded hover:bg-[var(--color-btn-hover)]"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTodoModal;