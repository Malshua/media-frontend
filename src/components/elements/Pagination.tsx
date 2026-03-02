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
    <div className="flex items-center text-sm text-dark-1 font-medium">
      <button
        onClick={() => {
          setFirst(first - sliceDigit);
          setLast(last - sliceDigit);
        }}
        className="w-10 h-10 flex items-center justify-center rounded-l border"
        disabled={first === 0}
      >
        <Image src={caretLeftOrange} alt="Carret" />
      </button>
      {first > 0 && (
        <div className="mx-1 w-10 h-10 flex items-center justify-center border rounded">
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
              } mx-1 rounded w-10 h-10 border hover:text-primary-default hover:bg-alt-green/80 transition-all ease-in-out duration-300`}
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
        <div className="w-10 h-10 flex items-center justify-center border">
          ...
        </div>
      )}
      <button
        onClick={() => {
          setFirst(first + sliceDigit);
          setLast(last + sliceDigit);
        }}
        className="mx-1 w-10 h-10 flex items-center justify-center rounded-r border"
        disabled={last >= totalPage}
      >
        <Image src={caretRightOrange} alt="Caret" />
      </button>
    </div>
  );
};

export default Pagination;
