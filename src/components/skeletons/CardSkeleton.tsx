import React from "react";

const CardSkeleton = () => {
  const count = [1, 2, 3];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {count?.map((_, index) => (
        <div key={index} className="bg-gray-200 rounded animate-pulse h-40" />
      ))}
    </div>
  );
};

export default CardSkeleton;
