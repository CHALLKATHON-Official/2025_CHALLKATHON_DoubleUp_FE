//신규 가입자 환영 페이지로 변경 예정

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CopyID from "../components/CopyID";


const Welcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const uniqueID = location.state?.uniqueID || localStorage.getItem("uniqueID");

  useEffect(()=>{
    if(!uniqueID){
      navigate("/NotFound"); //ID없을 시 오류 페이지로 이동
    }
  },[uniqueID, navigate]);

  const handleStart = () =>{
    navigate("/Calendar");
  };
  
  return (
    <div  className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">가입을 환영합니다!</h1>
      
      <CopyID uniqueID={uniqueID||""}/>

      <ul className="mb-6 text-sm text-gray-500 space-y-1">
        <li>📢 아이디는 최초 가입 시 부여되며, 수정할 수 없습니다. </li>
        <li>📢 이후 친구목록에서 내 아이디를 확인할 수 있습니다.</li>
      </ul>

      <button onClick={handleStart} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow transition">시작하기</button>
    </div>
  );

};

export default Welcome;