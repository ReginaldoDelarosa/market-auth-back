const mysql = require('mysql');


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'',
  database: 'ass'
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