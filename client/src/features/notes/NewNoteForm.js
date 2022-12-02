import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNoteMutation } from "./notesApiSlice";

function NewNoteForm({ users }) {
  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNoteMutation();

  const navigate = useNavigate();

  const [userId, setUserId] = useState(users[0].id);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUserId("");
      setText("");
      setTitle("");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  const onChangeUserId = (e) => {
    setUserId(e.target.value);
  };
  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeText = (e) => setText(e.target.value);

  const canSave = [userId, title, text].every(Boolean) && !isLoading;

  const onSaveNoteClick = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewNote({ userId, title, text });
    }
  };

  const options = Object.values(users).map((item) => {
    return (
      <option key={item.id} value={item.id}>
        {item.username}
      </option>
    );
  });

  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = !userId ? "form__input--incomplete" : "";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <form className="form" onSubmit={onSaveNoteClick}>
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
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
      </form>
    </>
  );

  return content;
}

export default NewNoteForm;
