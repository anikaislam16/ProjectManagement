const { KanbanBoard } = require("../../../modules/BoardModule");
const { ScrumBoard } = require("../../../modules/ScrumBoards")
const TestCase = require('../../../modules/TestCaseModule');
const { Member } = require('../../../modules/MemberModule');

// Function to create a new requirement
async function createScrumRequirement(test_cases, task_id, task_Name) {

  try {
    let testCaseDoc = await TestCase.findOne({ task_id: task_id });

    // If a TestCase document with the given task_id exists
    if (testCaseDoc) {
      // Push the new test case to the test_cases array
      testCaseDoc.test_cases.push(test_cases);
    }
    else {
      // Create a new TestCase document if no document with the given task_id exists
      testCaseDoc = new TestCase({
        task_id: task_id,
        task_Name: task_Name,
        test_cases: [test_cases]
      });
    }

    // Save the changes to the database
    await testCaseDoc.save();
    // Return the updated TestCase document
    return testCaseDoc;
  } catch (error) {
    throw error;
  }
}
const getTestCases = async (req, res) => {
  const { id } = req.params; // Assuming the ID is passed as a parameter in the URL

  try {
    // Find the TestCase document with the given ID
    const testCase = await TestCase.findOne({ task_id: id });
    // If no TestCase document is found
    if (!testCase) {
      return res.status(404).json({ message: 'Test cases not found for the given task ID' });
    }
    var test_cases = testCase.test_cases;
    const task_Name = testCase.task_Name;
    const newArray = await Promise.all(test_cases.map(async (item) => {
      const member = await Member.findById(item.creator);
      return {
        test_Name: item.test_Name,
        pre_conditions: item.pre_conditions,
        expected_result: item.expected_result,
        test_data: item.test_data,
        creator: member.name,
        creator_id: item.creator,
        task_Name: task_Name,
        task_id: testCase.task_id,
        status: item.status,
        _id: item._id
      };
    }));
    // Send the test cases as a response
    res.json(newArray);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
    // Handle errors as needed
  }
}
const getTestCaseskanban = async (req, res) => {
  const { id } = req.params; // Assuming the ID is passed as a parameter in the URL

  try {
    // Find the TestCase document with the given ID
    const testCase = await TestCase.findOne({ task_id: id });
    // If no TestCase document is found
    if (!testCase) {
      return res.status(404).json({ message: 'Test cases not found for the given task ID' });
    }
    var test_cases = testCase.test_cases;
    const task_Name = testCase.task_Name;
    const newArray = await Promise.all(test_cases.map(async (item) => {
      const member = await Member.findById(item.creator);
      return {
        test_Name: item.test_Name,
        pre_conditions: item.pre_conditions,
        expected_result: item.expected_result,
        test_data: item.test_data,
        creator: member.name,
        creator_id: item.creator,
        task_Name: task_Name,
        task_id: testCase.task_id,
        status: item.status,
        _id: item._id
      };
    }));
    // Send the test cases as a response
    res.json(newArray);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
    // Handle errors as needed
  }
}
const deleteTestCases = async (req, res) => {
  const { id } = req.params;
  const { test_id } = req.body;
  console.log(id, test_id);
  try {
    // Find the TestCase document with the given ID
    const testCase = await TestCase.findOne({ task_id: id });
    // If no TestCase document is found
    if (!testCase) {
      return res.status(404).json({ message: 'Test cases not found for the given task ID' });
    }

    // Find the index of the test case to be deleted
    const indexToDelete = testCase.test_cases.findIndex(testCase => testCase._id.equals(test_id));
    // If the test case is not found
    if (indexToDelete === -1) {
      return res.status(404).json({ message: 'Test case not found for the given test ID' });
    }

    // Remove the test case from the array
    testCase.test_cases.splice(indexToDelete, 1);
    // Save the updated TestCase document
    await testCase.save();

    res.status(200).json({ message: 'Test case deleted successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
    // Handle errors as needed
  }
};
const deleteTestCaseskanban = async (req, res) => {
  const { id } = req.params;
  const { test_id } = req.body;
  console.log(id, test_id);
  try {
    // Find the TestCase document with the given ID
    const testCase = await TestCase.findOne({ task_id: id });
    // If no TestCase document is found
    if (!testCase) {
      return res.status(404).json({ message: 'Test cases not found for the given task ID' });
    }

    // Find the index of the test case to be deleted
    const indexToDelete = testCase.test_cases.findIndex(testCase => testCase._id.equals(test_id));
    // If the test case is not found
    if (indexToDelete === -1) {
      return res.status(404).json({ message: 'Test case not found for the given test ID' });
    }

    // Remove the test case from the array
    testCase.test_cases.splice(indexToDelete, 1);
    // Save the updated TestCase document
    await testCase.save();

    res.status(200).json({ message: 'Test case deleted successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
    // Handle errors as needed
  }
}
const updateTestCases = async (req, res) => {
  const { id } = req.params;
  const { test_id, data } = req.body;
  console.log(id, test_id, data);
  try {
    // Find the TestCase document with the given ID
    const testCase = await TestCase.findOne({ task_id: id });
    // If no TestCase document is found
    if (!testCase) {
      return res.status(404).json({ message: 'Test cases not found for the given task ID' });
    }

    // Find the index of the test case to be deleted
    const indexToUpdate = testCase.test_cases.findIndex(testCase => testCase._id.equals(test_id));
    // If the test case is not found
    if (indexToUpdate === -1) {
      return res.status(404).json({ message: 'Test case not found for the given test ID' });
    }
    testCase.test_cases[indexToUpdate].test_Name = data.test_Name;
    testCase.test_cases[indexToUpdate].test_data = data.test_data;
    testCase.test_cases[indexToUpdate].pre_conditions = data.pre_conditions;
    testCase.test_cases[indexToUpdate].expected_result = data.expected_result;
    // Save the updated TestCase document
    console.log(testCase.test_cases[indexToUpdate])
    await testCase.save();

    res.status(200).json({ message: 'Test case updated successfully' });
  }
  catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
    // Handle errors as needed
  }
}
const updateTestCaseskanban = async (req, res) => {
  const { id } = req.params;
  const { test_id, data } = req.body;
  console.log(id, test_id, data);
  try {
    // Find the TestCase document with the given ID
    const testCase = await TestCase.findOne({ task_id: id });
    // If no TestCase document is found
    if (!testCase) {
      return res.status(404).json({ message: 'Test cases not found for the given task ID' });
    }

    // Find the index of the test case to be deleted
    const indexToUpdate = testCase.test_cases.findIndex(testCase => testCase._id.equals(test_id));
    // If the test case is not found
    if (indexToUpdate === -1) {
      return res.status(404).json({ message: 'Test case not found for the given test ID' });
    }
    testCase.test_cases[indexToUpdate].test_Name = data.test_Name;
    testCase.test_cases[indexToUpdate].test_data = data.test_data;
    testCase.test_cases[indexToUpdate].pre_conditions = data.pre_conditions;
    testCase.test_cases[indexToUpdate].expected_result = data.expected_result;
    // Save the updated TestCase document
    console.log(testCase.test_cases[indexToUpdate])
    await testCase.save();

    res.status(200).json({ message: 'Test case updated successfully' });
  }
  catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
    // Handle errors as needed
  }
}
const changeStatus = async (req, res) => {
  const { id } = req.params;
  const { test_id, status } = req.body;

  try {
    // Find the test case document with the given task ID
    const testCase = await TestCase.findOne({ task_id: id });
    if (!testCase) {
      return res.status(404).json({ message: 'Test cases not found for the given task ID' });
    }

    // Find the index of the test case to be updated
    const testToUpdate = testCase.test_cases.id(test_id);
    if (!testToUpdate) {
      return res.status(404).json({ message: 'Test case not found for the given test ID' });
    }
    console.log("kdfj");
    // Update the status of the found test case
    testToUpdate.status = status;

    // Save the updated document
    await testCase.save();
    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
const replaceAllTestInCardByCreator = async (req, res) => {
  const { id, boardId, cardId } = req.params;
  const { deletedMemberId, replacedId } = req.body;
  const board = await KanbanBoard.findOne({ _id: boardId });
  if (board !== -1) {
    const card = board.cards.find(card => card._id.equals(cardId));
    if (card !== -1) {
      for (const task of card.task) {
        const taskFromTestSchema = await TestCase.findOne({ task_id: task._id });
        if (taskFromTestSchema !== null && taskFromTestSchema.test_cases.length !== 0) {
          taskFromTestSchema.test_cases.forEach(testCase => {
            console.log(deletedMemberId, testCase.creator);
            if (testCase.creator.equals(deletedMemberId)) {
              testCase.creator = replacedId;
            }
          });
          console.log(taskFromTestSchema);
          await taskFromTestSchema.save();
        }
      }
      res.status(200).json({ message: "All tests created by the member have been Replaced." });
    }
    else {
      res.status(404).json({ message: "Card not found." });
    }
  }
}
const deleteAllTestInCardByCreator = async (req, res) => {
  const { id, boardId, cardId } = req.params;
  const { deletedMemberId } = req.body;
  const board = await KanbanBoard.findOne({ _id: boardId });
  if (board !== -1) {
    const card = board.cards.find(card => card._id.equals(cardId));
    if (card !== -1) {
      for (const task of card.task) {
        const taskFromTestSchema = await TestCase.findOne({ task_id: task._id });
        if ((taskFromTestSchema !== null) && taskFromTestSchema.test_cases.length !== 0) {
          const temp = taskFromTestSchema.test_cases.filter(testCase => {
            return !testCase.creator.equals(deletedMemberId);
          });
          console.log(temp);
          taskFromTestSchema.test_cases = temp;
          await taskFromTestSchema.save();
        }
      }
      res.status(200).json({ message: "All tests created by the member have been deleted." });
    }
    else {
      res.status(404).json({ message: "Card not found." });
    }
  }
}
const changeStatuskanban = async (req, res) => {
  const { id } = req.params;
  const { test_id, status } = req.body;

  try {
    // Find the test case document with the given task ID
    const testCase = await TestCase.findOne({ task_id: id });
    if (!testCase) {
      return res.status(404).json({ message: 'Test cases not found for the given task ID' });
    }

    // Find the index of the test case to be updated
    const testToUpdate = testCase.test_cases.id(test_id);
    if (!testToUpdate) {
      return res.status(404).json({ message: 'Test case not found for the given test ID' });
    }
    console.log("kdfj");
    // Update the status of the found test case
    testToUpdate.status = status;

    // Save the updated document
    await testCase.save();
    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
const deleteAllTestInCardByCreatorScrum = async (req, res) => {
  const { id, boardId, cardId } = req.params;
  const { deletedMemberId } = req.body;
  const board = await ScrumBoard.findOne({ _id: boardId });
  if (board !== -1) {
    const card = board.cards.find(card => card._id.equals(cardId));
    res.status(200).json(card);
    if (card !== -1) {
      for (const task of card.task) {
        const taskFromTestSchema = await TestCase.findOne({ task_id: task._id });
        if (taskFromTestSchema !== null && taskFromTestSchema.test_cases.length !== 0) {
          taskFromTestSchema.test_cases = taskFromTestSchema.test_cases.filter(testCase => {
            return testCase.creator !== deletedMemberId
          });
          console.log("hello", taskFromTestSchema);
          await taskFromTestSchema.save();
        }
      }
      res.status(200).json({ message: "All tests created by the member have been deleted." });
    }
    else {
      res.status(404).json({ message: "Card not found." });
    }
  }
}
const replaceAllTestInCardByCreatorScrum = async (req, res) => {
  const { id, boardId, cardId } = req.params;
  const { deletedMemberId, replacedId } = req.body;
  const board = await ScrumBoard.findOne({ _id: boardId });
  if (board !== -1) {
    const card = board.cards.find(card => card._id.equals(cardId));
    if (card !== -1) {
      for (const task of card.task) {
        console.log("task", task);
        const taskFromTestSchema = await TestCase.findOne({ task_id: task._id });
        if (taskFromTestSchema !== null && taskFromTestSchema.test_cases.length !== 0) {
          taskFromTestSchema.test_cases.forEach(testCase => {
            if (testCase.creator.equals(deletedMemberId)) {
              testCase.creator = replacedId;
            }
          });
          console.log(taskFromTestSchema);
          await taskFromTestSchema.save();
        }
      }
      res.status(200).json({ message: "All tests created by the member have been deleted." });
    }
    else {
      res.status(404).json({ message: "Card not found." });
    }
  }
}
// Function to create a new requirement
async function createKanbanRequirement(test_cases, task_id, task_Name) {
  try {
    let testCaseDoc = await TestCase.findOne({ task_id: task_id });

    // If a TestCase document with the given task_id exists
    if (testCaseDoc) {
      // Push the new test case to the test_cases array
      testCaseDoc.test_cases.push(test_cases);
    }
    else {
      // Create a new TestCase document if no document with the given task_id exists
      testCaseDoc = new TestCase({
        task_id: task_id,
        task_Name: task_Name,
        test_cases: [test_cases]
      });
    }

    // Save the changes to the database
    await testCaseDoc.save();
    // Return the updated TestCase document
    return testCaseDoc;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createKanbanRequirement, createScrumRequirement, getTestCases, deleteTestCases, updateTestCases, changeStatus, getTestCaseskanban, deleteTestCaseskanban, updateTestCaseskanban, changeStatuskanban, deleteAllTestInCardByCreator, replaceAllTestInCardByCreator, replaceAllTestInCardByCreatorScrum, deleteAllTestInCardByCreatorScrum
}