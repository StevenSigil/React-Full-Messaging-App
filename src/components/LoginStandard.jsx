import React, { useState } from "react";

import firebase from "firebase/app";
import "firebase/auth";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

export default function LoginStandard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [
    signInWithEmailAndPassword,
    // user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(firebase.auth());

  function handleEmailRegistration(e) {
    e.preventDefault();
    signInWithEmailAndPassword(email, password);
  }

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container noPadding">
      <section className="mainBackground">
        <div className="loginStdHeading">
          <h2>Login with your Email Address</h2>
        </div>

        <div className="authFormOuter">
          <form onSubmit={handleEmailRegistration}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className='form-control'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className='form-control'
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
