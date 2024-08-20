
import React from 'react';

interface RasterIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const RasterIcon: React.FC<RasterIconProps> = ({
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
 <g mask="url(#mask0_110_3162)">
<path d="M19 21H5C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21ZM5 19H12V11L19 19V5H12V11L5 19Z" />
</g>

  </svg>
);

export default RasterIcon;

