import React from "react";

import "./App.css";

import Loading from "./components/subComponents/Loading";
import Login from "./components/Login";
import LoginStandard from "./components/LoginStandard";
import Register from "./components/Register";
import Welcome from "./components/Welcome";

import Main from "./components/Main";
import Header from "./components/Header";
import ChatRoom from "./components/ChatRoom";
import NewRoom from "./components/NewRoom";

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default function App() {
  const [user, loading] = useAuthState(firebase.auth());

  if (loading) {
    return (
      <BrowserRouter>
        <Header user={user} />
        <Loading />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Header user={user} />
      {loading ? (
        <Loading /> && console.log("Loading user...")
      ) : (
        <Switch>
          <Route exact path="/login">
            {!user ? <Login /> : <Redirect to="/main" />}
          </Route>
          <Route exact path="/register">
            {!user ? <Register /> : <Redirect to="/main" />}
          </Route>
          <Route exact path="/login-standard">
            {!user ? <LoginStandard /> : <Redirect to="/main" />}
          </Route>

          <Route exact path="/main">
            {user ? <Main user={user} /> : <Redirect to="/login" />}
          </Route>

          <Route exact path="/new-room">
            {user ? <NewRoom user={user} /> : <Redirect to="/login" />}
          </Route>

          <Route exact path="/chat/:roomId">
            {user ? <ChatRoom user={user} /> : <Redirect to="/login" />}
          </Route>

          <Route exact path="/welcome">
            <Welcome />
          </Route>

          <Route path="/">
            {user ? <Redirect to="/main" /> : <Redirect to="/welcome" />}
          </Route>
        </Switch>
      )}
    </BrowserRouter>
  );
}
