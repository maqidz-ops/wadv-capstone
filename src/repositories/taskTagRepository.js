const prisma = require("../config/prisma");

const addTagToTask = async (taskId, tagId) => {
  return prisma.taskTag.create({
    data: {
      taskId,
      tagId,
    },
  });
};

const removeTagFromTask = async (taskId, tagId) => {
  return prisma.taskTag.delete({
    where: {
      taskId_tagId: {
        taskId,
        tagId,
      },
    },
  });
};

const findTagByTaskIdAndName = async (taskId, tagName) => {
  const tag = await prisma.tag.findUnique({ where: { name: tagName } });
  if (!tag) return null;
  return prisma.taskTag.findUnique({
    where: {
      taskId_tagId: { taskId, tagId: tag.id },
    },
  });
};

const syncTags = async (taskId, tagNames) => {
  const tagIds = await Promise.all(
    tagNames.map(async (name) => {
      const tag = await prisma.tag.upsert({
        where: { name },
        create: { name },
        update: {},
      });
      return tag.id;
    })
  );

  await prisma.taskTag.deleteMany({ where: { taskId } });

  if (tagIds.length > 0) {
    await prisma.taskTag.createMany({
      data: tagIds.map((tagId) => ({ taskId, tagId })),
    });
  }
};

module.exports = {
  addTagToTask,
  removeTagFromTask,
  findTagByTaskIdAndName,
  syncTags,
};