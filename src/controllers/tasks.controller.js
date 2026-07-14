const taskRepo = require('../repositories/task.repository');
const taskTagService = require('../services/taskTagService');

function flattenTags(task) {
  if (!task) return task;
  return {
    ...task,
    tags: task.tags ? task.tags.map((t) => t.tag.name) : [],
  };
}

function emitTagUpdated(io, taskId, task) {
  if (!io) return;
  io.to('tasks:global').emit('tag:updated', {
    taskId,
    tags: task.tags ? task.tags.map((t) => t.tag.name) : [],
  });
}

// GET /api/v1/tasks
const listTasks = async (req, res, next) => {
  try {
    const { status, priority, sort, order, limit, offset } = req.query;
    const userId = req.user.role === 'ADMIN' ? undefined : req.user.userId;
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
      data: data.map(flattenTags),
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

// POST /api/v1/tasks
const createTask = async (req, res, next) => {
  try {
    const { tags, ...taskData } = req.body;

    const task = await taskRepo.create({
      ...taskData,
      userId: req.user.userId || 1,
    });

    if (tags && Array.isArray(tags)) {
      await taskTagService.syncTagsByName(Number(task.id), tags);
    }

    const createdWithTags = await taskRepo.findById(task.id);

    const io = req.app.get('io');

    if (io) {
      io.to('tasks:global').emit('task:created', { task: flattenTags(createdWithTags) });

      io.to(`user:${req.user.userId}`).emit('notification', {
        type: 'SUCCESS',
        title: 'Task Berhasil Dibuat',
        message: `Task "${task.title}" telah ditambahkan.`,
      });
    }

    res
      .status(201)
      .set('Location', `/api/v1/tasks/${task.id}`)
      .json({ data: flattenTags(createdWithTags) });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/tasks/:id
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
    res.status(200).json({ data: flattenTags(task) });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/tasks/:id (Partial Update)
const updateTask = async (req, res, next) => {
  try {
    const { tags, ...taskData } = req.body;

    const task = await taskRepo.update(req.params.id, taskData);

    if (!task) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `Task ID ${req.params.id} tidak ditemukan.`,
        },
      });
    }

    if (tags !== undefined) {
      await taskTagService.syncTagsByName(Number(req.params.id), tags);
    }

    const updated = await taskRepo.findById(req.params.id);

    const io = req.app.get('io');

    if (io) {
      io.to('tasks:global').emit('task:updated', { task: flattenTags(updated) });

      if (tags !== undefined) {
        emitTagUpdated(io, req.params.id, updated);
      }
    }

    res.status(200).json({ data: flattenTags(updated) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/tasks/:id (Full Replace)
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
    res.status(200).json({ data: flattenTags(task) });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);

    const ok = await taskRepo.remove(taskId);

    if (!ok) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `Task ID ${req.params.id} tidak ditemukan.`,
        },
      });
    }

    const io = req.app.get('io');

    if (io) {
      io.to('tasks:global').emit('task:deleted', { taskId });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/users/:userId/tasks
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
        tasks: result.tasks.map(flattenTags),
        total: result.tasks.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/tasks/:taskId/tags
const addTagToTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Field "name" (string) wajib disertakan di body.',
      });
    }

    await taskTagService.addTagByName(Number(taskId), name.trim());

    const updated = await taskRepo.findById(Number(taskId));

    const io = req.app.get('io');
    if (io) {
      io.to('tasks:global').emit('task:updated', { task: flattenTags(updated) });
      emitTagUpdated(io, taskId, updated);
    }

    res.status(200).json({ status: 'success', data: flattenTags(updated) });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        status: 'fail',
        message: 'Tag tersebut sudah terpasang pada task ini.',
      });
    }
    next(error);
  }
};

// DELETE /api/v1/tasks/:taskId/tags/:tagName
const removeTagFromTask = async (req, res, next) => {
  try {
    const { taskId, tagName } = req.params;

    const result = await taskTagService.removeTagByName(Number(taskId), tagName);

    if (!result) {
      return res.status(404).json({
        status: 'fail',
        message: `Tag "${tagName}" tidak ditemukan pada task ini.`,
      });
    }

    const updated = await taskRepo.findById(Number(taskId));

    const io = req.app.get('io');
    if (io) {
      io.to('tasks:global').emit('task:updated', { task: flattenTags(updated) });
      emitTagUpdated(io, taskId, updated);
    }

    res.status(200).json({ status: 'success', data: flattenTags(updated) });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'fail',
        message: 'Hubungan task dan tag tidak ditemukan.',
      });
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