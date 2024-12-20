'use strict';

const express = require('express');
const { getDriverCompleted, getDriverCancelled, getDriverRated, getCompletedTrip, getCompletedTripList, getOngoingTripList, setCompleteTrip, getAllTrips } = require('../controllers/tripController');

const router = express.Router();

router.post('/driver-completed', getDriverCompleted);
router.post('/driver-cancelled', getDriverCancelled);
router.post('/driver-rated', getDriverRated);
router.post('/trip-completed', getCompletedTrip);
router.get('/trip-complete-list', getCompletedTripList);
router.get('/trip-ongoing-list', getOngoingTripList);
router.put('/set-complete-trip', setCompleteTrip);
router.get('/get-all', getAllTrips);

module.exports = { routes: router };