import React from 'react';

interface DownloadIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const DownloadIcon: React.FC<DownloadIconProps> = ({
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
    <path d="M5.23901 14.812C5.63783 16.3005 6.51664 17.6157 7.73915 18.5538C8.96167 19.4919 10.4596 20.0003 12.0005 20.0003C13.5415 20.0003 15.0394 19.4919 16.2619 18.5538C17.4844 17.6157 18.3632 16.3005 18.762 14.812" stroke="#9747FF" strokeWidth="2" />
    <path d="M12 13L11.375 13.78L12 14.28L12.625 13.78L12 13ZM13 4C13 3.73478 12.8946 3.48043 12.7071 3.29289C12.5196 3.10536 12.2652 3 12 3C11.7348 3 11.4804 3.10536 11.2929 3.29289C11.1054 3.48043 11 3.73478 11 4H13ZM6.375 9.78L11.375 13.78L12.625 12.22L7.625 8.22L6.375 9.78ZM12.625 13.78L17.625 9.78L16.375 8.22L11.375 12.22L12.625 13.78ZM13 13V4H11V13H13Z" />

  </svg>
);

export default DownloadIcon;
