import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  width?: string;
  className?: string;
}

const Wrapper = ({ children, width, className }: WrapperProps) => {
  return (
    <div
      className={`px-4 py-4 md:px-8 mx-auto ${
        width || 'lg:w-11/12 2xl:w-4/5'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Wrapper;
