const express = require('express');
const router = express.Router();
const salesController = require('../controllers/sales.controller.js');
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

router.get('/sales',verifyToken, salesController.getSales);
router.get('/sales/:codigo',verifyToken, salesController.getSaleByCode);
router.post('/sales',verifyToken, salesController.createSale);
router.patch('/sales/:codigo',verifyToken, salesController.updateSale);
router.delete('/sales/:codigo',verifyToken, salesController.deleteSale);

module.exports = router;