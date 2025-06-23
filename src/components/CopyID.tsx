import { useState } from "react";

const CopyID = ({ uniqueID }: { uniqueID: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(uniqueID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // 복사 완료 메시지 1.5초 후 사라짐
    } catch (err) {
      console.error("복사 실패", err);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
        <p className="text-base text-gray-600 mb-1">내 아이디</p>
        <div className="flex items-center space-x-2">
            <input
            type="text"
            value={uniqueID}
            readOnly
            className="w-72 text-center px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 shadow-sm"
            />
            <button
            onClick={handleCopy}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition"
            >
            📋 복사
            </button>
        </div>
        {copied && (
            <p className="mt-2 text-sm text-green-600">아이디가 복사되었습니다</p>
        )}
    </div>
  );
};

export default CopyID;
