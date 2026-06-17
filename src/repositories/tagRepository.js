const prisma = require("../config/prisma");

const createTag = async (data) => {
  return prisma.tag.create({
    data,
  });
};

const getAllTags = async () => {
  return prisma.tag.findMany();
};

const findTagById = async (id) => {
  return prisma.tag.findUnique({
    where: { id },
  });
};

module.exports = {
  createTag,
  getAllTags,
  findTagById,
};