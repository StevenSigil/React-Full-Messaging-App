# React Messenger 
## A messaging application based on react hooks and firebase via [react-firebase-hooks](https://github.com/CSFrequency/react-firebase-hooks).

![React messenger META](readme_assets/META.png?raw=true)

---
### Summary
A Progressive Web App (PWA) that allows two or more users to send and receive messages in 'chat rooms' which the user sets up as they wish. Using the [*react-firebase-hooks*](https://github.com/CSFrequency/react-firebase-hooks) package, the chatroom's are updated with messages and changes in realtime due to the Stateful nature of 'listening' for data.  

View and install the application at https://react-full-messaging-app.vercel.app/.

---

### Purpose of project:
- Learn to use Firebase features, including:
  - Basic and OAuth Authentication 
  - CRUD operations with FireStore
  - FireStore *Nested* Collections
- Utilize React Hooks/State to update content (messages) a user will interact with.
- Complete entire PWA procedure and ensure an install ready, mobile, version is produced.

---

### Screenshots
- A mixture of mobile and web to demonstrate

![RM-Sign in page - mobile](readme_assets/screenshots/signin-mobile.png?raw=true)
<figcaption><strong>Sign in screen - Basic authentication & OAuth enabled.</strong></figcaption>

---

![RM-Main page - mobile](readme_assets/screenshots/main-mobile.png?raw=true)
<figcaption><strong>Main screen after logging in - Displays your chatroom's and allows you to create or find a new one.</strong></figcaption>

---

![RM-Main - searching for a new room with a name](readme_assets/screenshots/main_search-desktop.png?raw=true)
<figcaption><strong>Main screen - searching for a room by [room] name.</strong></figcaption>
To make this work, when a user sends a query string to firebase, it uses the following as the params to return based on a mostly hidden field that mostly matches the formatting of `searchRoomName` on room creation.

```js
// src/components/subComponents/JoinOtherRoom.jsx

const searchRoomName = roomNameInput.toLowerCase().split(" ").join("");

    firebase
      .firestore()
      .collection("chatRooms")
      .where("searchName", ">=", searchRoomName)
      .where("searchName", "<=", searchRoomName + "\uf8ff")
      .get()
      .then...
```

---

![RM-Chatroom](readme_assets/screenshots/chatroom-mobile.png?raw=true)
<figcaption><strong>Chatroom for the application.  Room name is in the background, automated message is sent on user joining/removing a room, and uses hooks to make the messages *stateful*.</strong></figcaption>

---
---
In case anyone is interested...

### Wire Frames 
- Designed as a *Mobile First* application.

![React Messaging - Wire frames](readme_assets/wireframe/Messaging%20App%20Wireframe.png?raw=true)
<figcaption><strong>Made from mobile proportions, then dynamically adapted for desktop users.  <small>Created with adobeXD</small></strong></figcaption>

---
---
<br />

View and install the application at https://react-full-messaging-app.vercel.app/.
