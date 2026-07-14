const taskTagRepository = require("../repositories/taskTagRepository");
const tagRepository = require("../repositories/tagRepository");

const addTagToTask = async (taskId, tagId) => {
  return taskTagRepository.addTagToTask(taskId, tagId);
};

const removeTagFromTask = async (taskId, tagId) => {
  return taskTagRepository.removeTagFromTask(taskId, tagId);
};

const addTagByName = async (taskId, tagName) => {
  const tag = await tagRepository.findOrCreateByName(tagName);
  await taskTagRepository.addTagToTask(taskId, tag.id);
};

const removeTagByName = async (taskId, tagName) => {
  const tag = await tagRepository.findTagByName(tagName);
  if (!tag) return null;
  return taskTagRepository.removeTagFromTask(taskId, tag.id);
};

const syncTagsByName = async (taskId, tagNames) => {
  await taskTagRepository.syncTags(taskId, tagNames);
};

module.exports = {
  addTagToTask,
  removeTagFromTask,
  addTagByName,
  removeTagByName,
  syncTagsByName,
};