const mysql = require("mysql2/promise");
const dotenv=require("dotenv");
dotenv.config();
const pool = mysql.createPool({
    host:process.env.DB_HOST, user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    charset:'utf8mb4'

});
async function testConnection() {
    try{
        const [rows] = await pool.query("SELECT* FROM users");
    }catch(err){
        console.error(err);
    }
    
}
testConnection();
module.exports=pool;