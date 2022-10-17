const asyncHandler = require("express-async-handler");
const Note = require("../models/Note");
const User = require("../models/User");

// @desc getAllNote
// @route GET /notes
// @access Private
const getAllNote = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean();

  if (!notes.length) {
    return res.status(400).json({ message: "No notes found" });
  }

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  return res.json(notesWithUser);
});

// @desc create new Note
// @route POST /notes
// @access Private
const createNote = asyncHandler(async (req, res) => {});

// @desc update exist note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {});

// @desc delete exist note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {});

module.exports = {
  getAllNote,
  createNote,
  updateNote,
  deleteNote,
};
