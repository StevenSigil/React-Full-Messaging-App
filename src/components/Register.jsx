import React, { useState } from "react";

import firebase from "firebase/app";
import "firebase/auth";
import { useHistory } from "react-router";

export default function Register() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [formErr, setFormErr] = useState({
    email: false,
    password: false,
  });
  const [emailErrText, setEmailErrText] = useState(
    "Please enter a valid email address."
  );

  function handleRegistration(e) {
    e.preventDefault();

    const x = checkEmailPassword(email, password, setFormErr);
    if (Object.values(x).includes(false)) {
      console.log("Error submitting registration data.");
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => history.push("/main"))
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setEmailErrText(
            "This email address is already associated to an account.\nPlease sign in with previous credentials/provider, or register a new email address with password."
          );
          setFormErr((prev) => {
            return { ...prev, email: true };
          });
        }
      });
  }

  return (
    <div className="container noPadding">
      <section className="mainBackground">
        <div className="registerHeading">
          <h2>Register with your Email Address</h2>
        </div>

        <div className="authFormOuter">
          <form
            onSubmit={handleRegistration}
            className="needs-validation"
            noValidate
          >
            <div className="form-innerDiv">
              <label htmlFor="registerEmail" className="form-label">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                id="registerEmail"
                placeholder="Email"
                className={formErr.email ? "form-control is-invalid" : null}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="invalid-feedback">{emailErrText}</div>
            </div>

            <div className="form-innerDiv">
              <label htmlFor="registerPassword" className="form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                id="registerPassword"
                aria-describedby="passwordHelp"
                placeholder="Password"
                className={formErr.password ? "form-control is-invalid" : null}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className={formErr.password ? "invalid-feedback" : "form-text"}
                id="passwordHelp"
              >
                Password must be at least 8 characters and container one or more
                special characters.
              </div>
            </div>

            <button type="submit" className="btn">
              Continue
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function checkEmailPassword(email, password, setFormErrors) {
  const results = { email: false, password: false };

  if (!email.includes("@" && ".") || email.length < 5) {
    setFormErrors((prev) => {
      return { ...prev, email: true };
    });
    results.email = false;
  } else {
    setFormErrors((prev) => {
      return { ...prev, email: false };
    });
    results.email = true;
  }

  if (
    password.length < 8 &&
    !password.includes(
      "!" ||
        "#" ||
        "$" ||
        "%" ||
        "&" ||
        "(" ||
        ")" ||
        "*" ||
        "+" ||
        "," ||
        "-" ||
        "." ||
        "/" ||
        ":" ||
        ";" ||
        "<" ||
        "=" ||
        ">" ||
        "?" ||
        "@" ||
        "[" ||
        "]" ||
        "^" ||
        "_" ||
        "{" ||
        "}"
    )
  ) {
    setFormErrors((prev) => {
      return { ...prev, password: true };
    });
    results.password = false;
  } else {
    setFormErrors((prev) => {
      return { ...prev, password: false };
    });
    results.password = true;
  }

  return results;
}
