const taskRepo = require('../repositories/task.repository');

// ─── GET /api/v1/tasks ──────────────────────────────────
const listTasks = async (req, res, next) => {
  try {
    const { status, priority, sort, order, limit, offset } = req.query;
    const { data, total } = await taskRepo.findMany({
      status,
      priority,
      sort,
      order,
      limit,
      offset,
    });

    const numLimit = Number(limit) || 10;
    const numOffset = Number(offset) || 0;

    res.status(200).json({
      data,
      pagination: {
        total,
        limit: numLimit,
        offset: numOffset,
        hasNext: numOffset + numLimit < total,
        hasPrev: numOffset > 0,
        nextOffset: numOffset + numLimit < total ? numOffset + numLimit : null,
        prevOffset: numOffset > 0 ? Math.max(0, numOffset - numLimit) : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/v1/tasks ─────────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const task = await taskRepo.create({
      ...req.body,
      userId: req.body.userId || 1,
    });
    res.status(201).set('Location', `/api/v1/tasks/${task.id}`).json({
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/v1/tasks/:id ──────────────────────────────
const getTask = async (req, res, next) => {
  try {
    const task = await taskRepo.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `Task ID ${req.params.id} tidak ditemukan.`,
        },
      });
    }
    res.status(200).json({ data: task });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/v1/tasks/:id (Partial Update) ──────────
const updateTask = async (req, res, next) => {
  try {
    const task = await taskRepo.update(req.params.id, req.body);
    if (!task) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `Task ID ${req.params.id} tidak ditemukan.`,
        },
      });
    }
    res.status(200).json({ data: task });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/v1/tasks/:id (Full Replace) ──────────────
const replaceTask = async (req, res, next) => {
  try {
    const task = await taskRepo.replace(req.params.id, req.body);
    if (!task) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `Task ID ${req.params.id} tidak ditemukan.`,
        },
      });
    }
    res.status(200).json({ data: task });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/v1/tasks/:id ───────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const ok = await taskRepo.remove(req.params.id);
    if (!ok) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `Task ID ${req.params.id} tidak ditemukan.`,
        },
      });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/v1/users/:userId/tasks ────────────────────
const getTasksByUser = async (req, res, next) => {
  try {
    const result = await taskRepo.findByUser(req.params.userId);
    if (!result) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `User ID ${req.params.userId} tidak ditemukan.`,
        },
      });
    }
    res.status(200).json({
      data: {
        user: {
          id: result.id,
          name: result.name,
          email: result.email,
        },
        tasks: result.tasks,
        total: result.tasks.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

const addTagToTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { tagId } = req.body; // tagId dikirim melalui JSON body

    if (!tagId) {
      return res.status(400).json({ status: 'fail', message: 'tagId harus disertakan di body' });
    }

    const taskTag = await taskRepository.addTag(taskId, tagId);
    res.status(201).json({ status: 'success', data: taskTag });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ status: 'fail', message: 'Tag ini sudah terpasang pada task tersebut' });
    }
    next(error);
  }
};

const removeTagFromTask = async (req, res, next) => {
  try {
    const { taskId, tagId } = req.params; // Diambil langsung dari URL parameter

    await taskRepository.removeTag(taskId, tagId);
    res.status(200).json({ status: 'success', message: 'Tag berhasil dihapus dari task' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ status: 'fail', message: 'Hubungan task dan tag tidak ditemukan' });
    }
    next(error);
  }
};

module.exports = {
  listTasks,
  createTask,
  getTask,
  replaceTask,
  updateTask,
  deleteTask,
  getTasksByUser,
  addTagToTask,
  removeTagFromTask,
};