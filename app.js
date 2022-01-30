const config = require('./utils/config');
const express = require('express');
const mongoose = require('mongoose');
require('express-async-errors');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');

const farmsRouter = require('./controllers/farms');
const recordsRouter = require('./controllers/records');
const usersRouter = require('./controllers/users');

const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

const app = express();
app.use('/farmsAPI', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

logger.info('connecting to MongoDB');

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/v1/records', recordsRouter);
app.use('/api/v1/farms', farmsRouter);
app.use('/api/v1/users', usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;