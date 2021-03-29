import React, { useState } from "react";
import { useParams } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/firestore";
import { useCollectionData, useDocument } from "react-firebase-hooks/firestore";

export default function ChatRoom({ user }) {
  const { roomId } = useParams();
  const firestore = firebase.firestore();
  const curUserID = user.uid;

  const [room, loadingRoom, errRoom] = useDocument(
    firebase.firestore().doc(`chatRooms/${roomId}`)
  );

  if (room) {
    // Check to make sure the current user is allowed to be in the room...
    console.log(room.data().usersInRoom.some((user) => user === curUserID));
  }

  const messagesRef = firestore.collection(`chatRooms/${roomId}/messages`);
  const messageQuery = messagesRef.orderBy("createdAt");
  const [messages] = useCollectionData(messageQuery, {
    idField: "id",
  });

  if (loadingRoom) return <p>Loading...</p>;
  if (errRoom) console.log(errRoom);

  return (
    <div className="container noPadding messagesContainer">
      <section className="mainBackground">
        <div className="chat-head">
          <h1> {room.data().roomName} </h1>
        </div>

        <div className=''>
          {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
            {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
            {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
            {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        </div>
      </section>
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass =
    uid === firebase.auth().currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="" />
      <p> {text} </p>
    </div>
  );
}
