const mysql = require('mysql');


const db = mysql.createConnection({
  host: 'qz8si2yulh3i7gl3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'vhmxn2i2eg55g9to',
  password:'p1foysvchnpfy14w',
  database: 'zsfb0y55rokea1so'
});



db.connect(error => {
  if (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
});

// Define the SQL query to create the users table if it doesn't exist
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
  )
`;

// Execute the query
db.query(createUsersTable, error => {
  if (error) {
    console.error('Error creating users table:', error);
    process.exit(1);
  }
});


module.exports = db;