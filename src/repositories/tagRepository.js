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

const findTagByName = async (name) => {
  return prisma.tag.findUnique({
    where: { name },
  });
};

const findOrCreateByName = async (name, color = "#6B7280") => {
  const existing = await findTagByName(name);
  if (existing) return existing;
  return createTag({ name, color });
};

module.exports = {
  createTag,
  getAllTags,
  findTagById,
  findTagByName,
  findOrCreateByName,
};