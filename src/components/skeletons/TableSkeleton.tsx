import React from 'react';

const TableSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full h-12 bg-secondary-soft rounded animate-pulse" />

      <div className="flex flex-col gap-1">
        {[...Array(5)]?.map((_, index) => (
          <div
            key={index}
            className="w-full h-12 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
