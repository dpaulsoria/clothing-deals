// app/(api)/docs/page.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import './swagger-custom.css';
import { swaggerSpec } from '@api/docs/swagger';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

const ApiDocs = () => {
  return <SwaggerUI spec={swaggerSpec} />;
};

export default ApiDocs;
