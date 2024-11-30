'use strict';
const nodemailer = require('nodemailer');
const { findById } = require('../data/user');
const { getViolateID, addViolateInfo, updateViolateImg, allViolates } = require('../data/violate');

const getAllViolates = async (req, res) => {
    try {
        const result = await allViolates();
        res.send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getDriverViolate = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const result = await getViolateID(userId);
        res.send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const sendWarningViolate = async (req, res) => {
    const { to } = req.body;
    const userId = req.cookies.userId;
    const ipAddress = '103.77.209.93'

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
            <img style="max-width: 300px;" src="http://${ipAddress}:3001${result[0].violate_photo}">
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

const addViolate = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Destructure the data from the request body
        const violate_photo = req.file;
        console.log('file: ', req.file);
        console.log('filenames: ', violate_photo.filename);

        // Check if the violate_photo file is uploaded
        if (!violate_photo) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Insert the vehicle data
        const insert = await addViolateInfo(userId);
        console.log(insert);
        if (insert.status === 200) {
            const filePath = '/public/assets/Images/violates/' + violate_photo.filename;
            // console.log('filePath: ' + filePath); 
            const result = await updateViolateImg(insert.data.insertId, filePath); 

            // Send the response
            const combineRes = {
                status: 200,
                message: "Added successfully",
                image: result,
                insert: insert.result // Return the insert result if needed
            };
            return res.send(combineRes);
        } else {
            return res.status(400).send(insert);
        }
    } catch (error) {
        console.error('Error in addViolate:', error.message); // Log the error
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllViolates,
    getDriverViolate,
    sendWarningViolate,
    addViolate
};


// pass: axzaintevseezvcc
// pass: 'ohfctdyjcbkvdqnw'
//pass: 'yilxfskzbkifijpz'
//pass: 'axzaintevseezvcc'
// for react app: yilxfskzbkifijpz
// for postman: axzaintevseezvcc