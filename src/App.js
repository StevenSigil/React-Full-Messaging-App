import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./App.css";
import Login from "./components/Login";
import LoginStandard from "./components/LoginStandard";
import Register from "./components/Register";
import Welcome from "./components/Welcome";

import Main from "./components/Main";

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/login-standard">
          <LoginStandard />
        </Route>

        <Route exact path="/main">
          {/* {user ? <Main /> : <Redirect to="/login" />} */}
          <Main />
        </Route>

        <Route exact path="/logout" component={null} />
        <Route exact path="/new-room" component={null} />
        <Route exact path="/chatroom" component={null} />

        <Route path="/">
          <Welcome />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
