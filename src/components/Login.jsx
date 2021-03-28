import React from "react";
import { Link, useHistory } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/auth";

export default function Login(props) {
  const history = useHistory();

  function signInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(() => history.push("/main"));
  }

  return (
    <div className="container noPadding">
      <section className="mainBackground">
        <div className="btnContainer">
          <button className="btn btn-dark" onClick={signInWithGoogle}>
            Sign in with Google
          </button>
          <button className="btn btn-dark" onClick={signInWithGoogle}>
            Sign in with GitHub
          </button>
          <button
            className="btn btn-dark"
            onClick={() => history.push("/login-standard")}
          >
            Sign in with Email
          </button>
          <Link to="/register">Register for an email account</Link>
        </div>
      </section>
    </div>
  );
}
