import React, { useState } from "react";

function Account({
  pantry,
  pantries = [],
  setPantries,
  setPantry,
  currentUser,
  setCurrentUser,
  users,
  setUsers,
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPantryForm, setShowPantryForm] = useState(false);
  const [pantryMode, setPantryMode] = useState("create");
  const [newPantryName, setNewPantryName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const inviteCode = pantry?.inviteCode || "T28BAG4S";

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(inviteCode);
    alert("Invite code copied!");
  };

  const updateUserPantries = (updatedPantries, selectedPantry = pantry) => {
    const updatedCurrentUser = {
      ...currentUser,
      pantries: updatedPantries,
    };

    const updatedUsers = users.map((user) =>
      user.email === currentUser.email ? updatedCurrentUser : user
    );

    setPantries(updatedPantries);
    setPantry(selectedPantry);
    setCurrentUser(updatedCurrentUser);
    setUsers(updatedUsers);

    localStorage.setItem("pantries", JSON.stringify(updatedPantries));
    localStorage.setItem("pantry", JSON.stringify(selectedPantry));
    localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleCreatePantry = () => {
    if (!newPantryName.trim()) {
      alert("Please enter a pantry name.");
      return;
    }

    const newPantry = {
      id: Date.now(),
      name: newPantryName,
      type: "Personal",
      members: 1,
      inviteCode: Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase(),
    };

    const updatedPantries = [...pantries, newPantry];

    updateUserPantries(updatedPantries, pantry);

    alert(`Pantry "${newPantryName}" created!`);

    setNewPantryName("");
    setShowPantryForm(false);
  };

  const handleJoinPantry = () => {
    if (!joinCode.trim()) {
      alert("Please enter an invite code.");
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];

    let foundPantry = null;

    allUsers.forEach((user) => {
      (user.pantries || []).forEach((p) => {
        if (p.inviteCode === joinCode.toUpperCase()) {
          foundPantry = p;
        }
      });
    });

    if (!foundPantry) {
      alert("No pantry found with that invite code.");
      return;
    }

    const alreadyJoined = pantries.some(
      (p) => p.inviteCode === foundPantry.inviteCode
    );

    if (alreadyJoined) {
      alert("You already joined this pantry.");
      return;
    }

    const updatedPantries = [...pantries, foundPantry];

    updateUserPantries(updatedPantries, pantry);

    alert(`Joined pantry "${foundPantry.name}"!`);

    setJoinCode("");
    setShowPantryForm(false);
  };

  const handleSwitchPantry = (selectedPantry) => {
    setPantry(selectedPantry);
    localStorage.setItem("pantry", JSON.stringify(selectedPantry));
    alert(`Switched to ${selectedPantry.name}`);
  };

  return (
    <div className="inventory-page account-page compact-account-page">
      <button className="back-btn" onClick={() => window.history.back()}>
        ← Back
      </button>

      <div className="inventory-header compact-account-header">
        <div>
          <h1>Account Settings</h1>
          <p>Manage your profile and preferences</p>
        </div>
      </div>

      <div className="tab-container account-tabs compact-tabs">
        <button
          className={activeTab === "profile" ? "active-tab" : "tab"}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>

        <button
          className={activeTab === "pantries" ? "active-tab" : "tab"}
          onClick={() => setActiveTab("pantries")}
        >
          Pantries
        </button>

        <button
          className={activeTab === "preferences" ? "active-tab" : "tab"}
          onClick={() => setActiveTab("preferences")}
        >
          Preferences
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="account-card compact-account-card no-scroll-card">
          <h2>Profile Information</h2>
          <p className="card-subtitle">Your personal account details</p>

          <label>Name</label>
          <input value={currentUser?.name || ""} readOnly />

          <label>Email</label>
          <input value={currentUser?.email || ""} readOnly />

          <label>Member Since</label>
          <input value={currentUser?.memberSince || ""} readOnly />
        </div>
      )}

      {activeTab === "pantries" && (
        <div className="account-compact-grid">
          <div className="account-card compact-account-card no-scroll-card">
            <h2>Current Pantry</h2>
            <p className="card-subtitle">The pantry you're currently managing</p>

            <div className="pantry-details-row compact-pantry-row">
              <div>
                <h3>{pantry?.name || "My Pantry"}</h3>
                <p>{pantry?.type || "Personal"} Pantry</p>
              </div>

              <span className="members-badge">
                {pantry?.members || 1} member(s)
              </span>
            </div>

            <label>Invite Code</label>

            <div className="invite-row">
              <input type="text" value={inviteCode} readOnly />
              <button className="copy-btn" onClick={handleCopyCode}>
                Copy
              </button>
            </div>

            <p className="helper-text">Share this code to invite others</p>

            <h3>All Pantries</h3>

            {(pantries || []).map((p) => (
              <button
                key={p.inviteCode}
                className="outline-btn pantry-switch-btn"
                onClick={() => handleSwitchPantry(p)}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="account-card compact-account-card no-scroll-card">
            <h2>Create or Join Pantry</h2>

            {!showPantryForm ? (
              <button
                className="outline-btn"
                onClick={() => setShowPantryForm(true)}
              >
                Create or Join Pantry
              </button>
            ) : (
              <div className="pantry-form-box">
                <div className="pantry-mode-buttons">
                  <button
                    className={pantryMode === "create" ? "active-mode" : ""}
                    onClick={() => setPantryMode("create")}
                  >
                    Create
                  </button>

                  <button
                    className={pantryMode === "join" ? "active-mode" : ""}
                    onClick={() => setPantryMode("join")}
                  >
                    Join
                  </button>
                </div>

                {pantryMode === "create" ? (
                  <>
                    <label>Pantry Name</label>
                    <input
                      value={newPantryName}
                      onChange={(e) => setNewPantryName(e.target.value)}
                      placeholder="Enter pantry name"
                    />

                    <button className="outline-btn" onClick={handleCreatePantry}>
                      Create Pantry
                    </button>
                  </>
                ) : (
                  <>
                    <label>Invite Code</label>
                    <input
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder="Enter invite code"
                    />

                    <button className="outline-btn" onClick={handleJoinPantry}>
                      Join Pantry
                    </button>
                  </>
                )}

                <button
                  className="cancel-pantry-btn"
                  onClick={() => setShowPantryForm(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "preferences" && (
        <div className="account-card compact-account-card no-scroll-card">
          <h2>App Preferences</h2>

          <div className="preference-row">
            <div>
              <h3>Dark Mode</h3>
              <p>Switch between light and dark themes</p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                onChange={() => alert("Dark mode coming soon")}
              />
              <span></span>
            </label>
          </div>

          <hr />

          <div className="preference-row">
            <div>
              <h3>Notifications</h3>
              <p>Receive alerts about expiring items</p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                defaultChecked
                onChange={() => alert("Notifications coming soon")}
              />
              <span></span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;