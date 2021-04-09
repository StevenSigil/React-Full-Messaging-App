import React, { useState } from "react";

export default function UpdateDisplayName({ user, hideModal, setHideModal }) {
  const [newName, setNewName] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);

  function handleChange(input) {
    setNewName(input);
    if (input.length > 1) {
      setBtnDisabled(false);
    }
  }

  function handleSubmit() {
    user
      .updateProfile({
        displayName: newName,
      })
      .then(() => {
        setHideModal(true);
        return user;
      })
      .catch((error) => console.log(error));
  }

  return (
    <>
      <div className="diyModal" hidden={hideModal}>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              Please update your display name to continue
            </h5>
            <input
              type="text"
              placeholder="Enter a new display name here"
              className="form-control"
              value={newName}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
          <div className="card-footer">
            <button
              disabled={btnDisabled}
              type="button"
              className="btn"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
