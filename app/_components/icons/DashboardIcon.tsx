import React from 'react';

interface DashboardIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const DashboardIcon: React.FC<DashboardIconProps> = ({
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
    <path d="M9 2H5C3.89543 2 3 2.89543 3 4V8C3 9.10457 3.89543 10 5 10H9C10.1046 10 11 9.10457 11 8V4C11 2.89543 10.1046 2 9 2Z" />
    <path d="M19 2H15C13.8954 2 13 2.89543 13 4V8C13 9.10457 13.8954 10 15 10H19C20.1046 10 21 9.10457 21 8V4C21 2.89543 20.1046 2 19 2Z" />
    <path d="M9 12H5C3.89543 12 3 12.8954 3 14V18C3 19.1046 3.89543 20 5 20H9C10.1046 20 11 19.1046 11 18V14C11 12.8954 10.1046 12 9 12Z" />
    <path d="M19 12H15C13.8954 12 13 12.8954 13 14V18C13 19.1046 13.8954 20 15 20H19C20.1046 20 21 19.1046 21 18V14C21 12.8954 20.1046 12 19 12Z" />
  </svg>
);

export default DashboardIcon;
