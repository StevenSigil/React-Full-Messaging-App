import React, { useState } from "react";
import Header from "./Header";

export default function LoginStandard(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailVerification(e) {
    e.preventDefault();

    setEmail("");
    setPassword("");

    return null;
  }

  return (
    <div className="container noPadding">
      <Header />

      <section className="mainBackground">
        <div className="loginStdHeading">
          <h2>Login with your Email Address</h2>
        </div>

        <div className="authFormOuter">
          <form onSubmit={handleEmailVerification}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Continue
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
