import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteNoteMutation, useUpdateNoteMutation } from "./notesApiSlice";

function EditNoteForm({ users, note }) {
  const [editNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation();

  const [
    deleteNote,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteNoteMutation();

  const navigate = useNavigate();

  const [userId, setUserId] = useState(note.username);
  const [text, setText] = useState(note.text);
  const [title, setTitle] = useState(note.title);
  const [completed, setCompleted] = useState(note.completed);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUserId("");
      setText("");
      setTitle("");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate, isDelSuccess]);

  const onChangeUserId = (e) => {
    setUserId(e.target.value);
  };
  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const onChangeWorkComplete = (e) => {
    setCompleted((prev) => !prev);
  };

  const onChangeText = (e) => setText(e.target.value);

  const canSave = [userId, title, text].every(Boolean) && !isLoading;

  const onSaveNoteClick = async (e) => {
    e.preventDefault();
    if (canSave) {
      await editNote({ userId, title, text, id: note.id, completed });
    }
  };

  const onDeleteNoteClick = async (e) => {
    e.preventDefault();
    await deleteNote({ id: note.id });
  };

  const created = new Date(note.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(note.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const options = Object.values(users).map((item) => {
    return (
      <option key={item.id} value={item.id}>
        {item.username}
      </option>
    );
  });

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validUserClass = !userId ? "form__input--incomplete" : "";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>
        {(error?.data?.message || delError?.data?.message) ?? ""}
      </p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              disabled={!canSave}
              onClick={onSaveNoteClick}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteNoteClick}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          Note title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onChangeTitle}
        ></input>
        <label className="form__label" htmlFor="text_input">
          Note text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="text_input"
          name="text_input"
          type="text"
          value={text}
          onChange={onChangeText}
        ></textarea>
        <div className="form__row">
          <div className="form__divider">
            <label className="form__label" htmlFor="completedId">
              WORK COMPLETED:
            </label>
            <input
              className={`form__select `}
              id="completedId"
              name="completeId"
              type="checkbox"
              checked={completed}
              onChange={onChangeWorkComplete}
            ></input>
            <label className="form__label" htmlFor="userId">
              ASSIGNED USERS:
            </label>
            <select
              className={`form__select ${validUserClass}`}
              id="userId"
              name="userId"
              multiple={false}
              value={userId}
              onChange={onChangeUserId}
            >
              {options}
            </select>
          </div>
          <div className="form__divider">
            <p className="form__created">
              Created: <br />
              {created}
            </p>
            <p className="form__updated">
              Updated: <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );

  return content;
}

export default EditNoteForm;
