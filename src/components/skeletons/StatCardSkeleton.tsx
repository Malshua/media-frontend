import React from "react";

const StatCardSkeleton = () => {
  return (
    <div className="h-60 p-8 flex flex-col gap-5 items-center justify-between shadow-neutral animate-pulse">
      <div className="flex justify-between items-center gap-2">
        <div className="h-2 w-36 bg-muted" />
        <div className="h-2 w-10 bg-muted" />
      </div>

      <div className="h-2 w-10 bg-muted" />
    </div>
  );
};

export default StatCardSkeleton;
