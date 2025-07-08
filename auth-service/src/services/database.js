const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

exports.query = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) {
        console.error('Error en la query:', err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

connection.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a MySQL:', err.stack);
  } else {
    console.log('✅ Conectado a MySQL como ID:', connection.threadId);
  }
});