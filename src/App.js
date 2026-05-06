import React, { useState, useEffect } from "react";
import "./App.css";
import SetupPantry from "./pages/SetupPantry";
import Dashboard from "./pages/Dashboard";

function App() {
  const [activeTab, setActiveTab] = useState("login");

  const getPantryStorageKey = (user, selectedPantry) => {
    if (!user || !selectedPantry) return null;
    return `pantryItems_${user.email}_${selectedPantry.inviteCode}`;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [itemsLoaded, setItemsLoaded] = useState(false);

  const [pantries, setPantries] = useState(() => {
    const savedPantries = localStorage.getItem("pantries");
    return savedPantries ? JSON.parse(savedPantries) : [];
  });

  const [pantry, setPantry] = useState(() => {
    const savedPantry = localStorage.getItem("pantry");
    return savedPantry ? JSON.parse(savedPantry) : null;
  });

  const [items, setItems] = useState([]);

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost/pantrypal-backend/items.php")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.log(err));
  }, []);
ß
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("pantries", JSON.stringify(pantries));
  }, [pantries]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    if (pantry) {
      localStorage.setItem("pantry", JSON.stringify(pantry));
    }
  }, [pantry]);

  useEffect(() => {
    localStorage.removeItem("fridgeItems");
    localStorage.removeItem("freezerItems");
    localStorage.removeItem("pantryItems");
  }, []);

  useEffect(() => {
    if (!currentUser || !pantry) {
      setItemsLoaded(false);
      return;
    }

    setItemsLoaded(false);

    const storageKey = getPantryStorageKey(currentUser, pantry);
    const savedItems = localStorage.getItem(storageKey);

    setItems(savedItems ? JSON.parse(savedItems) : []);
    setItemsLoaded(true);
  }, [currentUser?.email, pantry?.inviteCode]);

  useEffect(() => {
    if (!currentUser || !pantry || !itemsLoaded) return;

    const storageKey = getPantryStorageKey(currentUser, pantry);
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, currentUser?.email, pantry?.inviteCode, itemsLoaded]);

  const handlePantryComplete = (newPantry) => {
    const pantryWithCode = {
      ...newPantry,
      id: newPantry.id || Date.now(),
      inviteCode:
        newPantry.inviteCode ||
        Math.random().toString(36).substring(2, 10).toUpperCase(),
    };

    const updatedPantries = [...pantries, pantryWithCode];

    setItemsLoaded(false);
    setPantries(updatedPantries);
    setPantry(pantryWithCode);
    setItems([]);
    setItemsLoaded(true);

    localStorage.setItem("pantries", JSON.stringify(updatedPantries));
    localStorage.setItem("pantry", JSON.stringify(pantryWithCode));

    if (currentUser) {
      const updatedCurrentUser = {
        ...currentUser,
        pantries: updatedPantries,
      };

      const updatedUsers = users.map((user) =>
        user.email === currentUser.email ? updatedCurrentUser : user
      );

      setUsers(updatedUsers);
      setCurrentUser(updatedCurrentUser);

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
    }
  };

  const handleSignup = () => {
    if (!signupName || !signupEmail || !signupPassword) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    const accountExists = users.find((user) => user.email === signupEmail);

    if (accountExists) {
      setErrorMessage("An account with this email already exists.");
      return;
    }

    const newUser = {
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      memberSince: new Date().toLocaleDateString(),
      pantries: [],
    };

    const updatedUsers = [...users, newUser];

    setUsers(updatedUsers);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setPantry(null);
    setPantries([]);
    setItems([]);
    setItemsLoaded(false);
    setErrorMessage("");

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.removeItem("pantry");
    localStorage.removeItem("pantries");
  };

  const handleLogin = () => {
    const foundUser = users.find(
      (user) => user.email === loginEmail && user.password === loginPassword
    );

    if (!foundUser) {
      setErrorMessage("No account found with that email and password.");
      return;
    }

    const userPantries = foundUser.pantries || [];

    setCurrentUser(foundUser);
    setIsLoggedIn(true);
    setPantries(userPantries);
    setErrorMessage("");

    if (userPantries.length === 1) {
      setPantry(userPantries[0]);
      localStorage.setItem("pantry", JSON.stringify(userPantries[0]));
    } else {
      setPantry(null);
      setItems([]);
      setItemsLoaded(false);
      localStorage.removeItem("pantry");
    }

    localStorage.setItem("pantries", JSON.stringify(userPantries));
    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleSelectPantry = (selectedPantry) => {
    setItemsLoaded(false);
    setPantry(selectedPantry);
    localStorage.setItem("pantry", JSON.stringify(selectedPantry));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPantry(null);
    setPantries([]);
    setItems([]);
    setItemsLoaded(false);
    setActiveTab("login");
    setLoginEmail("");
    setLoginPassword("");
    setErrorMessage("");

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("pantry");
    localStorage.removeItem("pantries");
    localStorage.removeItem("activePage");
  };

  if (isLoggedIn && !pantry && pantries.length > 1) {
    return (
      <div className="app">
        <div className="login-card pantry-picker-card">
          <div className="logo-circle">
            <img src="/logo.png" alt="" className="login-logo-img" />
          </div>

          <h1 className="title">Choose Your Pantry</h1>
          <p className="subtitle">Select which pantry you want to manage.</p>

          <div className="form-section">
            {pantries.map((p, index) => (
              <button
                key={p.inviteCode || index}
                className="login-btn"
                onClick={() => handleSelectPantry(p)}
              >
                {p.name} →
              </button>
            ))}
          </div>

          <button className="create-account-btn" onClick={handleLogout}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoggedIn && !pantry && pantries.length === 0) {
    return <SetupPantry onComplete={handlePantryComplete} />;
  }

  if (isLoggedIn && pantry) {
    return (
      <Dashboard
        pantry={pantry}
        pantries={pantries}
        setPantries={setPantries}
        setPantry={handleSelectPantry}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        users={users}
        setUsers={setUsers}
        userName={currentUser?.name}
        onLogout={handleLogout}
        items={items}
        setItems={setItems}
      />
    );
  }

  return (
    <div className="app">
      <div className="login-card">
        <div className="logo-circle">
          <img src="/logo.png" alt="" className="login-logo-img" />
        </div>

        <h1 className="title">PantryPal</h1>
        <p className="subtitle">Welcome to your smarter kitchen.</p>

        <div className="tab-container">
          <button
            className={activeTab === "login" ? "active-tab" : "tab"}
            onClick={() => {
              setActiveTab("login");
              setErrorMessage("");
            }}
          >
            Login
          </button>

          <button
            className={activeTab === "signup" ? "active-tab" : "tab"}
            onClick={() => {
              setActiveTab("signup");
              setErrorMessage("");
            }}
          >
            Sign Up
          </button>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {activeTab === "login" ? (
          <div className="form-section">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <div className="password-row">
              <label>Password</label>
              <button className="forgot-btn">Forgot Password?</button>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <button className="login-btn" onClick={handleLogin}>
              Login →
            </button>
          </div>
        ) : (
          <div className="form-section">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />

            <button className="login-btn" onClick={handleSignup}>
              Create Account →
            </button>

            <p className="signup-text">Already have an account?</p>

            <button
              className="create-account-btn"
              onClick={() => {
                setActiveTab("login");
                setErrorMessage("");
              }}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;