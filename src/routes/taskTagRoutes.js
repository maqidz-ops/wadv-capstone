const express = require("express");
const router = express.Router();

const taskTagController = require("../controllers/taskTagController");

router.post(
  "/:taskId/tags/:tagId",
  taskTagController.addTagToTask
);

router.delete(
  "/:taskId/tags/:tagId",
  taskTagController.removeTagFromTask
);

module.exports = router;