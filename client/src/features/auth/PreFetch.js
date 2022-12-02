import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { store } from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/userApiSlice";

// this function create a subcriber for the data
// so this data don't clear when call again
// because not have plan for call data next time with :id
function PreFetch() {
  useEffect(() => {
    console.log("Subscribing");
    const notes = store.dispatch(notesApiSlice.endpoints.getNote.initiate());
    const users = store.dispatch(usersApiSlice.endpoints.getUser.initiate());
    return () => {
      notes.unsubscribe();
      users.unsubscribe();
    };
  }, []);
  return <Outlet />;
}

export default PreFetch;
