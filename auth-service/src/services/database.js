// services/database.js
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error('❌ Error de conexión:', err.stack);
  } else {
    console.log('✅ Conectado a MySQL como ID:', connection.threadId);
  }
});

const query = (sql, params) =>
  new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) =>
      err ? reject(err) : resolve(results)
    );
  });

module.exports = { query, connection };   
