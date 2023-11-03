const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcrypt');
const router = express.Router();


const findUser = (username) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results[0]);
    });
  });
}

router.post('/login', async (req, res) => {
  // Verificar las credenciales del usuario en la base de datos

  const user = await findUser(  req.body.username  );

  if (!user || !await bcrypt.compare( req.body.password,user.password)) {
    return res.sendStatus(401); 
  }

  // Si son correctas, generar un JWT
  const token = jwt.sign({ id: user.id }, 'zkEuC0T9x5zwJED', { expiresIn: '1h' });

  // Almacenar el JWT en las cookies
  res.cookie('token', token, { httpOnly: true , sameSite: 'none'});
  res.sendStatus(200);
  console.log("logged")
});

router.get('/protected', (req, res) => {
  // Verificar el JWT en las cookies
  try {

    const token = req.cookies.token;
    jwt.verify(token, 'zkEuC0T9x5zwJED');

    // Si el JWT es válido, permitir el acceso a la ruta
    res.json({ message: 'You are authorized' });
    res.sendStatus(200);
    
  } catch (e) {
    // Si el JWT no es válido, denegar el acceso
    res.json({ message: 'You are not authorized' });
    res.sendStatus(401);
  }
});

const createUser = (username, password, email) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.query(query, [username, password, email], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
}

router.post('/register', async (req, res) => {
  // Extract the username, password, and email from the request body

  const { usernameR:username, passwordR:password, email } = req.body;

  // Check if the username or email already exists in the database
  const existingUser = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  const existingEmail = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  

  if (existingUser.length > 0 || existingEmail.length > 0) {
    return res.status(400).json({ message: 'Username or email already exists' });
  }

   // Hash the password
   const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  const insert = await createUser(username, hashedPassword, email);

  const token = jwt.sign({ id: insert.insertId }, 'zkEuC0T9x5zwJED', { expiresIn: '1h' });
  // Store the JWT in the cookies
  res.cookie('token', token, { httpOnly: true, sameSite: 'none'});
  res.status(200).json({ message: 'User registered successfully' });
});


router.post('/logout', (req, res) => {
  // Eliminar la cookie con el JWT
  res.clearCookie('token', { httpOnly: true, path: '/' });
  res.sendStatus(200);
});

const getResponseAsJson = (url) => {
  return fetch(url)
      .then(response => response.json())
      .then(json => json)
      .catch(error => console.log(error));
}

router.get('/getCharacter', async (req, res) => {
  try {

    const token = req.cookies.token;
    jwt.verify(token, 'zkEuC0T9x5zwJED');

    const random = Math.floor(Math.random() * 671) + 1;
    const url = `https://rickandmortyapi.com/api/character/${random}`;
    const response = await getResponseAsJson(url);
    res.status(200).json(response);
  } catch (e) {
    // Si el JWT no es válido, denegar el acceso
    res.sendStatus(401);
  }
});

module.exports = router;