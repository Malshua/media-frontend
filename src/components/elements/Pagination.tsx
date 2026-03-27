"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  caretLeftOrange,
  caretRightOrange,
} from "../../../public/assets/icons";

interface PaginationTypes {
  totalPage: number;
  setCurrentPage: any;
  currentPage: number;
}

const numbers = (data: number) =>
  Array(data)
    .fill(0)
    .map((n, i) => i + 1);

const Pagination = ({
  totalPage,
  setCurrentPage,
  currentPage,
}: PaginationTypes) => {
  const sliceDigit = 8;
  const [first, setFirst] = useState(0);
  const [last, setLast] = useState(sliceDigit);
  // slice(0,8)

  const slicePage = (first: number | undefined, last: number | undefined) => {
    return numbers(totalPage).slice(first, last);
  };

  return (
    <div className="flex items-center text-sm text-dark-1 font-medium overflow-x-auto max-w-full">
      <button
        onClick={() => {
          setFirst(first - sliceDigit);
          setLast(last - sliceDigit);
        }}
        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-l border flex-shrink-0"
        disabled={first === 0}
      >
        <Image src={caretLeftOrange} alt="Carret" />
      </button>
      {first > 0 && (
        <div className="mx-0.5 md:mx-1 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border rounded flex-shrink-0 text-xs md:text-sm">
          ...
        </div>
      )}
      {slicePage(first, last).length > 0 &&
        slicePage(first, last).map((num) => {
          return (
            <button
              className={`${
                num === currentPage
                  ? "bg-primary-soft text-primary-default"
                  : ""
              } mx-0.5 md:mx-1 rounded w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm border hover:text-primary-default hover:bg-alt-green/80 transition-all ease-in-out duration-300 flex-shrink-0`}
              onClick={() => {
                setCurrentPage(num);
              }}
              key={num}
            >
              {num}
            </button>
          );
        })}
      {last < totalPage && (
        <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border flex-shrink-0 text-xs md:text-sm">
          ...
        </div>
      )}
      <button
        onClick={() => {
          setFirst(first + sliceDigit);
          setLast(last + sliceDigit);
        }}
        className="mx-0.5 md:mx-1 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-r border flex-shrink-0"
        disabled={last >= totalPage}
      >
        <Image src={caretRightOrange} alt="Caret" />
      </button>
    </div>
  );
};

export default Pagination;
