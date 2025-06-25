import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import CopyID from "../components/CopyID";
import Modal from "../components/Modal";
//import BlueArrow from "../images/blueArrow.png";
import defaultBunny from "../images/default-bunny.png";
import FriendCard from "../components/FriendCard";

interface Friend {
  nickname: string;
  uniqueID: string;
  uid: string;
  isFocusing: boolean;
}

const Friends = () => {
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

  // 친구 실시간 상태 업데이트
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribeList: (() => void)[] = [];

    const fetchFriendsRealtime = async () => {
      const friendsRef = collection(db, "user", user.uid, "friends");
      const snapshot = await getDocs(friendsRef);

      for (const docSnap of snapshot.docs) {
        const { nickname, uniqueID } = docSnap.data();
        const friendUID = docSnap.id;

        const unsub = onSnapshot(doc(db, "user", friendUID), (userDoc) => {
          const isFocusing = userDoc.exists() && userDoc.data().isFocusing === true;

          setFriends((prev) => {
            const others = prev.filter((f) => f.uid !== friendUID);
            return [...others, { nickname, uniqueID, uid: friendUID, isFocusing }];
          });
        });

        unsubscribeList.push(unsub);
      }
    };

    fetchFriendsRealtime();

    return () => {
      unsubscribeList.forEach((unsub) => unsub());
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
      nickname: selectedUser.name,
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
    <div className="min-h-screen min-w-screen bg-white flex justify-center items-start py-10 font-['IBM_Plex_Sans_KR']">
      <div className="w-full max-w-md space-y-6 px-4">
        <button onClick={goBack} className="absolute top-4 left-4 flex items-center">
          {/* <img src={BlueArrow} alt="goBack" className="w-8 h-8" /> */}
          ❮ 뒤로가기
        </button>

        <div>
          <p className="mb-1 font-medium">내 아이디</p>
          <CopyID uniqueID={myUniqueID} />

          <p className="mb-1 font-medium pt-5">친구 추가</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputID}
              onChange={(e) => setInputID(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <button
              onClick={searchID}
              className="min-w-[90px] px-3 py-1  bg-[var(--color-btn)]  rounded hover:bg-[var(--color-btn-hover)]"
            >
              🔍 추가
            </button>
          </div>

          <p className="mb-2 font-medium pt-10">친구 목록</p>
          <div className="p-4 space-y-3 min-h-[400px] max-h-[400px] overflow-y-auto bg-white border rounded-lg">
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
            <div className="flex flex-col items-center gap-4 p-6 w-[280px] text-center">
              <img
                src={defaultBunny}
                alt="기본 프로필"
                className="w-20 h-20 rounded-full object-cover"
              />
              <p className="text-xl font-semibold">{selectedUser.name}</p>
              <button
                onClick={addFriend}
                className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300"
              >
                추가
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Friends;