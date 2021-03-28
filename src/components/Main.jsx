import React, { useState } from "react";

import { useHistory } from "react-router";

export default function Main({ user }) {
  const [displayName, setDisplayName] = useState("");
  const history = useHistory();

  function updateDisplayName() {
    user
      .updateProfile({
        displayName: displayName,
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
    history.push("/main");
  }

  if (user && !user.displayName) {
    return (
      <div>
        <h1>Please update your display name to continue.</h1>

        <form onSubmit={updateDisplayName}>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display Name"
          />
          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container noPadding">
      <div className="mainBackground">
        <h1>You made it to Main!</h1>

        {user ? <p>{user.email}</p> : null}
        {user ? <p>{user.displayName}</p> : null}
      </div>
    </div>
  );
}
