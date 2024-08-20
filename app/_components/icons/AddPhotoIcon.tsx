import React from 'react';

interface AddPhotoIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const AddPhotoIcon: React.FC<AddPhotoIconProps> = ({
  className = '',
  width = 30,
  height = 30,
}) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 20C4.45 20 3.97917 19.8042 3.5875 19.4125C3.19583 19.0208 3 18.55 3 18V4C3 3.45 3.19583 2.97917 3.5875 2.5875C3.97917 2.19583 4.45 2 5 2H14V4H5V18H19V9H21V18C21 18.55 20.8042 19.0208 20.4125 19.4125C20.0208 19.8042 19.55 20 19 20H5ZM17 8V6H15V4H17V2H19V4H21V6H19V8H17ZM6 16H18L14.25 11L11.25 15L9 12L6 16Z" />
  </svg>
);

export default AddPhotoIcon;
