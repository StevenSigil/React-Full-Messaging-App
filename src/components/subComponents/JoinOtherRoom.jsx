import React, { useState } from "react";

import firebase from "firebase/app";
import "firebase/firestore";

import {
  roomAlertERR,
  roomAlertOK,
  RoomErrorAlert,
  RoomConfirmAlert,
} from "./CustomAlerts";

import {
  DateTimeDiff,
  addUserToRoomWithRoomID,
  convertTimeFromFirebaseTimeStamp,
} from "./Util";

export default function JoinOtherRoom({ user }) {
  const [hideCodeInput, setHideCodeInput] = useState(true);
  const [hideRoomNameInput, setHideRoomNameInput] = useState(true);

  const [hideConfirmAlert, setHideConfirmAlert] = useState(true);
  const [hideErrAlert, setHideErrAlert] = useState(true);

  function toggleInputComponent(openComp) {
    switch (openComp) {
      case "codeInput":
        setHideCodeInput(false);
        setHideRoomNameInput(true);
        break;
      case "roomName":
        setHideCodeInput(true);
        setHideRoomNameInput(false);
        break;

      default:
        console.log("error switching the open component from button click!");
        console.log(`Parameter "openComp" === ${openComp}`);
        break;
    }
    return;
  }

  return (
    <>
      <div className="card joinButtons">
        <div className="card-body">
          <h5 className="card-title">Trying to join another room?</h5>
        </div>
        <div className="card-body">
          <button
            className="btn"
            onClick={() => toggleInputComponent("codeInput")}
          >
            Join with a room ID
          </button>
          <button
            className="btn"
            onClick={() => toggleInputComponent("roomName")}
          >
            Lookup by room name
          </button>
        </div>
      </div>

      {!hideCodeInput ? (
        <RoomCodeInputForm
          user={user}
          hideErrAlert={hideErrAlert}
          setHideCodeInput={setHideCodeInput}
          setHideErrAlert={setHideErrAlert}
          setHideConfirmAlert={setHideConfirmAlert}
        />
      ) : null}

      {!hideRoomNameInput ? (
        <RoomNameInputForm
          user={user}
          hideErrAlert={hideErrAlert}
          setHideErrAlert={setHideErrAlert}
          setHideConfirmAlert={setHideConfirmAlert}
          setHideRoomNameInput={setHideRoomNameInput}
        />
      ) : null}

      <RoomErrorAlert hideErrAlert={hideErrAlert} />
      <RoomConfirmAlert hideConfirmAlert={hideConfirmAlert} />
    </>
  );
}

function RoomNameInputForm({
  user,
  hideErrAlert,
  setHideErrAlert,
  setHideConfirmAlert,
  setHideRoomNameInput,
}) {
  const [roomNameInput, setRoomNameInput] = useState("");
  const [roomNameSearchResults, setRoomNameSearchResults] = useState([]);

  function lookupRoomWithName(e) {
    e.preventDefault();
    setRoomNameSearchResults([]);

    if (roomNameInput.length === 0) {
      roomAlertERR(3000, setHideErrAlert);
      return;
    }
    const searchRoomName = roomNameInput.toLowerCase().split(" ").join("");

    firebase
      .firestore()
      .collection("chatRooms")
      .where("searchName", ">=", searchRoomName)
      .where("searchName", "<=", searchRoomName + "\uf8ff")
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length === 0) {
          roomAlertERR(3000, setHideErrAlert);
        }
        querySnapshot.forEach((doc) => {
          var docObj = doc.data();
          docObj.id = doc.id;
          setRoomNameSearchResults((prev) => {
            return [...prev, docObj];
          });
        });
      })
      .catch((error) => console.log(error));
  }

  const foundResetFunction = () => {
    // Used (in RoomResults) when adding a user to a room and response is OK.
    roomAlertOK(3000, setHideConfirmAlert);
    setRoomNameSearchResults([]);
    setHideRoomNameInput(true);
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <form
            onSubmit={lookupRoomWithName}
            className="needs-validation"
            noValidate
          >
            <div className="form-innerDiv">
              <label htmlFor="roomNameInput" className="card-title form-label">
                Enter the name of the room here:
              </label>

              <div
                style={{
                  display: "flex",
                }}
              >
                <input
                  type="text"
                  name="Room_name_input"
                  required
                  id="roomNameInput"
                  className={
                    !hideErrAlert ? "form-control is-invalid" : "form-control"
                  }
                  placeholder="Room name"
                  value={roomNameInput}
                  onChange={(e) => setRoomNameInput(e.target.value)}
                />

                <button type="submit" className="btn btn-sm">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {roomNameSearchResults &&
        roomNameSearchResults.map((result) => {
          return (
            <RoomResults
              user={user}
              result={result}
              key={result.id}
              setHideErrAlert={setHideErrAlert}
              foundResetFunction={foundResetFunction}
            />
          );
        })}
    </>
  );
}

function RoomResults({ user, result, setHideErrAlert, foundResetFunction }) {
  var createdAt = new firebase.firestore.Timestamp(
    result.createdAt.seconds,
    result.createdAt.nanoseconds
  );
  createdAt = createdAt.toDate().toLocaleDateString();

  return (
    <div className="card roomSearchCard" hidden={false}>
      <div className="card-body">
        <h5 className="card-title">{result.roomName}</h5>

        <h6 className="card-subtitle mb-2 text-muted">ID: {result.id}</h6>

        <p className="text-muted m-0">Created: {createdAt}</p>

        <p className="text-muted m-0">Users: {result.usersInRoom.length}</p>

        {result.lastMessageTime ? (
          <p className="text-muted m-0">
            Last message:{" "}
            <DateTimeDiff
              a={convertTimeFromFirebaseTimeStamp(result.lastMessageTime)}
              b={new Date()}
            />{" "}
          </p>
        ) : null}
      </div>

      <div className="card-body joinButton">
        <button
          className="btn"
          onClick={(e) =>
            addUserToRoomWithRoomID(
              e,
              result.id,
              user.uid,
              foundResetFunction,
              () => roomAlertERR(3000, setHideErrAlert)
            )
          }
        >
          Join this room
        </button>
      </div>
    </div>
  );
}

function RoomCodeInputForm({
  user,
  hideErrAlert,
  setHideCodeInput,
  setHideErrAlert,
  setHideConfirmAlert,
}) {
  const [codeInput, setCodeInput] = useState("");

  const okReset = () => {
    // Resets the form and alerts user on successful 'joining' into room.
    roomAlertOK(3000, setHideConfirmAlert);
    setCodeInput("");
    setHideCodeInput(true);
  };

  return (
    <div className="card">
      <div className="card-body">
        <form
          className="needs-validation"
          noValidate
          onSubmit={(e) =>
            addUserToRoomWithRoomID(e, codeInput, user.uid, okReset, () =>
              roomAlertERR(3000, setHideErrAlert)
            )
          }
        >
          <div className="form-innerDiv">
            <label htmlFor="codeInput" className="card-title form-label">
              Enter the room code here:
            </label>
            <div style={{ display: "flex" }}>
              <input
                type="text"
                name="Room_code_input"
                required
                id="codeInput"
                className={
                  !hideErrAlert ? "form-control is-invalid" : "form-control"
                }
                placeholder="Code"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
              />
              <button type="submit" className="btn btn-sm">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
