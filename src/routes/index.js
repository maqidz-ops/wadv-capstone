const express = require('express');
const router = express.Router();

const {
  getHealth,
  getInfo,
  echo,
} = require('../controllers/healthController');

router.get('/health', getHealth);

router.get('/info', getInfo);

router.get('/echo/:msg', echo);

module.exports = router;