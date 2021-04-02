import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

// export default function Main({  }) {
//   const [user] = useAuthState(firebase.auth());
//   return user && user.displayName ? (
//     <MainContent user={user} />
//   ) : (
//     <div className="container noPadding">
//       <section className="mainBackground">
//         <UpdateDisplayName user={user} />
//       </section>
//     </div>
//   );
// }

export default function Main(props) {
  const user = props.user;

  const history = useHistory();

  const firestore = firebase.firestore();
  const roomRef = firestore.collection("chatRooms");
  const roomQuery = roomRef.where("usersInRoom", "array-contains", user.uid);
  const [rooms, loading] = useCollectionData(roomQuery, { idField: "id" });

  const [codeInput, setCodeInput] = useState("");
  const [hideCodeInput, setHideCodeInput] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  const [hideErrAlert, setHideErrAlert] = useState(true);

  const [hideUpdateNameModal, setHideUpdateNameModal] = useState(true);

  useEffect(() => {
    if (user) {
      console.log(user.displayName);
      if (!user.displayName) setHideUpdateNameModal(false);
    }
  }, [user, setHideUpdateNameModal]);

  function addUserToRoom(e) {
    e.preventDefault();
    const addingRoom = firestore.collection("chatRooms").doc(codeInput);

    addingRoom // check if room exists
      .get()
      .then((doc) => {
        if (doc.exists) {
          // Add the user to the room
          addingRoom.update({
            usersInRoom: firebase.firestore.FieldValue.arrayUnion(user.uid),
          });
          roomAlertOK(2000);
          setHideCodeInput(true);
        } else {
          console.log("error retrieving the specified room.");
          roomAlertERR(2000);
        }
        setCodeInput("");
      })
      .catch((error) => console.log(error));
  }

  function RoomAddedAlert() {
    return (
      <div
        className="card customAlert"
        style={{ backgroundColor: "#0b93f6de" }}
        hidden={hideConfirm}
      >
        <div className="card-body">
          <h5>Room added!</h5>
        </div>
      </div>
    );
  }
  function RoomErrorAlert() {
    return (
      <div
        className="card customAlert"
        style={{ backgroundColor: "rgba(230, 71, 71, 0.9)" }}
        hidden={hideErrAlert}
      >
        <div className="card-body">
          <h5>Room not found</h5>
        </div>
      </div>
    );
  }

  function roomAlertOK(duration) {
    setHideConfirm(false);
    setTimeout(function () {
      setHideConfirm(true);
    }, duration);
  }
  function roomAlertERR(duration) {
    setHideErrAlert(false);
    setTimeout(function () {
      setHideErrAlert(true);
    }, duration);
  }

  return user ? (
    <div className="container noPadding">
      <section className="mainBackground main">
        <div className="main-head">
          <h1>Your chatroom's</h1>
        </div>

        {loading ? <p>Loading...</p> : null}

        <div className="lowerContainer">
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

          <button onClick={() => history.push("new-room")} className="btn mt-2">
            Create a new chatroom
          </button>

          <button onClick={() => setHideCodeInput(false)} className="btn mt-2">
            Have a code to another room?
          </button>

          <div className="card mt-2" hidden={hideCodeInput}>
            <div className="card-body">
              <form onSubmit={addUserToRoom}>
                <label htmlFor="codeInput" className="card-title">
                  Enter the room code here:
                </label>
                <div style={{ display: "flex" }}>
                  <input
                    id="codeInput"
                    className="form-control"
                    placeholder="Code"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                  />
                  <button type="submit" className="btn">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <RoomAddedAlert />
      <RoomErrorAlert />

      <UpdateDisplayName
        user={user}
        hideModal={hideUpdateNameModal}
        setHideModal={setHideUpdateNameModal}
      />
    </div>
  ) : (
    <p>err</p>
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
    <div className="card roomCard mt-2">
      <div className="row g-0">
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{room.roomName}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{room.id}</h6>
            <p className="text-muted">
              Last message: <DateTimeDiff a={lastMessageDt} b={now} />
            </p>
          </div>
        </div>
        <div className="col-md-4 buttons-outer">
          <div className="card-body buttons">
            <button
              className="btn"
              onClick={() => {
                history.push(`/chat/${room.id}`);
              }}
            >
              Enter room
            </button>
            <Link to="#" roll="button" onClick={handleRemove}>
              Remove
            </Link>
          </div>
        </div>
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
    return `over ${diffHr} hour${diffHr !== 1 ? "s" : null} ago.`;
  }
  if (diffDays > 0) {
    return `over ${diffDays} day${diffDays !== 1 ? "s" : null} ago.`;
  }
  return `${diffM} minute${diffM !== 1 ? "s" : null} ago.`;
}

function UpdateDisplayName({ user, hideModal, setHideModal }) {
  const [newName, setNewName] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);

  function handleChange(input) {
    setNewName(input);
    if (input.length > 1) {
      setBtnDisabled(false);
    }
  }

  function handleSubmit() {
    user
      .updateProfile({
        displayName: newName,
      })
      .then(() => {
        setHideModal(true);
        return user;
      })
      .catch((error) => console.log(error));
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          minWidth: "100vw",
          minHeight: "100vh",
          backgroundColor: "rgba(24, 24, 24, 0.473)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        hidden={hideModal}
      >
        <div style={{ minWidth: "30vw", minHeight: "20vh" }} className="card">
          <div className="card-body">
            <h5 className="card-title">
              Please update your display name to continue
            </h5>
            <input
              type="text"
              placeholder="Enter a new display name here"
              className="form-control"
              value={newName}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
          <div className="card-footer">
            <button
              disabled={btnDisabled}
              type="button"
              className="btn"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
