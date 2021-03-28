import React from "react";
import { Link, useHistory } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/auth";

export default function Header(props) {
  const history = useHistory();
  const user = props.user;

  return (
    <>
      <nav className="navbar container header">
        <Link to={user ? "/main" : "/welcome"} className="navbar-brand">
          R.M.
        </Link>

        {user ? (
          <PostLogin history={history} />
        ) : (
          <PreLogin history={history} />
        )}
      </nav>
    </>
  );
}

function PreLogin(props) {
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

function PostLogin(props) {
  return (
    <div>
      <button
        onClick={() => props.history.push("/main")}
        className="btn btn-dark twoButtonNav"
      >
        Main
      </button>

      <Logout history={props.history} />
    </div>
  );
}

function Logout({ history }) {
  const auth = firebase.auth();

  const handleSignOut = () => {
    auth.signOut();
    history.push("/");
  };

  return (
    auth.currentUser && (
      <button className="btn btn-dark" onClick={handleSignOut}>
        Sign Out
      </button>
    )
  );
}
