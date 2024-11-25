'use strict';

const { statisticDate, statisticMonth, statisticYear, getIncomeID } = require('../data/income');

const getStatisticDate = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const date = req.body.date;
        /* console.log('cookie userId: ' + userId); */
        const result = await statisticDate(userId, date);
        res.send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const getStatisticMonth = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const {year, month} = req.body;
        /* console.log('cookie userId: ' + userId); */
        const result = await statisticMonth(userId, parseInt(year), parseInt(month));
        res.send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const getStatisticYear = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const {year} = req.body;
        /* console.log('cookie userId: ' + userId); */
        const result = await statisticYear(userId, parseInt(year));
        res.send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const getIncomeDriver = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const [result] = await getIncomeID(userId);
        res.send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

module.exports = {
    getStatisticDate,
    getStatisticMonth,
    getStatisticYear,
    getIncomeDriver
};