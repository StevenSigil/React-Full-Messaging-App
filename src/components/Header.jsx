import React from "react";
import { Link, useHistory } from "react-router-dom";

export function PreLogin(props) {
  return (
    <div>
      <button
        onClick={() => props.history.push("/login")}
        className="btn btn-dark"
      >
        Login
      </button>
    </div>
  );
}

export function PostLogin(props) {
  return (
    <div>
      <button
        onClick={() => props.history.push("/main")}
        className="btn btn-dark twoButtonNav"
      >
        Main
      </button>
      <button
        onClick={() => props.history.push("/logout")}
        className="btn btn-dark"
      >
        Logout
      </button>
    </div>
  );
}

export default function Header(props) {
  const history = useHistory();

  return (
    <>
      <nav className="navbar container header">
        <Link to="/" className="navbar-brand">
          R.M.
        </Link>

        {/* {user ? (
          <PostLogin history={history} />
        ) : (
          <PreLogin history={history} />
        )} */}

        <PreLogin history={history} />
        {/* <PostLogin history={history} /> */}
      </nav>
    </>
  );
}
