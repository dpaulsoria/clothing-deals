import React from 'react';

interface MoveIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const MoveIcon: React.FC<MoveIconProps> = ({
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
<g mask="url(#mask0_70_4598)">
<path d="M12 21L7.75 16.75L9.175 15.325L11 17.15V12H5.875L7.7 13.8L6.25 15.25L2 11L6.225 6.775L7.65 8.2L5.85 10H11V4.85L9.175 6.675L7.75 5.25L12 1L16.25 5.25L14.825 6.675L13 4.85V10H18.125L16.3 8.2L17.75 6.75L22 11L17.75 15.25L16.325 13.825L18.15 12H13V17.125L14.8 15.3L16.25 16.75L12 21Z" />
</g>  </svg>
);

export default MoveIcon;
