'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');

const pool = mysql.createPool(config.sql);

// const checkLogin = async (data) => {
//     try {
//         const sqlQueries = await loadSqlQueries('login/sql');
//         //console.log(sqlQueries);
//         const check = await pool.request()
//             .input('email', sql.VarChar, data.email)
//             .input('password', sql.NVarChar(10), data.password) 
//             .query(sqlQueries.checkLogin);

//         return check.recordset[0].Result;
//     } catch (error) {
//         return error.message;
//     }
// }

// const checkPassword = async (password) => {
//     try {
//         const sqlQueries = await loadSqlQueries('login/sql');
//         const check = await pool.request()
//                         .input('password', sql.VarChar, password)
//                         .query(sqlQueries.checkPassword);
//         return check.recordset[0].Result;
//     } catch (error) {
//         return error.message;
//     }
// }

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
    // checkLogin,
    // checkPassword,
    // confirmCode,
    // checkConfirmCode
}