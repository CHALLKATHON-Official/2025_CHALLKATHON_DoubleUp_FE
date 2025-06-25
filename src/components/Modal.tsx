// src/components/Modal.tsx
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50  font-['IBM_Plex_Sans_KR']">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 relative w-full max-w-xs sm:max-w-sm -translate-y-10 sm:-translate-y-20">
        <button
          className="absolute top-2 right-4 text-gray-400 hover:text-black text-xl sm:text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;