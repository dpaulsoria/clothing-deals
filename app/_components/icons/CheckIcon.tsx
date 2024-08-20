import React from 'react';

interface CheckIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const CheckIcon: React.FC<CheckIconProps> = ({
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
    <path d="M21.7959 7.54594L9.7959 19.5459C9.69138 19.6508 9.56719 19.734 9.43044 19.7908C9.2937 19.8476 9.14709 19.8768 8.99902 19.8768C8.85096 19.8768 8.70435 19.8476 8.5676 19.7908C8.43086 19.734 8.30666 19.6508 8.20215 19.5459L2.95215 14.2959C2.8475 14.1913 2.76449 14.0671 2.70785 13.9303C2.65122 13.7936 2.62207 13.6471 2.62207 13.4991C2.62207 13.3511 2.65122 13.2045 2.70785 13.0678C2.76449 12.9311 2.8475 12.8068 2.95215 12.7022C3.05679 12.5975 3.18103 12.5145 3.31776 12.4579C3.45448 12.4013 3.60103 12.3721 3.74902 12.3721C3.89702 12.3721 4.04356 12.4013 4.18029 12.4579C4.31702 12.5145 4.44125 12.5975 4.5459 12.7022L8.99996 17.1563L20.204 5.95407C20.4154 5.74272 20.702 5.62399 21.0009 5.62399C21.2998 5.62399 21.5864 5.74272 21.7978 5.95407C22.0091 6.16541 22.1278 6.45206 22.1278 6.75094C22.1278 7.04983 22.0091 7.33648 21.7978 7.54782L21.7959 7.54594Z" />

  </svg>
);

export default CheckIcon;
