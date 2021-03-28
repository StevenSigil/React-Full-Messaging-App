import React, { useState } from "react";
import Header from "./Header";

export default function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  function handleRegistration(e) {
    e.preventDefault();

    setEmail("");
    setPassword("");
    setDisplayName("");

    return null;
  }

  return (
    <div className="container noPadding">
      <Header />

      <section className="mainBackground">
        <div className="registerHeading">
          <h2>Register with your Email Address</h2>
        </div>

        <div className="authFormOuter">
          <form onSubmit={handleRegistration}>
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
            <input
              type="text"
              name="displayName"
              placeholder="Display name"
              className="form-control"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
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
