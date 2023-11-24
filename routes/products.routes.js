const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller.js');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get the token from the request headers
  const token = req.cookies.token;

  // Verify the token
  jwt.verify(token, 'zkEuC0T9x5zwJED', (err, decoded) => {
    if (err) {
      // Token verification failed
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      // Token verification successful
      // You can access the decoded data through the `decoded` object
      // For example, if the token contains the user ID, you can access it like `decoded.userId`
      req.userId = decoded.userId;
      next();
    }
  });
};

// Apply the middleware to the route
router.get('/products', verifyToken, productsController.getProducts);
router.get('/products/:codigo',verifyToken, productsController.getProductByCode);
router.post('/products',verifyToken, productsController.createProduct);
router.patch('/products/:codigo',verifyToken, productsController.updateProduct);
router.delete('/products/:codigo',verifyToken, productsController.deleteProduct);

module.exports = router;