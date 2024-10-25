'use strict';

const express = require('express');
const config = require('./config.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Import routes with different variable names
const { routes: vehicleRoutes } = require('./src/routes/vehicleRoutes.js');
const { routes: licenseRoutes } = require('./src/routes/licenseRoutes.js');
const { routes: userRoutes } = require('./src/routes/userRoutes.js');
const { routes: loginRoutes } = require('./src/routes/loginRoutes.js');

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://172.16.30.105:3000',
  credentials: true,
}));

app.use(bodyParser.json());
app.use(cookieParser());

// Serve static files
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/user', userRoutes);
app.use('/api/login', loginRoutes);

// Start the server
app.listen(config.port, () => {
  console.log(`App listening on url http://172.16.30.105:${config.port}`);
});
