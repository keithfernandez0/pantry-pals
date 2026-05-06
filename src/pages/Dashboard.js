import React, { useMemo, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Fridge from "./Fridge";
import Freezer from "./Freezer";
import Pantry from "./Pantry";
import ExpiringSoon from "./ExpiringSoon";
import OutOfStock from "./OutOfStock";
import ShoppingLists from "./ShoppingLists";
import Recipes from "./Recipes";
import UsageHistory from "./UsageHistory";
import Account from "./Account";
import AddItemModal from "./AddItemModal";

function Dashboard({
  pantry,
  pantries,
  setPantries,
  setPantry,
  currentUser,
  setCurrentUser,
  users,
  setUsers,
  userName,
  onLogout,
  items,
  setItems,
}) {
  const [addItemSection, setAddItemSection] = useState(null);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <SidebarContent
          pantry={pantry}
          pantries={pantries}
          setPantry={setPantry}
          currentUser={currentUser}
          userName={userName}
          onLogout={onLogout}
          items={items}
          setItems={setItems}
        />
      </aside>

      <main className="dashboard-main">
        <Routes>
          <Route
            path="/"
            element={
              <DashboardHome
                userName={userName}
                setAddItemSection={setAddItemSection}
                items={items}
                currentUser={currentUser}
                pantry={pantry}
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              <DashboardHome
                userName={userName}
                setAddItemSection={setAddItemSection}
                items={items}
                currentUser={currentUser}
                pantry={pantry}
              />
            }
          />

          <Route
            path="/fridge"
            element={
              <Fridge
                items={items}
                setItems={setItems}
                setAddItemSection={setAddItemSection}
              />
            }
          />

          <Route
            path="/freezer"
            element={
              <Freezer
                items={items}
                setItems={setItems}
                setAddItemSection={setAddItemSection}
              />
            }
          />

          <Route
            path="/pantry"
            element={
              <Pantry
                items={items}
                setItems={setItems}
                setAddItemSection={setAddItemSection}
              />
            }
          />

          <Route
            path="/expiring"
            element={<ExpiringSoon items={items} setItems={setItems} />}
          />

          <Route
            path="/outofstock"
            element={<OutOfStock items={items} setItems={setItems} />}
          />

          <Route
            path="/shopping"
            element={
              <ShoppingLists currentUser={currentUser} pantry={pantry} />
            }
          />
          <Route path="/recipes" element={<Recipes items={items} />} />
          <Route path="/usage" element={<UsageHistory />} />

          <Route
            path="/account"
            element={
              <Account
                pantry={pantry}
                pantries={pantries}
                setPantries={setPantries}
                setPantry={setPantry}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                users={users}
                setUsers={setUsers}
              />
            }
          />
        </Routes>
      </main>

      {addItemSection && (
        <AddItemModal
          section={addItemSection}
          items={items}
          setItems={setItems}
          onClose={() => setAddItemSection(null)}
        />
      )}
    </div>
  );
}

