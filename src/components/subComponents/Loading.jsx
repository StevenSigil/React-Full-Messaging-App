import React from "react";

export default function Loading({ user }) {
  return (
    <div className="container noPadding">
      <div className="welcomeContainer mainBackground">
        <div className="container">
          <div className="welcomeHeading">
            <h3>Loading...</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
