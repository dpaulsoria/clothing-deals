import React from 'react';

interface LayerIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const LayerIcon: React.FC<LayerIconProps> = ({
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
   <g mask="url(#mask0_100_3408)">
<path d="M12 21.05L3 14.05L4.65 12.8L12 18.5L19.35 12.8L21 14.05L12 21.05ZM12 16L3 9L12 2L21 9L12 16ZM12 13.45L17.75 9L12 4.55L6.25 9L12 13.45Z" />
</g>
  </svg>
);

export default LayerIcon;
