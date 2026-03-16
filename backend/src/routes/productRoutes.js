const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorizeRoles('admin', 'superadmin'), createProduct);
router.put('/:id', protect, authorizeRoles('admin', 'superadmin'), updateProduct);
router.delete('/:id', protect, authorizeRoles('admin', 'superadmin'), deleteProduct);

module.exports = router;