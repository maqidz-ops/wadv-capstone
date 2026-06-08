const express = require('express');
const router = express.Router();
// Pastikan fungsi getTasksByUser tertulis di dalam kurung kurawal ini
const { getTasksByUser } = require('../controllers/tasks.controller');

// Endpoint: GET /api/v1/users/:userId/tasks
router.get('/:userId/tasks', getTasksByUser);

module.exports = router;