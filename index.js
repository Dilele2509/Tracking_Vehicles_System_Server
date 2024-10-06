'use strict';

const express = require('express');
const config = require('./config.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Import routes
const { routes } = require('./src/routes/vehicleRoutes.js');

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(bodyParser.json());
app.use(cookieParser());

// Serve static files
app.use('/api/', routes);

// Start the server
app.listen(config.port, () => {
  console.log(`App listening on url http://localhost:${config.port}`);
});
