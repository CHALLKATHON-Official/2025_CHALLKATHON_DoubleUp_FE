import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import CopyID from "../components/CopyID";
import Modal from "../components/Modal";
import defaultBunny from "../images/default-bunny.png";
import FriendCard from "../components/FriendCard";

interface Friend {
  nickname: string;
  uniqueID: string;
  uid: string;
  isFocusing: boolean;
}

const pastelColors = [
  "#F9C8D9",
  "#D1F9C8",
  "#C8E7F9",
  "#FFE7CC",
  "#E5D1F9",
  "#F9F1C8",
];

const Friends = () => {
  const randomColor =
    pastelColors[Math.floor(Math.random() * pastelColors.length)];
  const [myUniqueID, setMyUniqueID] = useState("");
  const [inputID, setInputID] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    name: string;
    uniqueID: string;
    uid: string;
  } | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const navigate = useNavigate();

  const goBack = () => navigate("/calendar");

  // 내 ID 불러오기
  useEffect(() => {
    const fetchMyID = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userSnap = await getDoc(doc(db, "user", user.uid));
        if (userSnap.exists()) {
          setMyUniqueID(userSnap.data().uniqueID);
        }
      }
    };
    fetchMyID();
  }, []);

  // 친구 목록 + 상태 실시간 구독
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const friendsRef = collection(db, "user", user.uid, "friends");
    const unsubList: (() => void)[] = [];

    const friendsUnsub = onSnapshot(friendsRef, (snapshot) => {
      const currentUIDs: string[] = [];

      snapshot.forEach((docSnap) => {
        const { uniqueID } = docSnap.data(); // nickname은 제외
        const friendUID = docSnap.id;
        currentUIDs.push(friendUID);

        const userUnsub = onSnapshot(doc(db, "user", friendUID), (userDoc) => {
          if (!userDoc.exists()) return;

          const data = userDoc.data();
          const nickname = data.nickname || "(알 수 없음)";
          const isFocusing = data.isFocusing === true;

          setFriends((prev) => {
            const others = prev.filter((f) => f.uid !== friendUID);
            return [...others, { nickname, uniqueID, uid: friendUID, isFocusing }];
          });
        });

        unsubList.push(userUnsub);
      });

      // 친구 목록에서 빠진 유저 제거
      setFriends((prev) => prev.filter((f) => currentUIDs.includes(f.uid)));
    });

    unsubList.push(friendsUnsub);

    return () => {
      unsubList.forEach((unsub) => unsub());
    };
  }, []);

  // ID 검색
  const searchID = async () => {
    if (!inputID.trim()) return;
    const auth = getAuth();
    const user = auth.currentUser;
    const q = query(collection(db, "user"), where("uniqueID", "==", inputID));
    const snapShot = await getDocs(q);

    if (snapShot.empty || !user) {
      alert("해당 ID의 사용자를 찾을 수 없습니다.");
      return;
    }

    const docData = snapShot.docs[0].data();
    const docId = snapShot.docs[0].id;

    if (docId === user.uid) {
      alert("자기 자신은 친구로 추가할 수 없습니다.");
      return;
    }

    const alreadyFriend = friends.some((f) => f.uid === docId);
    if (alreadyFriend) {
      alert("이미 친구로 등록된 사용자입니다.");
      return;
    }

    setSelectedUser({
      name: docData.nickname,
      uniqueID: docData.uniqueID,
      uid: docId,
    });
    setModalOpen(true);
  };

  // 친구 추가
  const addFriend = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !selectedUser) return;

    const myUid = user.uid;
    const friendUid = selectedUser.uid;

    await setDoc(doc(db, "user", myUid, "friends", friendUid), {
      nickname: selectedUser.name, // 그냥 저장은 함
      uniqueID: selectedUser.uniqueID,
    });

    setModalOpen(false);
    setInputID("");
  };

  // 친구 삭제
  const deleteFriend = async (uid: string) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    await deleteDoc(doc(db, "user", user.uid, "friends", uid));
    setFriends((prev) => prev.filter((f) => f.uid !== uid));
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center py-10 px-4 font-['IBM_Plex_Sans_KR']">
      <div className="w-full max-w-md px-4">
        <button onClick={goBack} className="absolute top-4 left-4 flex items-center text-base">
          ❮ 뒤로가기
        </button>

        <div>
          <p className="mb-1 font-medium pt-6">내 아이디</p>
          <CopyID uniqueID={myUniqueID} />

          <p className="mb-1 font-medium pt-5">친구 추가</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputID}
              onChange={(e) => setInputID(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <button
              onClick={searchID}
              className="min-w-[90px] px-3 py-2 text-sm sm:text-base bg-[var(--color-btn)] rounded hover:bg-[var(--color-btn-hover)]"
            >
              🔍 추가
            </button>
          </div>

          <p className="mb-2 font-medium pt-10">친구 목록</p>
          <div className="p-4 space-y-3 h-[calc(100vh-450px)] overflow-y-auto bg-white border rounded-lg">
            {friends.map((friend) => (
              <div key={friend.uid} className="flex justify-between items-center">
                <FriendCard
                  nickname={friend.nickname}
                  status={friend.isFocusing ? "타이머 사용 중..." : ""}
                  onDelete={() => deleteFriend(friend.uid)}
                />
              </div>
            ))}
          </div>
        </div>

        {modalOpen && selectedUser && (
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-4 p-6 w-[280px] sm:w-[300px] text-center">
                <img
                  src={defaultBunny}
                  alt="기본 프로필"
                  className="w-20 h-20 rounded-full object-cover"
                  style={{ backgroundColor: randomColor }}
                />
                <p className="text-xl font-semibold">{selectedUser.name}</p>
                <button
                  onClick={addFriend}
                  className="px-4 py-2 bg-[var(--color-btn)] rounded hover:bg-[var(--color-btn-hover)] text-white"
                >
                  추가
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Friends;