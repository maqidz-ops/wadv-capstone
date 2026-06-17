const tagService = require("../services/tagService");

const createTag = async (req, res) => {
  const tag = await tagService.createTag(req.body);

  res.status(201).json({
    success: true,
    data: tag,
  });
};

const getAllTags = async (req, res) => {
  const tags = await tagService.getAllTags();

  res.json({
    success: true,
    data: tags,
  });
};

module.exports = {
  createTag,
  getAllTags,
};