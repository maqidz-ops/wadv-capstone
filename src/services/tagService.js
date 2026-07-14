const tagRepository = require("../repositories/tagRepository");

const createTag = async (data) => {
  return tagRepository.createTag(data);
};

const getAllTags = async () => {
  return tagRepository.getAllTags();
};

const findOrCreateByName = async (name, color) => {
  return tagRepository.findOrCreateByName(name, color);
};

module.exports = {
  createTag,
  getAllTags,
  findOrCreateByName,
};