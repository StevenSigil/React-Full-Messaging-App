import React, { useState } from "react";

import firebase from "firebase/app";
import "firebase/auth";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [
    createUserWithEmailAndPassword,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(firebase.auth());

  if (error) console.log(error);
  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  function handleRegistration(e) {
    e.preventDefault();
    createUserWithEmailAndPassword(email, password);
  }

  return (
    <div className="container noPadding">
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
            <button type="submit" className="btn">
              Continue
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
