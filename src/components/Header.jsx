import React from "react";
import { NavLink, useHistory } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/auth";

export default function Header(props) {
  const history = useHistory();
  const user = props.user;

  return (
    <nav className="navbar">
      <div className="container navbar-dark">
        <NavLink to={user ? "/main" : "/welcome"} className="navbar-brand">
          R.M.
        </NavLink>

        {user ? (
          <PostLogin history={history} />
        ) : (
          <PreLogin history={history} />
        )}
      </div>
    </nav>
  );
}

function PreLogin() {
  return (
    <div className="navbar-nav" style={{ flexDirection: "row" }}>
      <NavLink className="nav-link active" aria-current="page" to="/login">
        Login
      </NavLink>
    </div>
  );
}

function PostLogin() {
  const auth = firebase.auth();

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <div className="navbar-nav" style={{ flexDirection: "row" }}>
      <NavLink className="nav-link active" aria-current="page" to="/main">
        Main
      </NavLink>

      <NavLink
        className="nav-link active"
        aria-current="page"
        onClick={handleSignOut}
        to="/"
      >
        Sign out
      </NavLink>
    </div>
  );
}
