import Image from 'next/image';
import React from 'react';
import { emptyState } from '../../../public/assets/images';

interface EmptyStateTypes {
  label?: any;
  img?: string;
  imgWidth?: any;
  imgHeight?: any;
}

const EmptyState = ({ img, label, imgHeight, imgWidth }: EmptyStateTypes) => {
  return (
    <div className="py-5 flex flex-col items-center justify-center">
      <Image
        src={img || emptyState}
        alt="empty state image"
        width={imgWidth || 316}
        height={imgHeight || 275}
        priority={true}
      />
      <div className="mt-5 text-light-1">{label || 'No activity here'}</div>
    </div>
  );
};

export default EmptyState;
