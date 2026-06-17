const taskTagService = require("../services/taskTagService");

const addTagToTask = async (req, res) => {
  const { taskId, tagId } = req.params;

  const result = await taskTagService.addTagToTask(
    Number(taskId),
    Number(tagId)
  );

  res.status(201).json({
    success: true,
    data: result,
  });
};

const removeTagFromTask = async (req, res) => {
  const { taskId, tagId } = req.params;

  await taskTagService.removeTagFromTask(
    Number(taskId),
    Number(tagId)
  );

  res.json({
    success: true,
    message: "Tag removed from task",
  });
};

module.exports = {
  addTagToTask,
  removeTagFromTask,
};