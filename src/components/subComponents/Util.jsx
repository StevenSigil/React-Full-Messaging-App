import firebase from "firebase/app";
import "firebase/firestore";

import smLogo from "../../public/static/media/favicon-196x196.png";

export function DateTimeDiff({ a, b }) {
  // a and b are Date obj.'s
  const diffMs = Math.abs(b - a);
  const diffM = Math.floor(diffMs / 1000 / 60);
  const diffHr = Math.floor(diffM / 60);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHr > 0 && diffDays < 1) {
    return `over ${diffHr} hour${diffHr !== 1 ? "s" : ""} ago.`;
  }
  if (diffDays > 0) {
    return `over ${diffDays} day${diffDays !== 1 ? "s" : ""} ago.`;
  }
  return `${diffM} minute${diffM !== 1 ? "s" : ""} ago.`;
}

export function addUserToRoomWithRoomID(
  e,
  roomID,
  user,
  okResetFunc,
  badResReset
) {
  // Adds a user's ID to a list of users given a room ID.

  e.preventDefault();

  if (roomID.length === 0) {
    badResReset();
    return;
  }
  const addingRoom = firebase.firestore().collection("chatRooms").doc(roomID);

  // check if room exists, if true, add the user to the room
  addingRoom
    .get()
    .then((doc) => {
      if (doc.exists) {
        addingRoom.update({
          usersInRoom: firebase.firestore.FieldValue.arrayUnion(user.uid),
        });
        okResetFunc();

        sendMessageFromAdmin(
          addingRoom,
          `User ${user.displayName} has joined the chat!`
        );
      } else {
        console.log("error retrieving the specified room.");
        badResReset();
      }
    })
    .catch((error) => console.log(error));
}

export function convertTimeFromFirebaseTimeStamp(rawTime) {
  var lastMessageDt = new firebase.firestore.Timestamp(
    rawTime.seconds,
    rawTime.nanoseconds
  ).toDate();

  return lastMessageDt;
}

export function sendMessageFromAdmin(roomDocument, message) {
  // With a valid roomDocument => firebase.firestore.collection().doc()...
  // adds an automated message to the chatroom from the 'admin'
  const createdAt = firebase.firestore.FieldValue.serverTimestamp();

  roomDocument
    .collection("messages")
    .add({
      text: message,
      createdAt,
      photoURL: smLogo,
    })
    .then(() => roomDocument.update({ lastMessageTime: createdAt }))
    .catch((err) => console.log(err));
}
