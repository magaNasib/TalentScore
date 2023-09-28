// import React from "react";

const TextSkeleton = () => {
  return (
    <div className="flex flex-col py-2 space-y-2 animate-pulse">
      <div className="w-11/12 h-[8px] bg-gray-300 rounded-md "></div>
      <div className="w-10/12 h-[8px] bg-gray-300 rounded-md "></div>
      <div className="w-9/12 h-[8px] bg-gray-300 rounded-md "></div>
      <div className="w-9/12 h-[8px] bg-gray-300 rounded-md "></div>
    </div>
  );
};

export default TextSkeleton;
