 // 친구 페이지
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import CopyID from "../components/CopyID";
import Modal from "../components/Modal";

const Friends = () => {
  const [myUniqueID, setMyUniqueID] = useState("");
  const [inputID, setInputID] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ name: string; photoURL: string; uniqueID: string } | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const navigate = useNavigate();

  interface Friend {
  nickname: string;
  photoURL: string;
  uniqueID: string; 
  status: string;
  }

  const goBack=()=>{
    navigate("/calendar");
  }

  //사용자 uniqueID불러오기(firestore에서)
  useEffect(() => {
    const fetchMyID = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, "user", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          console.log("uniqueID 확인용:", data.uniqueID); // 추가
          setMyUniqueID(data.uniqueID);
        }
      } else {
        console.warn("로그인된 유저가 없습니다.");
      }
    };

    fetchMyID();
  }, []);
    
  //ID로 친구 검색
  const searchID = async ()=>{
    if(!inputID.trim()) return;

    const q = query(collection(db, "user"), where("uniqueID", "==", inputID));
    const snapShot = await getDocs(q);

    if(snapShot.empty){
      alert("해당 사용자를 찾을 수 없습니다")
      return;
    }

    const docData = snapShot.docs[0].data();
    setSelectedUser({
      name: docData.nickname,
      photoURL: docData.photoURL,
      uniqueID: docData.uniqueID,
    });
    setModalOpen(true);
  };

  //검색한 친구 추가
  const addFriend = () => {
    if (selectedUser) {
      setFriends((prev) => [
        ...prev,
        {
          nickname: selectedUser.name,
          status: "집중하는 중...",
          photoURL: selectedUser.photoURL,
          uniqueID: selectedUser.uniqueID,
        },
      ]);
      setModalOpen(false);
      setInputID("");
    };
  };
  return(
    <div className="p-6 max-w-md mx-auto space-y-6">
      <button
        onClick={goBack}
        className="flex items-center gap-1 text-sm hover:text-black">
      <img src="src\images\blueArrow.png" alt="goBack" className="w-8 h-8"/>
      </button>

      <p className="mb-1 font-medium">내 아이디</p>
      {/* 아이디 복사 */}
      <div className="flex gap-2">
          <CopyID uniqueID={myUniqueID} />         
      </div>

      {/* 친구 추가 입력 */}
      <div>
        <p className="mb-1 font-medium">친구 추가</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputID}
            onChange={(e) => setInputID(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <button onClick={searchID} className="min-w-[90px] px-3 py-1 bg-blue-100 rounded hover:bg-blue-200">
            🔍 추가
          </button>
        </div>
      </div>

      {/* 친구 목록 */}
      <div>
        <p className="mb-2 font-medium">친구 목록</p>
        <div className="p-4 space-y-3 min-h-[400px] max-h-[400ox] overflow-y-auto bg-blue-50 rounded-lg">
          {friends.map((friend, idx) => (
            // 친구 프로필 목록
            <div key={idx} className="flex items-center gap-4 p-3 bg-white rounded-md shadow">
              <img
                src={friend.photoURL}
                alt="프로필"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-bold">{friend.nickname}</p>
                <p className="text-sm text-gray-500">{friend.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 친구 추가 모달 */}
      {modalOpen && selectedUser && (
        <Modal isOpen={modalOpen} onClose={()=>setModalOpen(false)}>
          <div className="flex flex-col items-center gap-4 p-4">
            <img
              src={selectedUser.photoURL}
              alt="프로필"
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
  )
};

export default Friends;



