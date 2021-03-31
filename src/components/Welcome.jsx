import React from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="container noPadding">
      <div className="welcomeContainer mainBackground">
        <div className="container">
          <div className="welcomeHeading">
            <h1>Welcome to React Messaging!</h1>
          </div>

          <div className="welcomeBody">
            <p>
              Please <Link to="/login">sign in</Link> to continue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
