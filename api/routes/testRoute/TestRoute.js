const express = require("express");
const router = express.Router();
const { createKanbanRequirement, createScrumRequirement, getTestCases, deleteTestCases, updateTestCases, changeStatus, getTestCaseskanban, deleteTestCaseskanban, updateTestCaseskanban, changeStatuskanban,
  deleteAllTestInCardByCreator, replaceAllTestInCardByCreator, deleteAllTestInCardByCreatorScrum, replaceAllTestInCardByCreatorScrum
} = require('./testController/TestController');
router.route("/scrum/:id").get(getTestCases).delete(deleteTestCases).put(updateTestCases);
router.route("/kanban/:id").get(getTestCaseskanban).delete(deleteTestCaseskanban).put(updateTestCaseskanban);
router.route("/scrum/:id/status").put(changeStatus);
router.route("/kanban/:id/status").put(changeStatuskanban);
router.route("/kanban/:id/manytest/:boardId/:cardId").delete(deleteAllTestInCardByCreator).put(replaceAllTestInCardByCreator);
router.route("/scrum/:id/manytest/:boardId/:cardId").delete(deleteAllTestInCardByCreatorScrum).put(replaceAllTestInCardByCreatorScrum);
router.post("/scrum", async (req, res) => {
  try {
    const { test_cases, task_id, task_Name } = req.body;
    const savedRequirement = await createScrumRequirement(test_cases, task_id, task_Name);

    res.status(200).json(savedRequirement); // Respond with the created requirement
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
});

// Route to create a new Kanban requirement
router.post("/kanban", async (req, res) => {
  try {
    const { test_cases, task_id, task_Name } = req.body;
    const savedRequirement = await createKanbanRequirement(test_cases, task_id, task_Name);

    res.status(200).json(savedRequirement); // Respond with the created requirement
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
});

module.exports = router;