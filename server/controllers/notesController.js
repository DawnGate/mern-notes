const asyncHandler = require("express-async-handler");
const Note = require("../models/Note");
const User = require("../models/User");

// @desc getAllNote
// @route GET /notes
// @access Private
const getAllNote = asyncHandler(async (req, res) => {
  // convert Mongo Object to json object
  const notes = await Note.find().lean();

  // check note length for return message
  if (!notes.length) {
    return res.status(400).json({ message: "No notes found" });
  }

  // modify value should return to client
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.username).lean().exec();
      return { ...note, usernameText: user.username };
    })
  );

  // return value to client
  return res.json(notesWithUser);
});

// @desc create new Note
// @route POST /notes
// @access Private
const createNote = asyncHandler(async (req, res) => {
  // extracting data required
  const { userId, title, text } = req.body;

  // confirm  data
  if (!userId || !title || !text) {
    return res.status(400).json({ message: "All fields is required" });
  }

  // check duplicate
  const duplicate = await Note.findOne({ title }).lean().exec();
  const user = await User.findById(userId).lean().exec();

  if (duplicate) {
    return res.status(400).json({ message: "Duplicate note title" });
  }

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // create and store new note
  const note = await Note.create({ username: user._id, title, text });

  if (note) {
    // Created
    return res.status(201).json({ message: "New note created" });
  } else {
    return res.status(400).json({ message: "Invalid note data received" });
  }
});

// @desc update exist note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  // extract data you need
  const { id, userId, title, text, completed } = req.body;

  //confirm data
  if (!id || !userId || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All field are required" });
  }

  // confirm not exist to update
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: "Not not found" });
  }

  // check duplicate
  const duplicate = await Note.findOne({ title }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(400).json({ message: "Duplicate not title" });
  }

  note.user = userId;
  note.title = title;
  note.text = text;
  note.completed = completed;

  // save update value to database
  const updateNote = await note.save();

  res.json(`${updateNote.title} updated`);
});

// @desc delete exist note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // confirm data

  if (!id) {
    return res.status(400).json({ message: "Note id required" });
  }

  // check existNote
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  // delete note
  const result = await note.deleteOne();

  const reply = `Note '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllNote,
  createNote,
  updateNote,
  deleteNote,
};
