import React from 'react';

interface ic_roundarrowdropupIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const ic_roundarrowdropupIcon: React.FC<ic_roundarrowdropupIconProps> = ({
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
    <path d="M31.854 24.3958L26.4582 29.7917C26.2654 29.9848 26.0365 30.138 25.7845 30.2426C25.5325 30.3471 25.2623 30.4009 24.9894 30.4009C24.7166 30.4009 24.4464 30.3471 24.1944 30.2426C23.9424 30.138 23.7134 29.9848 23.5207 29.7917L18.1249 24.3958C16.8124 23.0833 17.7499 20.8333 19.604 20.8333H30.3957C32.2499 20.8333 33.1665 23.0833 31.854 24.3958Z" />
  </svg>
);

export default ic_roundarrowdropupIcon;
