import React from 'react';

interface MenuIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const MenuIcon: React.FC<MenuIconProps> = ({
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
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 6H20V8H12V6ZM4 16H12V18H4V16ZM20 11H4V13H20V11Z"
    />
  </svg>
);

export default MenuIcon;
