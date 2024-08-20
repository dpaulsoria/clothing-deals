import React from 'react';

interface ReportIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const ReportIcon: React.FC<ReportIconProps> = ({
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
    <path d="M8 11V9H16V11H8ZM8 7V5H16V7H8ZM6 13H13.5C13.9833 13 14.4333 13.1042 14.85 13.3125C15.2667 13.5208 15.6167 13.8167 15.9 14.2L18 16.95V3H6V13ZM6 19H17.05L14.325 15.425C14.225 15.2917 14.1042 15.1875 13.9625 15.1125C13.8208 15.0375 13.6667 15 13.5 15H6V19ZM18 21H6C5.45 21 4.97917 20.8042 4.5875 20.4125C4.19583 20.0208 4 19.55 4 19V3C4 2.45 4.19583 1.97917 4.5875 1.5875C4.97917 1.19583 5.45 1 6 1H18C18.55 1 19.0208 1.19583 19.4125 1.5875C19.8042 1.97917 20 2.45 20 3V19C20 19.55 19.8042 20.0208 19.4125 20.4125C19.0208 20.8042 18.55 21 18 21Z" />
  </svg>
);

export default ReportIcon;
