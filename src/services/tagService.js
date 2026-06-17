const tagRepository = require("../repositories/tagRepository");

const createTag = async (data) => {
  return tagRepository.createTag(data);
};

const getAllTags = async () => {
  return tagRepository.getAllTags();
};

module.exports = {
  createTag,
  getAllTags,
};