import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Main({ user }) {
  const firestore = firebase.firestore();
  const history = useHistory();

  const roomRef = firestore.collection("chatRooms");
  const roomQuery = roomRef.orderBy("createdAt");
  const [rooms, loading] = useCollectionData(roomQuery, { idField: "id" });

  console.log(roomRef);

  if (user && !user.displayName) {
    return <UpdateDisplayName user={user} />;
  }

  return (
    <div className="container noPadding">
      <section className="mainBackground main">
        <div className="main-head">
          <h1>Your chatroom's</h1>
        </div>

        {loading ? <p>Loading...</p> : null}

        <div className="list-group main-chatRoomSingleContainer">
          {rooms
            ? rooms.map((room) => {
                return (
                  <Link
                    to={`chat/${room.id}`}
                    key={room.id}
                    className="list-group-item list-group-item-action"
                  >
                    {room.roomName}
                    {/* TODO: Add badge for new messages and new chatroom's */}
                  </Link>
                );
              })
            : null}
        </div>

        <div className="container">
          <button
            onClick={() => history.push("new-room")}
            className="btn btn-dark btn-lg"
          >
            Create a new chatroom
          </button>
        </div>
      </section>
    </div>
  );
}

function UpdateDisplayName({ user }) {
  const history = useHistory();
  const [displayName, setDisplayName] = useState("");

  function updateDisplayName() {
    user
      .updateProfile({
        displayName: displayName,
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
    history.push("/main");
  }

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
