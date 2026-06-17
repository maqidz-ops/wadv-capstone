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

module.exports = {
  addTagToTask,
  removeTagFromTask,
};