import React, { useState } from "react";

import firebase from "firebase/app";
import "firebase/auth";

export default function LoginStandard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [formErr, setFormErr] = useState({
    email: false,
    password: false,
  });
  const [emailErrText, setEmailErrText] = useState(
    "Please enter a valid email"
  );

  function handleEmailRegistration(e) {
    e.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        setFormErr({ email: true, password: true });
        if (error.code === "auth/wrong-password") {
          setFormErr({ email: false, password: true });
        }
        if (error.code === "auth/user-not-found") {
          setEmailErrText(
            "No account found with this email address. Please try again, or re-register the email."
          );
        }
      });
  }

  return (
    <div className="container noPadding">
      <section className="mainBackground">
        <div className="loginStdHeading">
          <h2>Login with your Email Address</h2>
        </div>

        <div className="authFormOuter">
          <form
            onSubmit={handleEmailRegistration}
            className="needs-validation"
            noValidate
          >
            <div className="form-innerDiv">
              <label htmlFor="loginEmail" className="form-label">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                id="loginEmail"
                placeholder="Email"
                className={
                  formErr.email ? "form-control is-invalid" : "form-control"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="invalid-feedback">{emailErrText}</div>
            </div>

            <div className="form-innerDiv">
              <label htmlFor="loginPass" className="form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                id="loginPass"
                placeholder="Password"
                className={
                  formErr.password ? "form-control is-invalid" : "form-control"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="invalid-feedback">Invalid password</div>
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
