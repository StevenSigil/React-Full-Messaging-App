import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useCollectionData, useDocument } from "react-firebase-hooks/firestore";

export default function ChatRoom({ user }) {
  const curUserID = user.uid;
  const { roomId } = useParams();
  const scrollPosition = useRef(); // div to scroll to after submit
  const firestore = firebase.firestore();

  const roomRef = firebase.firestore().doc(`chatRooms/${roomId}`);
  const [room, loadingRoom, errRoom] = useDocument(roomRef);

  const messagesRef = firestore.collection(`chatRooms/${roomId}/messages`);
  const messageQuery = messagesRef.orderBy("createdAt").limit(25);
  const [messages] = useCollectionData(messageQuery, {
    idField: "id",
  });

  const [messageInput, setMessageInput] = useState("");

  if (room) {
    // Adds the user to the 'usersInRoom' field in collection.
    if (!room.data().usersInRoom.some((user) => user === curUserID)) {
      roomRef.update({
        usersInRoom: firebase.firestore.FieldValue.arrayUnion(curUserID),
      });
    }
  }

  if (errRoom) console.log(errRoom);

  useEffect(() => {
    if (!loadingRoom)
      scrollPosition.current.scrollIntoView({ behavior: "smooth" });
  }, [loadingRoom, roomRef]);

  async function sendMessage(e) {
    // Adds the message to the collection of messages and updates 'lastMessageTime' field.
    e.preventDefault();
    const { uid, photoURL } = firebase.auth().currentUser;

    if (messageInput !== "") {
      const createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await messagesRef.add({
        text: messageInput,
        createdAt,
        uid,
        photoURL,
      });
      await roomRef.update({ lastMessageTime: createdAt });
    }
    setMessageInput("");
  }

  return loadingRoom ? (
    <p>Loading...</p>
  ) : (
    <div className="container noPadding chat">
      <section className="mainBackground">
        <div className="messagesContainer">
          <div className="chatHead">
            <h1> {room.data().roomName} </h1>
            <code>{roomId}</code>
          </div>

          {messages &&
            messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} curUserID={curUserID} />
            ))}

          <div ref={scrollPosition}></div>
        </div>

        <form onSubmit={sendMessage} className="messageInputForm">
          <input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button type="submit" id="mainFormSubmit" className="btn btn-primary">
            Send
          </button>
        </form>
      </section>
    </div>
  );
}

function ChatMessage({ message, curUserID }) {
  const { text, uid, photoURL } = message;

  const messageClass = uid === curUserID ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt={photoURL} />
      <p> {text} </p>
    </div>
  );
}
