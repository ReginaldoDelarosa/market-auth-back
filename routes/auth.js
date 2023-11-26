const express = require("express");
const jwt = require("jsonwebtoken");
const database = require("../dbfile.js");
const bcrypt = require("bcrypt");
const router = express.Router();
const salesController = require("../controllers/sales.controller.js");
const db = require("../dbfile.js");

const findUser = (username) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await database.getConnection();
      const [results] = await db.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      
      db.release();
      resolve(results[0]);
    } catch (error) {
      reject(error);
    }
  });
};

const findUserById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await database.getConnection();
      const [results] = await db.query("SELECT * FROM users WHERE id = ?", [
        id,
      ]);
      
      db.release();
      resolve(results[0]);
    } catch (error) {
      reject(error);
    }
  });
};

const findUser2 = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await database.getConnection();
      const [results] = await db.query(
        "SELECT * FROM users"
      );
      
      db.release();
      resolve(results);
    } catch (error) {
      reject(error);
    }
  });
};

router.post("/login", async (req, res) => {
  // Verificar las credenciales del usuario en la base de datos
 
  const user = await findUser(req.body.username);

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ message: "You are not authorized" });
  }

  // Si son correctas, generar un JWT
  const token = jwt.sign({ id: user.id }, "zkEuC0T9x5zwJED", {
    expiresIn: "1999999h",
  });

  // Almacenar el JWT en las cookies
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.sendStatus(200);
  console.log("logged");
});

router.get("/protected", (req, res) => {
  // Verificar el JWT en las cookies
  try {
    const token = req.cookies.token;
    jwt.verify(token, "zkEuC0T9x5zwJED");

    // Si el JWT es válido, permitir el acceso a la ruta
    res.status(200).json({ message: "You are authorized" });
  } catch (e) {
    // Si el JWT no es válido, denegar el acceso
    res.status(401).json({ message: "You are not authorized" });
  }
});

const createUser = async (username, password, email) => {
  try {
    const db = await database.getConnection();
    const query =
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
    const [results] = await db.query(query, [username, password, email]);
    
    db.release();
    return results;
  } catch (error) {
    throw error;
  }
};

router.post("/register", async (req, res) => {
  // Extraer el nombre de usuario, contraseña y correo electrónico del cuerpo de la solicitud

  const db = await database.getConnection();

  const {
    usernameR: username,
    passwordR: password,
    email,
    telefono,
  } = req.body;

  // Comprobar si el nombre de usuario o el correo electrónico ya existen en la base de datos
  const [existingUser] = await db.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );
  const [existingEmail] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (existingUser.length > 0 || existingEmail.length > 0) {
    return res
      .status(400)
      .json({ message: "Username or email already exists" });
  }

  // Hash la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  const query =
    "INSERT INTO users (username, password, email, telefono) VALUES (?, ?, ?, ?)";
  const [insert] = await db.query(query, [
    username,
    hashedPassword,
    email,
    telefono,
  ]);

  const token = jwt.sign({ id: insert.insertId }, "zkEuC0T9x5zwJED", {
    expiresIn: "1h",
  });
  db.release();
  // Almacenar el JWT en las cookies
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ message: "User registered successfully" });
});

router.post("/logout", (req, res) => {
  // Eliminar la cookie con el JWT
  res.clearCookie("token", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
  });
  res.sendStatus(200);
});

router.post("/getUser", async (req, res) => {
  // Verificar el JWT en las cookies
  if (req.cookies["token"]) {
    const token = req.cookies.token;
    jwt.verify(token, "zkEuC0T9x5zwJED");
    let user = jwt.decode(token);
    let _user = await findUserById(user.id);
    res.status(200).json({ user: _user });
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
});
router.get("/getUsers", async (req, res) => {
  // Verificar el JWT en las cookies
  const users = await findUser2();
  if (req.cookies["token"]) {
    const token = req.cookies.token;
    jwt.verify(token, "zkEuC0T9x5zwJED");
    const _user = users; // Guardar todos los usuarios encontrados en _user
    res.status(200).json({ _user });
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
});

const getResponseAsJson = (url) => {
  return fetch(url)
    .then((response) => response.json())
    .then((json) => json)
    .catch((error) => console.log(error));
};

router.get("/getCharacter", async (req, res) => {
  try {
    const token = req.cookies.token;
    jwt.verify(token, "zkEuC0T9x5zwJED");

    const random = Math.floor(Math.random() * 671) + 1;
    const url = `https://rickandmortyapi.com/api/character/${random}`;
    const response = await getResponseAsJson(url);
    res.status(200).json(response);
  } catch (e) {
    // Si el JWT no es válido, denegar el acceso
    res.status(401).json({ message: "You are not authorized" });
  }
});

router.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = router;
