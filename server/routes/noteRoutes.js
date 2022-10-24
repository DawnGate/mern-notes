const express = require("express");

const router = express.Router();

const notesController = require("../controllers/notesController");

router
  .route("/")
  .get(notesController.getAllNote)
  .post(notesController.createNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote);

module.exports = router;
