const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser');
const connectToDB = require('./config/db');
const AppError = require('./error/AppError');
const userRouter = require('./routes/user.routes');
const noteRouter = require('./routes/note.routes');
const labelRouter = require('./routes/label.routes');
const viewsRouter = require('./routes/views.routes');

const errorHandler = require('./error/errorHandler');

dotenv.config({
  path: `${__dirname}/config/config.env`,
});

// swagger API Documentation
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FastMemo - A simple Note taking REST API',
      version: '1.0.0',
      description:
        'A simple Note taking REST API made with Nodejs, Express, MongoDB',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Ahmed Samir',
        email: 'ahmedsamirwarda22@gmail.com',
      },
    },
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
    servers: [
      {
        url: 'https://fastmemo.herokuapp.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'],
  swagger: '2.0',
};

const app = express();
connectToDB();

//Global Middelwares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));

//Defining Static Files
app.use(express.static(`${__dirname}/images`));

//Mounting Routes
app.use('/', viewsRouter);
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/notes/', noteRouter);
app.use('/api/v1/labels/', labelRouter);

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//Global Error Handler
app.use(errorHandler);

const server = app.listen(process.env.PORT || 3000, '0.0.0.0');

process.on('unhandledRejection', (err) => {
  console.log(err.name, err);

  console.log('Unhandled Rejection, Shutting down');
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (bug) => {
  console.log('Uncaught Exception, Shutting down');
  console.log(bug.name, bug.message);

  server.close(() => process.exit(1));
});
