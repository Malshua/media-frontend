import React from "react";

const ChatSkeleton = ({ number }: any) => {
  const sender = () => {
    if (number % 2) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="my-10 w-full">
      <div
        className={`flex w-full ${sender() ? "flex-row-reverse" : " ml-auto"}`}
      >
        <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>

        {/* message content */}
        <div
          className={`w-2/3 rounded py-10 bg-gray-200 animate-pulse ${
            sender() ? "ml-auto mr-3" : "ml-3"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default ChatSkeleton;
