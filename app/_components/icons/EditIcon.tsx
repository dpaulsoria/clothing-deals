import React from 'react';

interface EditIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const EditIcon: React.FC<EditIconProps> = ({
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
<g mask="url(#mask0_100_3407)">
<path d="M13.775 4H7V2H15.775L13.775 4ZM9.775 8H4V6H11.775L9.775 8ZM5.775 12H1V10H7.775L5.775 12ZM14.6 14L12 11.4L7 16.4L9.6 19L14.6 14ZM13.425 9.975L16.025 12.575L21 7.6L18.4 5L13.425 9.975ZM11.325 9.275L16.725 14.675L11 20.4C10.6 20.8 10.1333 21 9.6 21C9.06667 21 8.6 20.8 8.2 20.4L8.15 20.35L7.5 21H2.5L5.65 17.85L5.6 17.8C5.2 17.4 5 16.9333 5 16.4C5 15.8667 5.2 15.4 5.6 15L11.325 9.275ZM11.325 9.275L17 3.6C17.4 3.2 17.8667 3 18.4 3C18.9333 3 19.4 3.2 19.8 3.6L22.4 6.2C22.8 6.6 23 7.06667 23 7.6C23 8.13333 22.8 8.6 22.4 9L16.725 14.675L11.325 9.275Z" />
</g>
</svg>
);

export default EditIcon;
