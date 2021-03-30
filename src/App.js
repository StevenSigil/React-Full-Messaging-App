import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import "./App.css";
import Login from "./components/Login";
import LoginStandard from "./components/LoginStandard";
import Register from "./components/Register";
import Welcome from "./components/Welcome";

import Main from "./components/Main";

import firebase from "firebase/app";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "./components/Header";
import ChatRoom from "./components/ChatRoom";
import NewRoom from "./components/NewRoom";

firebase.initializeApp();

const auth = firebase.auth();

export default function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) console.log(error);

  return (
    <BrowserRouter>
      <Header user={user} />

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

        

        <Route path="/welcome">
          <Welcome />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