function DashboardHome({
  userName,
  setAddItemSection,
  items = [],
  currentUser,
  pantry,
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const pantryId = pantry?.inviteCode || pantry?.id || "default";
  const userEmail = currentUser?.email || "guest";

  const shoppingLists =
    JSON.parse(localStorage.getItem(`shoppingLists_${userEmail}_${pantryId}`)) ||
    JSON.parse(localStorage.getItem("shoppingLists")) ||
    [];

  const fridgeItems = items.filter((item) => item.location === "Fridge");
  const freezerItems = items.filter((item) => item.location === "Freezer");
  const pantryItems = items.filter((item) => item.location === "Pantry");

  const totalItems = items.length;
  const outOfStock = items.filter((item) => Number(item.quantity) <= 0);

  const kitchenScore =
    totalItems === 0 ? 0 : Math.min(100, Math.round((totalItems / 30) * 100));

  const kitchenMessage =
    totalItems === 0
      ? "Your kitchen is empty. Start by adding items to your fridge, freezer, or pantry."
      : kitchenScore < 35
      ? "Your kitchen is looking a little empty. Add more items to stay stocked."
      : kitchenScore < 70
      ? "Your kitchen is getting stocked. Keep adding items as you shop."
      : "Your kitchen is looking great! Keep it up.";

  const shoppingTotal = shoppingLists.reduce(
    (total, list) => total + (list.items?.length || 0),
    0
  );

  const today = new Date();

  const expiringSoon = items.filter((item) => {
    if (!item.expirationDate) return false;

    const expDate = new Date(item.expirationDate);
    const diffTime = expDate - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= 14;
  });

  const categories = useMemo(() => {
    const count = {};

    items.forEach((item) => {
      const category = item.category || "Other";
      count[category] = (count[category] || 0) + 1;
    });

    return Object.entries(count).slice(0, 8);
  }, [items]);

  const firstName = userName ? userName.split(" ")[0] : "User";

  return (
    <div className="modern-dashboard">
      <div className="modern-dashboard-header">
        <div>
          <h1>Good morning, {firstName}! 👋</h1>
          <p>Here’s what’s happening in your kitchen today.</p>
        </div>

        <div className="dashboard-header-actions">
          <div className="dashboard-search-wrap">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search anything..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button onClick={() => setAddItemSection("pantry")}>
            + Add Item
          </button>
        </div>
      </div>

      <section className="dashboard-stats-grid">
        <StatCard
          icon="▱"
          title="Total Items"
          number={totalItems}
          subtitle="Across your kitchen"
          color="green"
        />

        <StatCard
          icon="▥"
          title="Out of Stock"
          number={outOfStock.length}
          subtitle="Items out of stock"
          action="View out of stock →"
          color="yellow"
          onClick={() => navigate("/outofstock")}
        />

        <StatCard
          icon="⏰"
          title="Expiring Soon"
          number={expiringSoon.length}
          subtitle="Within 14 days"
          action="View expiring →"
          color="red"
          onClick={() => navigate("/expiring")}
        />

        <StatCard
          icon="🛒"
          title="Shopping Lists"
          number={shoppingLists.length}
          small="Lists"
          subtitle={`${shoppingTotal} Items`}
          action="View lists →"
          color="green"
          onClick={() => navigate("/shopping")}
        />
      </section>

      <section className="dashboard-content-grid">
        <div className="dashboard-panel kitchen-overview-panel">
          <div className="panel-title">
            <h3>▣ Kitchen Overview</h3>
          </div>

          <p className="panel-text">{kitchenMessage}</p>

          <div className="pantry-score-number">{kitchenScore}%</div>

          <div className="pantry-progress">
            <div style={{ width: `${kitchenScore}%` }}></div>
          </div>
        </div>

        <div className="dashboard-panel category-panel">
          <div className="panel-title">
            <h3>◒ Inventory by Category</h3>
            <button onClick={() => navigate("/pantry")}>View all</button>
          </div>

          <div className="category-overview-grid">
            {categories.length === 0 ? (
              <p className="panel-text">No kitchen categories yet.</p>
            ) : (
              categories.map(([category, count]) => (
                <div className="category-overview-card" key={category}>
                  <span>{getCategoryIcon(category)}</span>
                  <strong>{category}</strong>
                  <p>{count} items</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-panel kitchen-panel">
          <div className="panel-title">
            <h3></h3>
            <button onClick={() => navigate("/pantry")}>View all</button>
          </div>

          <KitchenRow
            icon="🥫"
            title="Pantry"
            count={pantryItems.length}
            color="green"
            onClick={() => navigate("/pantry")}
          />

          <KitchenRow
            icon="🧊"
            title="Fridge"
            count={fridgeItems.length}
            color="blue"
            onClick={() => navigate("/fridge")}
          />

          <KitchenRow
            icon="❄️"
            title="Freezer"
            count={freezerItems.length}
            color="cyan"
            onClick={() => navigate("/freezer")}
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, title, number, small, subtitle, action, color, onClick }) {
  return (
    <div className="dashboard-stat-card" onClick={onClick}>
      <p>{title}</p>
      <div className={`stat-icon ${color}`}>{icon}</div>

      <div>
        <h2>
          {number} {small && <small>{small}</small>}
        </h2>
        <span>{subtitle}</span>
        {action && <button>{action}</button>}
      </div>
    </div>
  );
}

function KitchenRow({ icon, title, count, color, onClick }) {
  const width = Math.min(count * 6, 100);

  return (
    <div className="kitchen-row" onClick={onClick}>
      <div className={`kitchen-icon ${color}`}>{icon}</div>

      <div className="kitchen-info">
        <h4>{title}</h4>
        <p>{count} items</p>

        <div className="kitchen-progress">
          <div className={color} style={{ width: `${width}%` }}></div>
        </div>
      </div>
    </div>
  );
}

function getCategoryIcon(category = "") {
  if (category.includes("Dairy")) return "🥛";
  if (category.includes("Produce")) return "🥬";
  if (category.includes("Meat")) return "🍗";
  if (category.includes("Seafood")) return "🐟";
  if (category.includes("Bakery")) return "🍞";
  if (category.includes("Frozen")) return "❄️";
  if (category.includes("Snack")) return "🍪";
  if (category.includes("Beverage")) return "🥤";
  if (category.includes("Bake")) return "🥣";
  if (category.includes("Canned")) return "🥫";
  if (category.includes("Spice")) return "🌿";
  if (category.includes("Condiment")) return "🧂";
  if (category.includes("Dry") || category.includes("Pasta")) return "🍝";
  return "🌿";
}

function SidebarContent({
  pantry,
  pantries = [],
  setPantry,
  currentUser,
  userName,
  onLogout,
  items = [],
  setItems,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const pantryId = pantry?.inviteCode || pantry?.id || "default";
  const userEmail = currentUser?.email || "guest";

  const usageHistory =
    JSON.parse(localStorage.getItem(`usageHistory_${userEmail}_${pantryId}`)) ||
    JSON.parse(localStorage.getItem("usageHistory")) ||
    [];

  const recipes =
    JSON.parse(localStorage.getItem(`recipes_${userEmail}_${pantryId}`)) ||
    JSON.parse(localStorage.getItem("recipes")) ||
    [];

  const today = new Date();

  const expiringSoon = items.filter((item) => {
    if (!item.expirationDate) return false;

    const expDate = new Date(item.expirationDate);
    const diffDays = (expDate - today) / (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= 14;
  });

  const readyRecipes = recipes.filter((recipe) =>
    recipe.ingredients?.every((ingredient) =>
      items.some((item) =>
        item.name?.toLowerCase().includes(ingredient.toLowerCase())
      )
    )
  );

  const outOfStockItems = items.filter((item) => Number(item.quantity) <= 0);

  const showUsageBubble =
    usageHistory.length >
    Number(localStorage.getItem(`seenUsageCount_${userEmail}_${pantryId}`) || 0);

  const showExpiringBubble =
    expiringSoon.length >
    Number(localStorage.getItem(`seenExpiringCount_${userEmail}_${pantryId}`) || 0);

  const showRecipesBubble =
    readyRecipes.length >
    Number(
      localStorage.getItem(`seenReadyRecipesCount_${userEmail}_${pantryId}`) || 0
    );

  const showOutOfStockBubble =
    outOfStockItems.length >
    Number(
      localStorage.getItem(`seenOutOfStockCount_${userEmail}_${pantryId}`) || 0
    );

  const isActive = (path) => {
    if (path === "/dashboard") {
      return currentPath === "/" || currentPath === "/dashboard";
    }

    return currentPath === path;
  };

  const handleSwitchPantry = (inviteCode) => {
    const selectedPantry = pantries.find((p) => p.inviteCode === inviteCode);

    if (!selectedPantry) return;

    setPantry(selectedPantry);
    localStorage.setItem("pantry", JSON.stringify(selectedPantry));

    const storageKey = `pantryItems_${currentUser?.email}_${selectedPantry.inviteCode}`;
    const savedItems = localStorage.getItem(storageKey);

    setItems(savedItems ? JSON.parse(savedItems) : []);
  };

  return (
    <>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="" className="sidebar-logo-img" />
        </div>

        <div>
          <h2>PantryPal</h2>
          <p>{userName || "User"}</p>
        </div>
      </div>

      <div className="current-pantry-card">
        <p className="pantry-label">Current Pantry</p>

        <select
          className="pantry-switch-select"
          value={pantry?.inviteCode || ""}
          onChange={(e) => handleSwitchPantry(e.target.value)}
        >
          {pantries.map((p) => (
            <option key={p.inviteCode} value={p.inviteCode}>
              {p.name} — {p.type}
            </option>
          ))}
        </select>
      </div>

      <nav className="sidebar-nav">
        <button
          className={isActive("/dashboard") ? "nav-item active" : "nav-item"}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        <button
          className={isActive("/fridge") ? "nav-item active" : "nav-item"}
          onClick={() => navigate("/fridge")}
        >
          Fridge
        </button>

        <button
          className={isActive("/freezer") ? "nav-item active" : "nav-item"}
          onClick={() => navigate("/freezer")}
        >
          Freezer
        </button>

        <button
          className={isActive("/pantry") ? "nav-item active" : "nav-item"}
          onClick={() => navigate("/pantry")}
        >
          Pantry
        </button>

        <button
          className={isActive("/expiring") ? "nav-item active" : "nav-item"}
          onClick={() => {
            localStorage.setItem(
              `seenExpiringCount_${userEmail}_${pantryId}`,
              expiringSoon.length
            );
            navigate("/expiring");
          }}
        >
          Expiring Soon
          {showExpiringBubble && <span className="notification-bubble"></span>}
        </button>

        <button
          className={isActive("/outofstock") ? "nav-item active" : "nav-item"}
          onClick={() => {
            localStorage.setItem(
              `seenOutOfStockCount_${userEmail}_${pantryId}`,
              outOfStockItems.length
            );
            navigate("/outofstock");
          }}
        >
          Out of Stock
          {showOutOfStockBubble && (
            <span className="notification-bubble"></span>
          )}
        </button>

        <button
          className={isActive("/shopping") ? "nav-item active" : "nav-item"}
          onClick={() => navigate("/shopping")}
        >
          Shopping Lists
        </button>

        <button
          className={isActive("/recipes") ? "nav-item active" : "nav-item"}
          onClick={() => {
            localStorage.setItem(
              `seenReadyRecipesCount_${userEmail}_${pantryId}`,
              readyRecipes.length
            );
            navigate("/recipes");
          }}
        >
          Recipes
          {showRecipesBubble && <span className="notification-bubble"></span>}
        </button>

        <button
          className={isActive("/usage") ? "nav-item active" : "nav-item"}
          onClick={() => {
            localStorage.setItem(
              `seenUsageCount_${userEmail}_${pantryId}`,
              usageHistory.length
            );
            navigate("/usage");
          }}
        >
          Usage History
          {showUsageBubble && <span className="notification-bubble"></span>}
        </button>

        <button
          className={isActive("/account") ? "nav-item active" : "nav-item"}
          onClick={() => navigate("/account")}
        >
          Account
        </button>
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </>
  );
}

export default Dashboard;