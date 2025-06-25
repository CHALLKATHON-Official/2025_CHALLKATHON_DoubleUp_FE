import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Modal from "../components/Modal";

const Settings = () => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false); // 문의 모달
  const [editOpen, setEditOpen] = useState(false);   // 닉네임 모달
  const [newNickname, setNewNickname] = useState("");
  const [currentNickname, setCurrentNickname] = useState("");

  const goStats = () => navigate("/stats");
  const goBack = () => navigate("/calendar");
  const goTheme = () => navigate("/theme");

  // 현재 닉네임 불러오기
  useEffect(() => {
    const fetchNickname = async () => {
      const uid = getAuth().currentUser?.uid;
      if (!uid) return;
      const userDoc = await getDoc(doc(db, "user", uid));
      if (userDoc.exists()) {
        setCurrentNickname(userDoc.data().nickname || "");
      }
    };
    fetchNickname();
  }, []);

  // 닉네임 저장
  const handleSaveNickname = async () => {
    const uid = getAuth().currentUser?.uid;
    if (!uid || !newNickname.trim()) return;
    await updateDoc(doc(db, "user", uid), { nickname: newNickname.trim() });
    alert("닉네임이 변경되었습니다.");
    setCurrentNickname(newNickname.trim());
    setNewNickname("");
    setEditOpen(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-start pt-10 relative font-['IBM_Plex_Sans_KR'] bg-[var(--color-bg)]">
      {/* 왼쪽 상단 고정 뒤로가기 버튼 */}
      <button
        onClick={goBack}
        className="absolute top-4 left-4 flex items-center gap-1 text-base hover:text-black"
      >
        ❮ 뒤로가기
      </button>

      <div className="w-[90%] sm:w-full sm:max-w-sm h-[480px] shadow-md mt-9 border rounded-md px-4 sm:px-6 py-6 sm:py-8 bg-white">
        <p className="text-base sm:text-lg text-gray-500 mb-6">⚙ 설정</p>

        <div className="border-b border-gray-300 py-4">
          <p
            className="text-base sm:text-lg font-semibold text-black cursor-pointer hover:text-gray-600 transition"
            onClick={goStats}
          >
            통계 보기
          </p>
        </div>

        <div className="border-b border-gray-300 py-4">
          <p
            className="text-base sm:text-lg font-semibold text-black cursor-pointer hover:text-gray-600 transition"
            onClick={goTheme}
          >
            테마 설정
          </p>
        </div>

        <div className="border-b border-gray-300 py-4">
          <p
            className="text-base sm:text-lg font-semibold text-black cursor-pointer hover:text-gray-600 transition"
            onClick={() => setEditOpen(true)}
          >
            닉네임 변경
          </p>
          <p className="text-sm text-gray-500 mt-1 pl-1">현재 닉네임: {currentNickname || "없음"}</p>
        </div>

        <div className="border-b border-gray-300 py-4">
          <p
            className="text-base sm:text-lg font-semibold text-black cursor-pointer hover:text-gray-600 transition"
            onClick={() => setModalOpen(true)}
          >
            문의하기
          </p>
        </div>
      </div>

      {/* 문의 모달 */}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <div className="flex flex-col items-center p-5 text-center">
            <p className="mb-3 font-bold text-left pb-3">문의사항은<br />아래의 메일로 보내주세요!</p>
            <div className="mb-6 space-y-2 text-base text-gray-700">
              <p>📬 yunj@hufs.ac.kr</p>
              <p>📬 liruiyan@hufs.ac.kr</p>
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-1.5 text-sm sm:text-base text-white bg-[var(--color-btn)] rounded hover:bg-[var(--color-accent)]"
            >
              확인
            </button>
          </div>
        </Modal>
      )}

      {/* 닉네임 변경 모달 */}
      {editOpen && (
        <Modal isOpen={editOpen} onClose={() => setEditOpen(false)}>
          <div className="flex justify-center">
            <div className="w-[280px] sm:w-[300px] px-6 py-6 text-center flex flex-col items-center gap-4">
              <p className="text-base sm:text-lg font-semibold">닉네임 변경</p>
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                placeholder="새 닉네임을 입력하세요"
                className="w-full px-3 py-2 border rounded text-center text-sm sm:text-base"
              />
              <button
                onClick={handleSaveNickname}
                className="px-4 py-2 bg-[var(--color-btn)] text-white rounded hover:bg-[var(--color-btn-hover)]"
              >
                저장
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Settings;