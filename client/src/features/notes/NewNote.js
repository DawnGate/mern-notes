import React from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/userApiSlice";
import NewNoteForm from "./NewNoteForm";

function NewNote() {
  const users = useSelector(selectAllUsers);

  if (!users?.length > 0) return <p>Not current available</p>;

  const content =
    users.length > 0 ? (
      <NewNoteForm users={users}></NewNoteForm>
    ) : (
      <p>Loading...</p>
    );
  return content;
}

export default NewNote;
