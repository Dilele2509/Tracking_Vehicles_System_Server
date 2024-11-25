'use strict';
const dotenv = require('dotenv');
const express = require('express');
const config = require('./config.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');

dotenv.config();

const { HOST } = process.env;

// Import routes with different variable names
const { routes: vehicleRoutes } = require('./src/routes/vehicleRoutes.js');
const { routes: licenseRoutes } = require('./src/routes/licenseRoutes.js');
const { routes: userRoutes } = require('./src/routes/userRoutes.js');
const { routes: loginRoutes } = require('./src/routes/loginRoutes.js');
const { routes: deviceRoutes } = require('./src/routes/deviceRoutes.js');
const { routes: walletRoutes } = require('./src/routes/walletRoutes.js');
const { routes: incomeRoutes } = require('./src/routes/incomeRoutes.js');
const { routes: violateRoutes} = require('./src/routes/violateRoutes.js');
const { routes: tripRoutes } = require('./src/routes/tripRoutes.js');

const app = express();

app.use(express.json());
// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(bodyParser.json());
app.use(cookieParser());

//file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/Images/avatars/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/Images/vehicles/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
})


const photoLicenseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/Images/IDCardPhoto/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
const uploadThumbnail = multer({ storage: thumbnailStorage });
const uploadPhoto = multer({ storage: photoLicenseStorage });

const {uploadAvatar} = require('./src/controllers/userController.js');
const { addVehicle } = require('./src/controllers/vehicleController.js');
const { addLicenseController, updateLicensePhoto } = require('./src/controllers/licenseController.js');
app.post('/api/user/upload-ava/', upload.single("avatar"), uploadAvatar );
app.post('/api/vehicles/add', uploadThumbnail.single("thumbnail"), addVehicle);
app.post('/api/license/add', uploadPhoto.single("id_card_photo"), addLicenseController);
app.post('/api/license/update-photo', uploadPhoto.single("id_card_photo"), updateLicensePhoto);

// Serve static files
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/user', userRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/violate', violateRoutes);
app.use('/api/trip', tripRoutes);

// Start the server
app.listen(config.port, () => {
  console.log(`App listening on url http://${HOST}:${config.port}`);
});
