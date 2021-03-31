import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/firestore";

export default function NewRoom({ user }) {
  const [roomInput, setRoomInput] = useState("");
  const [newRoomLocalUrl, setNewRoomLocalUrl] = useState("");
  const [newRoomFullUrl, setNewRoomFullUrl] = useState("");

  const history = useHistory();
  let location = window.location.origin;

  function handleFormSubmit(e) {
    e.preventDefault();

    firebase
      .firestore()
      .collection("chatRooms")
      .add({
        roomName: roomInput,
        createdAt: firebase.firestore.Timestamp.now(),
        uid: user.uid,
        usersInRoom: [user.uid],
      })
      .then((docRef) => {
        setNewRoomLocalUrl(`/chat/${docRef.id}`);
        setNewRoomFullUrl(`${location}/chat/${docRef.id}`);
      })
      .catch((err) => console.log(err));
    setRoomInput("");
  }

  function handleCopyButtonClick() {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", newRoomFullUrl);
  }

  return (
    <div className="container noPadding">
      <section className="mainBackground newRoom">
        <div className="main-head">
          <h1>Create a new room</h1>
        </div>

        <form className="newRoomForm" onSubmit={handleFormSubmit}>
          <input
            className="form-control"
            type="text"
            placeholder="Enter a room name"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
          />
          <button className="btn btn-dark">Create</button>
        </form>

        <div className="created">
          {newRoomFullUrl ? (
            <>
              <p style={{ display: "none" }} id="hiddenUrl">
                {newRoomFullUrl}
              </p>
              <p>
                Your chatroom url is{" "}
                <code>
                  <Link to={newRoomLocalUrl}>{newRoomFullUrl}</Link>
                </code>
              </p>
              <p>Invite people by sharing this link!</p>
              <button
                className="btn btn-success"
                onClick={handleCopyButtonClick}
              >
                Copy
              </button>
              <button
                className="btn btn-primary"
                onClick={() => history.push(newRoomLocalUrl)}
              >
                Go to Chat
              </button>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
