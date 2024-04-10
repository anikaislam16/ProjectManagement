const express = require("express");
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deleteMemberfromProject,
  addMemberInProject,
  dependentcard,
  getProjectByMember,
} = require("./ScrumController/ScrumProjectController");
const {
  logRequestInfo,

  addBoard,
  showBoardById,
  updateBoard,
  deleteBoard,
  moveCardsToNewBoard
} = require("./ScrumController/ScrumBoardController.js");
const {
  addCard,
  updateCardName,
  updateCardField,
  deleteCardField,
  deleteCard,
  showCard,
  reorderCardsInSameBoard,
  reorderCardsInDiffBoard,
  deleteCardFieldbyMember,
  reorderCards
} = require("./ScrumController/ScrumBoardCardController");
router.use(logRequestInfo);
router.route("/").get(getAllProjects).post(createProject).put(getProjectByMember);
// project id diye project er schema change kora hbe.


router
  .route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject) //eta te oi project er board delete hbe na.
  .post(addBoard);
//project id r board id diye, board er info niye kaaj hbe.
router
  .route("/:id/:boardId")
  .put(updateBoard)
  .get(showBoardById)
  .delete(deleteBoard)
  .post(addCard);
//porject id, board id, card id diye card niye kaaj hbe.
router.route("/:id/:boardId/:cardId").get(showCard).delete(deleteCard);
router.route("/:id/:boardId/:cardId").put(updateCardName);
//card move er khetre eita kaj krbe. drag n drop er jonno.
router
  .route(
    "/:id/cards/reorderCards/:board1Id/:board2Id/:sourceIndex/:destinationIndex"
  )
  .put(reorderCardsInDiffBoard);
router
  .route("/:id/:boardId/cards/reorderCards/:sourceIndex/:destinationIndex")
  .put(reorderCardsInSameBoard);
//board e card er emn element jader specific id ace. tader info change er jonno or delete er jonno. eta korte , oi element name r oi element er id lagbe.
router
  .route("/:id/:boardId/:cardId/:subDocumentKey/:subDocumentId")
  .put(updateCardField)
  .post(deleteCardFieldbyMember)
  .delete(deleteCardField);
router.route("/boards/reorder/IHateThis/:boardId").put(moveCardsToNewBoard);
router.route("/member/member/:id/:memberId").delete(deleteMemberfromProject).post(addMemberInProject);
router
  .route(
    "/reorder/reorder/reorder/reorder/reorder/reorder/reorder/reorder/reorder/reorder"
  )
  .put(reorderCards);
router.route("/:id/:boardId/:cardId/dependency/card/check").get(dependentcard);
module.exports = router;