import React from "react";
import { Link, useHistory } from "react-router-dom";
import Header from "./Header";

export default function Login(props) {
  const history = useHistory();

  function signInWithGoogle() {
    return null;
  }

  return (
    <div className="container noPadding">
      <Header />

      <section className="mainBackground">
        <div className="btnContainer">
          <button className="btn btn-dark" onClick={signInWithGoogle}>
            Sign in with Google
          </button>
          <button className="btn btn-dark">Sign in with GitHub</button>
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
