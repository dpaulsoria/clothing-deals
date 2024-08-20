import React from 'react';

interface DeleteIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const DeleteIcon: React.FC<DeleteIconProps> = ({
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
    <g mask="url(#mask0_114_4996)">
      <path d="M7 20C6.45 20 5.97917 19.8042 5.5875 19.4125C5.19583 19.0208 5 18.55 5 18V5H4V3H9V2H15V3H20V5H19V18C19 18.55 18.8042 19.0208 18.4125 19.4125C18.0208 19.8042 17.55 20 17 20H7ZM17 5H7V18H17V5ZM9 16H11V7H9V16ZM13 16H15V7H13V16Z" />
    </g>
  </svg>
);

export default DeleteIcon;
