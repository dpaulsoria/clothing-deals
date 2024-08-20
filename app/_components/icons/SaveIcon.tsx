import React from 'react';

interface SaveIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const SaveIcon: React.FC<SaveIconProps> = ({
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
    <g mask="url(#mask0_70_3589)">
      <path d="M21 6V18C21 18.55 20.8042 19.0208 20.4125 19.4125C20.0208 19.8042 19.55 20 19 20H5C4.45 20 3.97917 19.8042 3.5875 19.4125C3.19583 19.0208 3 18.55 3 18V4C3 3.45 3.19583 2.97917 3.5875 2.5875C3.97917 2.19583 4.45 2 5 2H17L21 6ZM19 6.85L16.15 4H5V18H19V6.85ZM12 17C12.8333 17 13.5417 16.7083 14.125 16.125C14.7083 15.5417 15 14.8333 15 14C15 13.1667 14.7083 12.4583 14.125 11.875C13.5417 11.2917 12.8333 11 12 11C11.1667 11 10.4583 11.2917 9.875 11.875C9.29167 12.4583 9 13.1667 9 14C9 14.8333 9.29167 15.5417 9.875 16.125C10.4583 16.7083 11.1667 17 12 17ZM6 9H15V5H6V9Z" />
    </g>
  </svg>
);

export default SaveIcon;
