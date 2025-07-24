import Image from 'next/image';

import React from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import { IoCloseOutline } from 'react-icons/io5';
import { searchWhiteIcon } from '../../../public/assets/icons';

interface SearchWidgetProps {
  refetch?: () => void;
  searchText: string;
  setSearchText: (value: string) => void;
}

const SearchWidget = ({
  refetch,
  searchText,
  setSearchText,
}: SearchWidgetProps) => {
  const searchTable = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchText.trim()) {
      refetch?.();
    }
  };

  const clearSearch = () => {
    setSearchText(''); // Clear input
    setTimeout(() => refetch?.(), 0); // Trigger refetch after clearing input
  };

  return (
    <form onSubmit={searchTable}>
      <div className="flex items-center">
        {/* Input container with clear button */}
        <div className="flex flex-1 items-center border border-primary-soft rounded focus-within:border-primary-default transition-all ease-in-out duration-300 focus:bg-white w-56">
          <input
            type="text"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            className="flex-1 text-sm bg-transparent py-2 px-2 outline-none placeholder:text-sm"
            placeholder="Search table..."
          />

          {searchText && (
            <button
              type="button"
              onClick={clearSearch}
              className="h-full px-2 text-secondary-default text-lg font-bold"
            >
              <IoCloseOutline />
            </button>
          )}
        </div>

        {/* Search button */}
        <button
          type="submit"
          className="ml-3 h-9 w-9 bg-primary-default flex items-center justify-center rounded-md"
        >
          <Image src={searchWhiteIcon} alt="search" height={20} width={20} />
        </button>
      </div>
    </form>
  );
};

export default SearchWidget;
