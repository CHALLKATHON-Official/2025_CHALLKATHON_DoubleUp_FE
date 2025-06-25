// 친구 목록에서 친구 한 명을 표시하는 카드. 이름, 기본 프로필, 집중 상태 포함
import defaultBunny from "../images/default-bunny.png";

interface FriendCardProps {
  nickname: string;
  status: string;
  onDelete?: () => void;
}

const pastelColors = [
  "#F9C8D9", "#D1F9C8", "#C8E7F9", "#FFE7CC", "#E5D1F9", "#F9F1C8"
];

const FriendCard = ({ nickname, status, onDelete }: FriendCardProps) => {
  const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-md shadow">
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: randomColor }}
        >
          <img
            src={defaultBunny}
            alt={`${nickname}의 프로필`}
            className="w-6 h-6"
          />
        </div>
        <div>
          <p className="font-bold">{nickname}</p>
          <p className="text-sm text-gray-500">{status}</p>
        </div>
      </div>
      <button
        onClick={onDelete}
        className="text-sm text-red-400 hover:text-red-600"
      >
        삭제
      </button>
    </div>
  );
};

export default FriendCard;