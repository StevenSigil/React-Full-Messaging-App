import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/auth";

export default function Login() {
  const history = useHistory();
  const [hidePassPrompt, setHidePassPrompt] = useState(true);

  function signInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(() => history.push("/main"));
  }
  function signInWithGitHub() {
    var provider = new firebase.auth.GithubAuthProvider();
    var auth = firebase.auth();
    auth
      .signInWithPopup(provider)
      .then(() => history.push("/main"))
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          var pendingCred = error.credential;
          var email = error.email;
          auth.fetchSignInMethodsForEmail(email).then((methods) => {
            // if (methods[0] === "password") {
            //   // Asks the user their password.
            //   var password = promptUserForPassword(); // TODO: implement promptUserForPassword.
            //   auth
            //     .signInWithEmailAndPassword(email, password)
            //     .then(function (result) {
            //       // Step 4a.
            //       return result.user.linkWithCredential(pendingCred);
            //     })
            //     .then(function () {
            //       // GitHub account successfully linked to the existing Firebase user.
            //       goToApp();
            //     });
            //   return;
            // }
            var provider = getProviderForID(methods[0]);
            auth.signInWithPopup(provider).then((result) => {
              result.user.linkWithCredential(pendingCred).then(() => {
                console.log("Accounts successfully joined.");
                history.push("/main");
              });
            });
          });
        }
      });

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
  }

  function PasswordPrompt(props) {
    const [passInput, setPassInput] = useState("");
    const handleSubmit = props.handleSubmit;

    return (
      <div hidden={hidePassPrompt}>
        <p>
          You already have an account registered. Please enter that account's
          password here to merge accounts.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control"
            type="text"
            placeholder="Enter your password"
            value={passInput}
            onChange={() => setPassInput((e) => e.target.value)}
          />
          <button className='btn' style={{marginTop: '1rem'}} type='submit'>Submit</button>
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
    </div>
  );
}
