const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'farmsAPI',
    version: '1.0.0',
    description: 'An Express API for farms and data of farms',
    contact: {
      name: 'Statistics of Farms by Hang Nguyen',
      url: 'https://mighty-bastion-19386.herokuapp.com/',
    },
  },
  servers:[{
    url: 'https://mighty-bastion-19386.herokuapp.com/',
    description: 'Production server'
  },
  {
    url: 'http://localhost:3001/',
    description: 'Development server'
  }]
};

const options = {
  swaggerDefinition,
  apis: ['./controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;