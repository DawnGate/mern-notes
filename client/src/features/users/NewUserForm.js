import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewUserMutation } from "./userApiSlice";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

function NewUserForm() {
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles(["Employee"]);
      navigate("/dash/users");
    }
  }, [isSuccess, navigate]);

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const onChangeRoles = (e) => {
    const options = e.target.selectedOptions;
    const values = Array.from(options, (option) => option.value);
    setRoles(values);
  };

  const canSave =
    [roles.length, validPassword, validUsername].every(Boolean) && !isLoading;

  const onSaveUserClick = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username, password, roles });
    }
  };

  const options = Object.values(ROLES).map((item) => {
    return (
      <option key={item} value={item}>
        {item}
      </option>
    );
  });

  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  const validPasswordClass = !validPassword ? "form__input--incomplete" : "";
  const validRolesClass = !Boolean(roles.length)
    ? "form__input--incomplete"
    : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <form className="form" onSubmit={onSaveUserClick}>
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[3-20 letter]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onChangeUsername}
        ></input>
        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[4-12 chars]</span>
        </label>
        <input
          className={`form__input ${validPasswordClass}`}
          id="password"
          name="password"
          type="text"
          autoComplete="off"
          value={password}
          onChange={onChangePassword}
        ></input>
        <label className="form__label" htmlFor="roles">
          ASSIGNED ROLES:
        </label>
        <select
          className={`form__select ${validRolesClass}`}
          id="roles"
          name="roles"
          multiple={true}
          size={3}
          value={roles}
          onChange={onChangeRoles}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
}

export default NewUserForm;
