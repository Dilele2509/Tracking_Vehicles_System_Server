'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');

const pool = mysql.createPool(config.sql);

const checkLogin = async (data) => {
    try {

        const sqlQueries = await loadSqlQueries('login/sql');
        const query = sqlQueries.checkLogin;
        const [result] = await pool.execute(query, [data.email, data.password]);
        return result[0].Result
    } catch (error) {
        return error.message;
    }
}

const checkPassword = async (password) => {
    try {
        const sqlQueries = await loadSqlQueries('login/sql');
        const query = sqlQueries.checkPassword;

        const [result] = await pool.execute(query, [password]);
        return result[0].Result
    } catch (error) {
        return error.message;
    }
}

// const checkConfirmCode = async(inputCode, code) =>{
//     try {
//         if(inputCode === code){
//             return 1;
//         }else{
//             return 0;
//         }
//     } catch (error) {
//         return error.message;
//     }
// }


// const confirmCode = async () => {
//     try {
//         const code = ()=>{
//             let strCode = ""
//             for(let i = 0; i<= 5; i++){
//                 let randomItem = Math.floor(Math.random() * 10).toString();
//                 strCode = strCode + randomItem;
//                 //console.log(strCode);
//             }
//             return strCode
//         }
//         return code();
//     } catch (error) {
//         return error.message;
//     }
// }

module.exports = {
    checkLogin,
    checkPassword,
    // confirmCode,
    // checkConfirmCode
}