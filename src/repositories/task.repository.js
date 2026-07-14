const prisma = require('../config/prisma');

const tagInclude = {
  include: {
    tag: { select: { name: true } },
  },
};

const defaultInclude = {
  user: { select: { id: true, name: true, email: true } },
  category: { select: { id: true, name: true, color: true } },
  tags: tagInclude,
};

const taskRepository = {
  // ─── List tasks dengan filter, sort, pagination ────────
  async findMany({
    userId,
    status,
    priority,
    sort = 'createdAt',
    order = 'desc',
    limit = 10,
    offset = 0,
  } = {}) {
    const where = {};
    if (userId) where.userId = Number(userId);
    if (status) where.status = status.toUpperCase().replace('-', '_');
    if (priority) where.priority = priority.toUpperCase();

    const [data, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { [sort]: order },
        take: Number(limit),
        skip: Number(offset),
        include: defaultInclude,
      }),
      prisma.task.count({ where }),
    ]);

    return { data, total };
  },

  // ─── Cari satu task by ID ───────────────────────────────
  async findById(id) {
    return prisma.task.findUnique({
      where: { id: Number(id) },
      include: defaultInclude,
    });
  },

  // ─── Buat task baru ─────────────────────────────────────
  async create(data) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        status: data.status ? data.status.toUpperCase().replace('-', '_') : 'TODO',
        priority: data.priority ? data.priority.toUpperCase() : 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        userId: Number(data.userId),
        categoryId: data.categoryId ? Number(data.categoryId) : null,
      },
      include: defaultInclude,
    });
  },

  // ─── Update sebagian field (PATCH) ──────────────────────
  async update(id, data) {
    try {
      return await prisma.task.update({
        where: { id: Number(id) },
        data: {
          ...data,
          status: data.status ? data.status.toUpperCase().replace('-', '_') : undefined,
          priority: data.priority ? data.priority.toUpperCase() : undefined,
          dueDate: data.dueDate === null ? null : data.dueDate ? new Date(data.dueDate) : undefined,
        },
        include: defaultInclude,
      });
    } catch (e) {
      if (e.code === 'P2025') return null;
      throw e;
    }
  },

  // ─── Ganti seluruh task (PUT) ───────────────────────────
  async replace(id, data) {
    try {
      return await prisma.task.update({
        where: { id: Number(id) },
        data: {
          title: data.title,
          description: data.description !== undefined ? data.description : null,
          status: data.status ? data.status.toUpperCase().replace('-', '_') : undefined,
          priority: data.priority ? data.priority.toUpperCase() : undefined,
          dueDate:
            data.dueDate === undefined
              ? null
              : data.dueDate === null
              ? null
              : new Date(data.dueDate),
        },
        include: defaultInclude,
      });
    } catch (e) {
      if (e.code === 'P2025') return null;
      throw e;
    }
  },

  // ─── Hapus task ──────────────────────────────────────────
  async remove(id) {
    try {
      await prisma.task.delete({ where: { id: Number(id) } });
      return true;
    } catch (e) {
      if (e.code === 'P2025') return false;
      throw e;
    }
  },

  // ─── JOIN: semua task milik user tertentu ────────────────
  async findByUser(userId) {
    return prisma.user.findUnique({
      where: { id: Number(userId) },
      include: {
        tasks: {
          include: {
            category: { select: { id: true, name: true, color: true } },
            tags: tagInclude,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  },
};


module.exports = taskRepository;