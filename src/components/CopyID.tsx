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
    <div className="w-full">
        {/* <p className="text-base text-gray-600 mb-1">내 아이디</p> */}
        <div className="flex gap-2">
            <input
            type="text"
            value={uniqueID}
            readOnly
            className="w-full px-4 py-2 border rounded"
            />
            <button
            onClick={handleCopy}
            className="min-w-[90px] px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
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
