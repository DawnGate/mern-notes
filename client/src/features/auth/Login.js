import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuthenMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { getAccessToken } from "./authSlice";
import usePersist from "../../hooks/usePersist";
const Login = () => {
  const errRef = useRef(null);
  const userRef = useRef(null);

  const [username, setUserName] = useState("");
  const [password, setPassord] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const [login, { isLoading }] = useAuthenMutation();

  const handleUserChange = (e) => {
    setUserName(e.currentTarget.value);
  };

  const handlePasswordChange = (e) => {
    setPassord(e.currentTarget.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password }).unwrap();
      dispatch(getAccessToken({ ...res }));
      setUserName("");
      setPassord("");
      navigate("/dash");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No server response");
      } else if (err.status === 400) {
        setErrMsg("Missing username or password");
      } else if (err.status === 401) {
        setErrMsg("UnAuthorized");
      } else {
        setErrMsg(err?.data?.message);
      }

      errRef.current.focus();
    }
  };

  const handleToggle = () => {
    console.log("click");
    setPersist((prev) => !prev);
  };

  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) return <p>Loading...</p>;

  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main>
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            className="form__input"
            type="text"
            ref={userRef}
            value={username}
            onChange={handleUserChange}
            autoComplete="off"
            required
          ></input>
          <label password="password">Password:</label>
          <input
            id="password"
            className="form__input"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          ></input>
          <button className="form__submit-button">Sign In</button>

          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
            ></input>
            Trust this devices
          </label>
        </form>
      </main>
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );
  return content;
};

export default Login;
