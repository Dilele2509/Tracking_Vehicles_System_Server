'use strict';

const { getBalance } = require('../data/wallet');

const getBalanceById = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const result = await getBalance(userId);
        res.send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

module.exports = {
    getBalanceById,
};