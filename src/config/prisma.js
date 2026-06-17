const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

// Membuat instance PrismaClient tunggal (Singleton) tanpa driver adapter khusus
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['warn', 'error'],
});

// Putuskan koneksi dengan aman saat aplikasi dimatikan
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;