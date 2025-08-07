const express = require('express');
const router  = express.Router();

const { verifyToken }      = require('../middlewares/authMiddleware');
const { balanceValidator } = require('../middlewares/validators');
const {
  createMovimiento,
  listMovimientos,
  getMovimiento,
  syncIngresos        
} = require('../controllers/balanceController');

router.post('/balance',     verifyToken, balanceValidator, createMovimiento);
router.get ('/balance',     verifyToken, listMovimientos);
router.get ('/balance/:id', verifyToken, getMovimiento);

router.post('/balance/sync-citas', verifyToken, syncIngresos);

module.exports = router;