import React from "react";

const CardSkeleton2 = ({ count }: { count: number }) => {
  return (
    <>
      {[...Array(count)]?.map((_, index) => (
        <div key={index} className="bg-gray-200 rounded animate-pulse h-40" />
      ))}
    </>
  );
};

export default CardSkeleton2;
