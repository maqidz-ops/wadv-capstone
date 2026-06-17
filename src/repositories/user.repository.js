const prisma = require('../config/prisma');

const userRepository = {
  // ─── Ambil semua user ───────────────────────────────────
  async findAll() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  // ─── Cari user by ID ────────────────────────────────────
  async findById(id) {
    return prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  },

  // ─── Cari user by email ────────────────────────────────
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },

  async create(data) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  },
};

module.exports = userRepository;