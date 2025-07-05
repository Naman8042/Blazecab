import { FaCarSide } from "react-icons/fa";

const Loading = () => {
  return (
    <div
      role="status"
      className="h-[89.75vh] w-full flex items-center justify-center bg-white"
    >
      <div
        className="rounded-full p-6 border-4 border-gray-200 border-t-[#6aa4e0]"
        style={{ animation: "spin 2s linear infinite" }}
      >
        <FaCarSide className="text-[#6aa4e0] text-3xl" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;
