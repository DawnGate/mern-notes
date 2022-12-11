import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useLogoutMutation } from "../features/auth/authApiSlice";
import { useEffect } from "react";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [navigate, isSuccess]);

  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>Error: {error?.data?.message}</p>;

  let dashClass = "";

  if (
    DASH_REGEX.test(pathname) &&
    USERS_REGEX.test(pathname) &&
    NOTES_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  const logoutBtn = (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );
  const content = (
    <header className="dash-header">
      <div className={`dash-header__container ${dashClass}`}>
        <Link to="/dash">
          <h1 className="dash-header__title">techNotes</h1>
        </Link>
        <nav className="dash-header__nav">
          {/* add nav buttons later */}

          {logoutBtn}
        </nav>
      </div>
    </header>
  );

  return content;
};
export default DashHeader;
