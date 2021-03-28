import React from "react";
import Header from "./Header";

export default function Main(props) {
  return (
    <div className="container noPadding">
      <Header />

      <div className="mainBackground">
        <h1>You made it to Main!</h1>
      </div>
    </div>
  );
}
