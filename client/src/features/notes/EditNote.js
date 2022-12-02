import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectAllUsers } from "../users/userApiSlice";
import EditNoteForm from "./EditNoteForm";
import { selectNoteById } from "./notesApiSlice";

function EditNote() {
  const { id } = useParams();
  const note = useSelector((state) => selectNoteById(state, id));
  const users = useSelector(selectAllUsers);

  const content =
    note && users ? (
      <EditNoteForm note={note} users={users}></EditNoteForm>
    ) : (
      <p>Loading</p>
    );
  return content;
}

export default EditNote;
