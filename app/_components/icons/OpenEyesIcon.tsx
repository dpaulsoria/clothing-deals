
import React from 'react';

interface OpenEyesIconProps {
  className?: string;
  stroke?: string;
  width?: number | string;
  height?: number | string;
}

const OpenEyesIcon: React.FC<OpenEyesIconProps> = ({
  className = '',
  width = 30,
  height = 30,
  stroke="#78716c"
}) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    stroke={stroke}
  >
    <path d="M9 4.46001C9.97019 4.15245 10.9822 3.99727 12 4.00001C16.182 4.00001 19.028 6.50001 20.725 8.70401C21.575 9.81001 22 10.361 22 12C22 13.64 21.575 14.191 20.725 15.296C19.028 17.5 16.182 20 12 20C7.818 20 4.972 17.5 3.275 15.296C2.425 14.192 2 13.639 2 12C2 10.36 2.425 9.80901 3.275 8.70401C3.79336 8.02671 4.37061 7.39659 5 6.82101"  strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12Z"  strokeWidth="1.5" />


  </svg>
);

export default OpenEyesIcon;

