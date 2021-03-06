import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useCollectionData, useDocument } from "react-firebase-hooks/firestore";
import Loading from "./subComponents/Loading";

export default function ChatRoom({ user }) {
  const curUserID = user.uid;
  const { roomId } = useParams();
  const scrollPosition = useRef(null);
  const firestore = firebase.firestore();

  const roomRef = firebase.firestore().doc(`chatRooms/${roomId}`);
  const [room] = useDocument(roomRef);

  const messagesRef = firestore.collection(`chatRooms/${roomId}/messages`);
  const messageQuery = messagesRef.orderBy("createdAt", "desc").limit(25);
  const [messages] = useCollectionData(messageQuery, {
    idField: "id",
  });

  const [messageInput, setMessageInput] = useState("");

  function checkToAddUser(room) {
    // Adds the user to the 'usersInRoom' field in collection.
    if (room && !room.data().usersInRoom.some((user) => user === curUserID)) {
      roomRef.update({
        usersInRoom: firebase.firestore.FieldValue.arrayUnion(curUserID),
      });
    }
  }

  if (room) {
    checkToAddUser(room);
  }

  useEffect(() => {
    if (scrollPosition.current) {
      scrollPosition.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function sendMessage(e) {
    // Adds the message to the collection of messages and updates 'lastMessageTime' field.
    e.preventDefault();
    const { uid, photoURL, displayName } = firebase.auth().currentUser;

    if (messageInput !== "") {
      const createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await messagesRef.add({
        text: messageInput,
        createdAt,
        uid,
        photoURL,
        displayName,
      });
      await roomRef.update({ lastMessageTime: createdAt });
    }
    setMessageInput("");
  }

  return room ? (
    <div className="noPadding chat">
      <section className="mainBackground container">
        <div className="chatHead">
          <h1> {room.data().roomName} </h1>
          {/* <code>{roomId}</code> */}
        </div>

        <div className="messagesContainer" id="messagesContainer">
          <div ref={scrollPosition} className="bottomScrollPosition"></div>
          {messages &&
            messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} user={user} />
            ))}
        </div>

        <form
          onSubmit={sendMessage}
          className="messageInputForm container"
          id="t1"
        >
          <input
            placeholder="Say something..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button type="submit" id="mainFormSubmit" className="btn">
            Send
          </button>
        </form>
      </section>
    </div>
  ) : (
    <Loading />
  );
}

function ChatMessage({ message, user }) {
  let { text, createdAt, uid, photoURL, displayName } = message;

  const [messageDate, setMessageDate] = useState(
    new Date().toLocaleDateString()
  );
  const [messageTime, setMessageTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    if (createdAt) {
      const messageDT = new firebase.firestore.Timestamp(
        createdAt.seconds,
        createdAt.nanoseconds
      ).toDate();
      setMessageDate(messageDT.toLocaleDateString());
      setMessageTime(messageDT.toLocaleTimeString());
    }
  }, [createdAt]);

  const messageClass = uid === user.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <div className="imgDate-div">
        {photoURL ? (
          <img src={photoURL} alt={photoURL} width="40px" height="40px" />
        ) : (
          <NoUserPhoto displayName={user.displayName} />
        )}

        <p> {text} </p>
      </div>

      <div className="subText">
        <small className="text">{displayName}</small>

        <small className="text">
          {messageDate.slice(0, -5) +
            " - " +
            messageTime.slice(0, -6) +
            messageTime.slice(-3)}
        </small>
      </div>
    </div>
  );
}

const NoUserPhoto = ({ displayName }) => {
  const letter = displayName[0].toUpperCase();

  return (
    <div className="testDiv">
      <h2>{letter}</h2>
    </div>
  );
};
