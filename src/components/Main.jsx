import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/firestore";

import { useCollectionData } from "react-firebase-hooks/firestore";

import UpdateDisplayName from "./subComponents/UpdateDisplayName";
import JoinOtherRoom from "./subComponents/JoinOtherRoom";
import {
  DateTimeDiff,
  convertTimeFromFirebaseTimeStamp,
} from "./subComponents/Util";

export default function Main({ user }) {
  const history = useHistory();

  const firestore = firebase.firestore();
  const roomRef = firestore.collection("chatRooms");
  const roomQuery = roomRef.where("usersInRoom", "array-contains", user.uid);
  const [rooms, loading] = useCollectionData(roomQuery, { idField: "id" });

  const [hideUpdateNameModal, setHideUpdateNameModal] = useState(true);

  useEffect(() => {
    if (user) {
      if (!user.displayName) setHideUpdateNameModal(false);
    }
  }, [user, setHideUpdateNameModal]);

  return user ? (
    <div className="container noPadding">
      <section className="mainBackground main">
        <div className="main-head">
          <h1>Your chatroom's</h1>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
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

            <button
              onClick={() => history.push("new-room")}
              className="btn mt-2"
            >
              Create a new chatroom
            </button>

            <JoinOtherRoom user={user} />
          </div>
        )}
      </section>

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

function SingleChatRoom({ room, roomRef, user, history }) {
  const now = new Date();

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
    <div className="card roomCard mt-2">
      <div className="row g-0">
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{room.roomName}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{room.id}</h6>

            {room.lastMessageTime ? (
              <p className="text-muted">
                Last message:{" "}
                <DateTimeDiff
                  a={convertTimeFromFirebaseTimeStamp(room.lastMessageTime)}
                  b={now}
                />
              </p>
            ) : null}
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
