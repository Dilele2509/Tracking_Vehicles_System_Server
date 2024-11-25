'use strict';
const nodemailer = require('nodemailer');
const { findById } = require('../data/user');
const { getViolateID } = require('../data/violate');

const getDriverViolate = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const result = await getViolateID(userId);
        res.send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const sendLetterMail = async (req, res) => {
    const { to } = req.body;
    const userId = req.cookies.userId;

    try {
        const userInfo = await findById(userId);
        const result = await getViolateID(userId);
        console.log(result[0]);

        if (!userInfo || !result) {
            return res.status(404).send('User or violation details not found.');
        }

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'levy3443@gmail.com',
                pass: 'gydaslsdgfrtpbct', // Use environment variable for password
            }
        });

        const subject = 'HALEE Driving: Cảnh báo hành vi vi phạm lái xe';
        const html = `
            <h2>Chào ${userInfo.fullname}!</h2>
            <p>Chúng tôi vừa nhận được thông tin vi phạm của bạn từ hệ thống vào lúc ${result[0].time} ngày ${result[0].date}</p>
            <p>Vui lòng kiểm tra lại thông tin, nếu có phản hồi hãy liên hệ trực tiếp với số điện thoại sau <a href="tel:+84966480829">0966480829</a> hoặc qua facebook: </p>
            <p>https://www.facebook.com/vyle2509</p>
            <br/>
            <h4>Dưới đây là hình ảnh vi phạm của bạn:</h4>
            <img style="max-width: 300px;" src="https://drive.google.com/u/0/drive-viewer/AKGpihYinszBxX250stIjxmDUI-TE9pkmF3m-6REr4OzO1HuNP6jc9gSLsgPxGjy2TFVgFaWvxqwFmQG4v9IlZ5Ukdhc2o9fMmTEtSc=s1600-rw-v1" alt="violate Image">
        `;

        let mailOptions = {
            from: 'levy3443@gmail.com',
            to: to,
            subject: subject,
            html: html
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send({ error: error.message });
            }
            res.status(200).send('Email sent: ' + info.response);
        });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    getDriverViolate,
    sendLetterMail
};


// pass: axzaintevseezvcc
            // pass: 'ohfctdyjcbkvdqnw'
            //pass: 'yilxfskzbkifijpz'
            //pass: 'axzaintevseezvcc'
            // for react app: yilxfskzbkifijpz
            // for postman: axzaintevseezvcc