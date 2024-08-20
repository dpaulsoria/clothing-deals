// app/(api)/docs/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GPG API',
      version: '0.1.0',
    },
  },
  apis: ['./app/api/**/*.{ts,js}'],
};

export const swaggerSpec = swaggerJSDoc(options);
