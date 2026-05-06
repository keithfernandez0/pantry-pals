import { useState } from "react";

function SetupPantry({ onComplete }) {
  const [activeTab, setActiveTab] = useState("create");
  const [pantryName, setPantryName] = useState("");
  const [pantryType, setPantryType] = useState("personal");
  const [inviteCode, setInviteCode] = useState("");

  function handleCreatePantry(e) {
    e.preventDefault();

    const newPantry = {
      name: pantryName || "My Pantry",
      type: pantryType,
      members: 1,
    };

    onComplete(newPantry);
  }

  function handleJoinPantry(e) {
    e.preventDefault();

    const joinedPantry = {
      name: "Shared Pantry",
      type: "group",
      members: 2,
      inviteCode,
    };

    onComplete(joinedPantry);
  }

  return (
    <div className="app">
      <div className="logo-circle">🍴</div>

      <h1 className="title">Welcome to Pantry Pal</h1>
      <p className="subtitle">Let's set up your first pantry</p>

      <div className="tab-container">
        <button
          className={activeTab === "create" ? "active-tab" : "tab"}
          onClick={() => setActiveTab("create")}
        >
          Create Pantry
        </button>

        <button
          className={activeTab === "join" ? "active-tab" : "tab"}
          onClick={() => setActiveTab("join")}
        >
          Join Pantry
        </button>
      </div>

      <div className="card">
        {activeTab === "create" ? (
          <form onSubmit={handleCreatePantry}>
            <h2>Create a New Pantry</h2>
            <p className="card-subtitle">
              Set up your own pantry to track your kitchen inventory
            </p>

            <label>Pantry Name</label>
            <input
              type="text"
              placeholder="e.g., My Kitchen, Smith Family Pantry"
              value={pantryName}
              onChange={(e) => setPantryName(e.target.value)}
            />

            <label>Pantry Type</label>

            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="pantryType"
                  checked={pantryType === "personal"}
                  onChange={() => setPantryType("personal")}
                />
                <div>
                  <strong>Personal</strong>
                  <p>Just for you</p>
                </div>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="pantryType"
                  checked={pantryType === "group"}
                  onChange={() => setPantryType("group")}
                />
                <div>
                  <strong>Group</strong>
                  <p>Share with family or roommates</p>
                </div>
              </label>
            </div>

            <button className="login-btn" type="submit">
              + Create Pantry
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoinPantry}>
            <h2>Join an Existing Pantry</h2>
            <p className="card-subtitle">
              Enter the invite code shared by a pantry owner
            </p>

            <label>Invite Code</label>
            <input
              type="text"
              placeholder="e.g., ABC123XY"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />

            <p className="helper-text">
              Ask the pantry owner for their invite code
            </p>

            <button className="login-btn" type="submit">
              Join Pantry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SetupPantry;