const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Trường Mầm Non',
      version: '1.0.0',
      description: 'Tài liệu mô tả các API cho Backend trường Mầm Non.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Nơi chứa các api annotations
  apis: ['./src/routes/*.js', './src/models/*.js'], // Quét tất cả routes và models
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
