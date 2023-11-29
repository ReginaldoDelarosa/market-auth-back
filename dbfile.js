const mysql = require('mysql');
const express = require('express');
const mysql2 = require('mysql2/promise');

/*const db = mysql2.createPool({
  host: 'remotemysql.com',
  user: 'vhmxn2i2eg55g9to',
  password:'p1foysvchnpfy14w',
  database: 'zsfb0y55rokea1so',
  port: 3306,
  multipleStatements: true,
});*/
const db = mysql2.createPool({
  host: 'qz8si2yulh3i7gl3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'vhmxn2i2eg55g9to',
  password:'p1foysvchnpfy14w',
  database: 'zsfb0y55rokea1so',
  port: 3306,
  multipleStatements: true,
});
/*const pool = mysql2.createPool({
  host: "lfmerukkeiac5y5w.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "zl7hscl57lqj6v8t",
  password: "q34349j21foz3kaj",
  database: "sw0dlc2au9k1ddsd",
  port: 3306, 
  multipleStatements: true,
});


db.connect(error => {
  if (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
});*/

// Define the SQL query to create the users table if it doesn't exist
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY,username VARCHAR(255) NOT NULL,password VARCHAR(255) NOT NULL,email VARCHAR(255) NOT NULL,telefono INT NOT NULL,status INT NOT NULL);
  CREATE TABLE IF NOT EXISTS productos (codigo INT PRIMARY KEY AUTO_INCREMENT,nombre VARCHAR(255),descripcion TEXT,precio DECIMAL(10, 2),cantidad INT);
  CREATE TABLE IF NOT EXISTS ventas (codigo INT PRIMARY KEY AUTO_INCREMENT,codigo_producto INT, id_usuarios INT, fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,cantidad_vendida INT,total_venta DECIMAL(10, 2),FOREIGN KEY (codigo_producto) REFERENCES productos(codigo), FOREIGN KEY (id_usuarios) REFERENCES users(id));
`;
(async () => {
  const conn = await db.getConnection();
  try {
    let result = await db.query(createUsersTable);

  } catch (e) {
    console.error(e)
    process.exit(1)
  }
  conn.release();
})();

// Execute the query



module.exports = db;
