import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/auth";

export default function Login() {
  const history = useHistory();
  const auth = firebase.auth();

  const [hidePassPrompt, setHidePassPrompt] = useState(true);

  const [showErrLogin, setShowErrLogin] = useState(false);

  const [errEmail, setErrEmail] = useState("");
  const [errPendingCred, setErrPendingCred] = useState(null);

  function handleAccountExistsError(email, pendingCred) {
    setErrPendingCred(pendingCred);
    setErrEmail(email);

    auth.fetchSignInMethodsForEmail(email).then((methods) => {
      if (methods[0] === "password") {
        setHidePassPrompt(false);
        return;
      }
      var provider = getProviderForID(methods[0]);
      auth.signInWithPopup(provider).then((result) => {
        result.user.linkWithCredential(pendingCred).then(() => {
          console.log("Accounts successfully joined.");
          history.push("/main");
        });
      });
    });
  }

  function signInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      // .signInWithRedirect(provider)
      .signInWithPopup(provider)
      .then(() => history.push("/main"))
      .catch((err) => {
        console.log(err);
        setShowErrLogin(true);
      });
  }
  function signInWithGitHub() {
    var provider = new firebase.auth.GithubAuthProvider();
    auth
      .signInWithPopup(provider)
      .then(() => history.push("/main"))
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          handleAccountExistsError(error.email, error.credential);
        }
        setShowErrLogin(true);
      });
  }

  function getProviderForID(method) {
    if (method === "google.com") {
      return new firebase.auth.GoogleAuthProvider();
    }
    if (method === "github.com") {
      return new firebase.auth.GithubAuthProvider();
    } else
      console.log(
        "Application cannot determine an OAuth provider from the available providers. Try a password based sign in?"
      );
  }

  function PasswordPrompt() {
    const [passInput, setPassInput] = useState("");

    function handleSubmit(e) {
      e.preventDefault();

      firebase
        .auth()
        .signInWithEmailAndPassword(errEmail, passInput)
        .then((result) => {
          return result.user.linkWithCredential(errPendingCred);
        })
        .then(() => {
          history.push("/main");
        });
    }

    return (
      <div hidden={hidePassPrompt}>
        <p>
          You already have an account registered. Please enter that account's
          password here to merge accounts.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control"
            type="password"
            placeholder="Enter your password"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
          />
          <button className="btn" style={{ marginTop: "1rem" }} type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container noPadding">
      <section className="mainBackground">
        <div className="btnContainer">
          <h1>Choose a method of signing in</h1>
          <button className="btn" onClick={signInWithGoogle}>
            Sign in with Google
          </button>
          <button className="btn" onClick={signInWithGitHub}>
            Sign in with GitHub
          </button>
          <button
            className="btn"
            onClick={() => history.push("/login-standard")}
          >
            Sign in with Email
          </button>
          <Link to="/register">Register for an email account</Link>

          <PasswordPrompt />
        </div>
      </section>

      <ErrLogin showErrLogin={showErrLogin} setShowErrLogin={setShowErrLogin} />
    </div>
  );
}

function ErrLogin({ showErrLogin, setShowErrLogin }) {
  useEffect(() => {
    if (showErrLogin) {
      setTimeout(() => {
        setShowErrLogin(false);
      }, 6000);
    }
  }, [showErrLogin, setShowErrLogin]);

  return (
    <>
      <div className="errAlert" hidden={!showErrLogin}>
        <p>
          There was an error logging in. If this problem persists, please ensure
          pop ups are enabled for 3rd party authentication. You can also
          register for a basic account <Link to="/register">here</Link>.
        </p>
      </div>
    </>
  );
}
