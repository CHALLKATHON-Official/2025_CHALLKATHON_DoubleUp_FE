// 아이디 등록 홈 페이지

import { auth, provider, db } from "../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc"

const LoginHome = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async() =>{
    try {
      const result = await signInWithPopup(auth, provider); //로그인
      const user = result.user; //사용자 정보 저장

      if(user){
        const userRef = doc(db,"user", user.uid);
        const userSnap = await getDoc(userRef);

        if(!userSnap.exists()){
          //문서 없을 시 새로 저장(신규 가입자)
          const randomId = Math.random().toString(36).substring(2, 10) //8자리 고유번호
          await setDoc(userRef,{
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            uniqueID: randomId,
            photoURL: user.photoURL,
          });

          //최초 가입자 -> welcome 페이지
          localStorage.setItem("uniqueID", randomId);
          navigate("/Login", {state:{uniqueID: randomId}});

        } else {
          //기존 사용자는 바로 캘린더로
          const uniqueID = userSnap.data().uniqueID;
          localStorage.setItem("uniqueID", uniqueID);
          navigate("/Calendar");          
        }
      }
    } catch (error){
        console.error("로그인 오류", error);
        alert("로그인 실패");
        navigate("/Notfound");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] bg-white">
      {/* 제목과 소개 문장 영역 */}
      <div className="mb-24 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-2">25H</h1>
        <p className="text-lg text-gray-600 mb-6">25분 뽀모도로 집중하기</p>
      </div>

      {/* 로그인 버튼 영역 */}
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 w-64 min-w-[256px] min-h-[48px] py-2 px-4 border border-gray-300 rounded-[10px] bg-[#FFFFFF]"
      >
        <FcGoogle size={20} />
        <span className="text-base text-gray-700 font-normal">구글 로그인</span>
      </button>

    </div>
    
  );
};

export default LoginHome;
