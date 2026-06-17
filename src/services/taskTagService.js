const taskTagRepository = require("../repositories/taskTagRepository");

const addTagToTask = async (taskId, tagId) => {
  return taskTagRepository.addTagToTask(taskId, tagId);
};

const removeTagFromTask = async (taskId, tagId) => {
  return taskTagRepository.removeTagFromTask(taskId, tagId);
};

module.exports = {
  addTagToTask,
  removeTagFromTask,
};