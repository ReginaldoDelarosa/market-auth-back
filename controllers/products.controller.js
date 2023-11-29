const database = require('../dbfile.js');


exports.getProducts = async (req, res) => {
  let conn = null

  try {
    conn = await database.getConnection();
    const [rows] = await conn.query("SELECT * FROM productos");
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    if (conn){
      conn.release();
    }
    res.status(500).send("Error al consultar los productos");
  }
};

exports.getProductByCode = async (req, res) => {
  try {
    const conn = await database.getConnection();
    const [rows] = await conn.query(
      "SELECT * FROM productos WHERE codigo = ?",
      [req.params.codigo]
    );
    conn.release();
    if (rows.length === 0) {
      res.status(404).send("producto no encontrado");
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    console.error(err);
    conn.release();
    res.status(500).send("Error al consultar el producto");
  }
};

exports.createProduct = async (req, res) => {
  try {
    const conn = await database.getConnection();
    const { nombre, descripcion, precio, cantidad } = req.body;
    const [result] = await conn.execute(
      "INSERT INTO productos(nombre, descripcion, precio, cantidad) VALUES (?, ?, ?, ?)",
      [nombre, descripcion, precio, cantidad]
    );
    conn.release();
    res.json({ ...req.body, codigo: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear el producto");
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const conn = await database.getConnection();
    const { nombre, descripcion, precio, cantidad } = req.body;
    const fieldsToUpdate = {};
    if (nombre) fieldsToUpdate.nombre = nombre;
    if (descripcion) fieldsToUpdate.descripcion = descripcion;
    if (precio) fieldsToUpdate.precio = precio;
    if (cantidad) fieldsToUpdate.cantidad = cantidad;
    const [result] = await conn.query(
      "UPDATE productos SET ? WHERE codigo = ?",
      [fieldsToUpdate, req.params.codigo]
    );
    conn.release();
    if (result.affectedRows === 0) {
      res.status(404).send("producto no encontrado");
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al actualizar el producto");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const conn = await database.getConnection();
    const [result] = await conn.query(
      "DELETE FROM productos WHERE codigo = ?",
      [req.params.codigo]
    );
    conn.release();
    if (result.affectedRows === 0) {
      res.status(404).send("producto no encontrado");
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar el producto");
  }
};
