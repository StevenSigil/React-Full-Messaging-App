import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Main({ user }) {
  const firestore = firebase.firestore();
  const history = useHistory();

  const roomRef = firestore.collection("chatRooms");
  const roomQuery = roomRef.where("usersInRoom", "array-contains", user.uid);

  // const roomQuery = roomRef.orderBy("createdAt");
  const [rooms, loading] = useCollectionData(roomQuery, { idField: "id" });

  console.log(rooms);

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
                  <>
                    <SingleChatRoom room={room} roomRef={roomRef} user={user} />
                    {/* TODO: Add badge for new messages and new chatroom's */}
                  </>
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

function SingleChatRoom({ room, roomRef, user }) {
  function handleRemove() {
    const curDoc = roomRef.doc(room.id);

    if (room.usersInRoom.length === 1) {
      curDoc.delete();
      console.log(`Deleted room ${room.id}`);
    } else {
      curDoc.update({
        usersInRoom: firebase.firestore.FieldValue.arrayRemove(user.uid),
      });
    }
  }

  return (
    <div
      key={room.id}
      className="singleRoom-Main list-group-item list-group-item-action"
    >
      <Link to={`chat/${room.id}`} className="">
        {room.roomName}
      </Link>

      <div className="btn-container">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={handleRemove}
        >
          Remove
        </button>

        <button className="btn btn-outline-primary">other</button>
      </div>
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
