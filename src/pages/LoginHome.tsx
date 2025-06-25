// 아이디 등록 홈 페이지

import { auth, provider, db } from "../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc"

const LoginHome = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userRef = doc(db, "user", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // 신규 유저
          const randomId = Math.random().toString(36).substring(2, 10);

          localStorage.setItem("uid", user.uid);

          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "",
            uniqueID: randomId,
          });

          navigate("/welcome", {
            state: {
              uniqueID: randomId,
            },
          });
        } else {
          // 기존 유저
          const userData = userSnap.data();

          if (!userData.nickname) {
            navigate("/welcome", {
              state: {
                uniqueID: userData.uniqueID,
              },
            });
          } else {
            navigate("/calendar", {
              state: {
                uniqueID: userData.uniqueID,
                nickname: userData.nickname,
              },
            });
          }
        }
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 실패");
      navigate("/Notfound");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* 제목과 소개 문장 영역 */}
      <div className="mb-24 text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-2 pt-20 pb-10">25H</h1>
        <p className="text-lg text-gray-600">25분 뽀모도로 집중하기</p>
      </div>

      {/* 로그인 버튼 영역 */}
      <div className="mt-20 flex items-center justify-center">
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 px-6 py-3 min-w-[256px] rounded-lg border border-gray-300 bg-white text-gray-700 shadow hover:bg-gray-100 transition"
        >
          <FcGoogle size={20} />
          <span className="text-base text-gray-700 font-normal">구글 로그인</span>
        </button>
      </div>
    </div>
  );
};

export default LoginHome;