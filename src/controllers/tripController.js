'use strict';

const { driverCompleted, driverCancelled, driverRated, completedTrip, completedTripList, ongoingTripList } = require("../data/trip");

const getDriverCompleted = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const result = await driverCompleted(userId);
        res.send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getDriverCancelled = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const result = await driverCancelled(userId);
        res.send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getDriverRated = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const result = await driverRated(userId);
        res.send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getCompletedTrip = async (req, res) => {
    try {
        const {tripId} = req.body;
        const result = await completedTrip(tripId);
        res.send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getCompletedTripList = async (req, res) => {
    try {
        const result = await completedTripList();
        res.send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getOngoingTripList = async (req, res) => {
    try {
        const result = await ongoingTripList();
        res.send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const calculateTripPrice = (distance) => {
    const baseFare = 29000; // Giá cho 2 km đầu tiên
    const perKmFare = 10000; // Giá mỗi km sau 2 km
    const timeSurcharge = 450; // Phụ phí tính theo thời gian (trung bình mỗi km)

    // Nếu chuyến đi <= 2 km, chỉ tính giá cố định
    if (distance <= 2) {
        return baseFare;
    }

    // Tính giá cho phần vượt quá 2 km
    const extraKm = distance - 2;
    const extraFare = extraKm * (perKmFare + timeSurcharge);

    // Tổng giá cước
    const totalFare = baseFare + extraFare;

    return totalFare;
}

module.exports = {
    getDriverCompleted,
    getDriverCancelled,
    getDriverRated,
    getCompletedTrip,
    getCompletedTripList,
    getOngoingTripList
};