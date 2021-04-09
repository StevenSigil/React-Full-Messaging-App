import React from "react";

export function roomAlertERR(duration, setHideAlert) {
  // Trigger function for RoomErrorAlert
  setHideAlert(false);
  setTimeout(function () {
    setHideAlert(true);
  }, duration);
}

export function roomAlertOK(duration, setHideAlert) {
  // Trigger function for RoomConfirmAlert
  setHideAlert(false);
  setTimeout(function () {
    setHideAlert(true);
  }, duration);
}

export function RoomErrorAlert({ hideErrAlert }) {
  return (
    <div
      className="card customAlert"
      style={{ backgroundColor: "rgba(230, 71, 71, 0.9)" }}
      hidden={hideErrAlert}
    >
      <div className="card-body">
        <h5>Room not found</h5>
      </div>
    </div>
  );
}

export function RoomConfirmAlert({ hideConfirmAlert }) {
  return (
    <div
      className="card customAlert"
      style={{ backgroundColor: "#0b93f6de" }}
      hidden={hideConfirmAlert}
    >
      <div className="card-body">
        <h5>Room added!</h5>
      </div>
    </div>
  );
}
