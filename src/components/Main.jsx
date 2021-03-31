import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Main({ user }) {
  const history = useHistory();

  const firestore = firebase.firestore();
  const roomRef = firestore.collection("chatRooms");
  const roomQuery = roomRef.where("usersInRoom", "array-contains", user.uid);
  const [rooms, loading] = useCollectionData(roomQuery, { idField: "id" });

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

        <div className="main-chatRoomSingleContainer">
          {rooms
            ? rooms.map((room) => {
                return (
                  <SingleChatRoom
                    key={room.id}
                    room={room}
                    roomRef={roomRef}
                    user={user}
                    history={history}
                  />
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

function SingleChatRoom(props) {
  const { room, roomRef, user, history } = props;

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

  var lastMessageDt;
  if (room.lastMessageTime) {
    lastMessageDt = new firebase.firestore.Timestamp(
      room.lastMessageTime.seconds,
      room.lastMessageTime.nanoseconds
    ).toDate();
  } else lastMessageDt = new Date();
  const now = new Date();

  return (
    <div className="singleRoom-Main">
      <div
        className="roomName"
        onClick={() => {
          history.push(`/chat/${room.id}`);
        }}
      >
        <p>{room.roomName}</p>
        <code>{room.id}</code>
      </div>

      <div className="btn-container">
        <div>
          <p>Last message:</p>
          {"  "}
          <DateTimeDiff a={lastMessageDt} b={now} />
        </div>

        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={handleRemove}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function DateTimeDiff({ a, b }) {
  // a and b are Date obj.'s
  const diffMs = Math.abs(b - a);
  const diffM = Math.floor(diffMs / 1000 / 60);
  const diffHr = Math.floor(diffM / 60);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHr > 0 && diffDays < 1) {
    return (
      <p>
        over {diffHr} hour{diffHr !== 1 ? "s" : null} ago.
      </p>
    );
  }
  if (diffDays > 0) {
    return (
      <p>
        over {diffDays} day{diffDays !== 1 ? "s" : null} ago.
      </p>
    );
  }
  return (
    <p className="lighter">
      {diffM} minute{diffM !== 1 ? "s" : null} ago.
    </p>
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
