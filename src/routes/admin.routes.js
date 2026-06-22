const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const userRepo = require('../repositories/user.repository');
const taskRepo = require('../repositories/task.repository');
const prisma = require('../config/prisma');

// Middleware untuk memastikan hanya admin yang bisa mengakses rute ini
router.use(authenticate);
router.use(authorize('ADMIN'));

// Rute untuk mendapatkan semua pengguna
router.get('/users', async (req, res) => {
  try {
        const users = await userRepo.findAll();
        res.json({ data: users , total: users.length });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// Mengubah role pengguna
router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({
        error: { code: 'INVALID_ROLE', message: 'Role harus USER atau ADMIN.' }
      });
    }

    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

// Meilhat semua task (admin bisa lihat semua, user hanya bisa lihat task miliknya)
router.get('/tasks', async (req, res, next) => {
  try {
    const { data, total } = await taskRepo.findMany({});
    res.json({ data, total });
  } catch (err) {
    next(err);
  }
});

module.exports = router;