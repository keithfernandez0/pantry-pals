import React, { useEffect, useMemo, useState } from "react";

function UsageHistory() {
  const [locationFilter, setLocationFilter] = useState("All Locations");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const pantry = JSON.parse(localStorage.getItem("pantry"));

  const pantryId = pantry?.inviteCode || pantry?.id || "default";
  const userEmail = currentUser?.email || "guest";

  const usageStorageKey = `usageHistory_${userEmail}_${pantryId}`;

  const [usageHistory, setUsageHistory] = useState(() => {
    return JSON.parse(localStorage.getItem(usageStorageKey)) || [];
  });

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem(usageStorageKey)) || [];

    setUsageHistory(savedHistory);
  }, [usageStorageKey]);

  const getCategoryIcon = (category = "") => {
    if (category.includes("Dairy")) return "🥛";
    if (category.includes("Produce")) return "🥬";
    if (category.includes("Meat")) return "🍗";
    if (category.includes("Seafood")) return "🐟";
    if (category.includes("Grain")) return "🥣";
    if (category.includes("Bakery")) return "🍞";
    if (category.includes("Snack")) return "🍪";
    if (category.includes("Beverage")) return "☕";
    if (category.includes("Household")) return "🧻";
    return "🍽️";
  };

  const getLocationIcon = (location = "") => {
    if (location === "Fridge") return "▣";
    if (location === "Freezer") return "❄️";
    return "▤";
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleDelete = (id) => {
    const updatedHistory = usageHistory.filter((event) => event.id !== id);

    setUsageHistory(updatedHistory);
    localStorage.setItem(usageStorageKey, JSON.stringify(updatedHistory));
  };

  const handleClearUsage = () => {
    if (!window.confirm("Clear all usage history?")) return;

    setUsageHistory([]);
    localStorage.setItem(usageStorageKey, JSON.stringify([]));
  };

  const filteredHistory = useMemo(() => {
    return usageHistory
      .filter((event) => {
        if (locationFilter === "All Locations") return true;
        return event.location === locationFilter;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [usageHistory, locationFilter]);

  return (
    <div className="usage-page">
      <div className="usage-header">
        <div className="usage-main-icon">⏱</div>

        <div>
          <h1>Usage History</h1>
          <p>See items you’ve used and removed from your pantry.</p>
        </div>
      </div>

      <div className="usage-controls">
        <div className="usage-date-box">📅 Recent Activity</div>

        <div className="usage-right-controls">
          <button className="clear-usage-btn" onClick={handleClearUsage}>
            Clear Usage
          </button>

          <select
            className="usage-filter"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option>All Locations</option>
            <option>Fridge</option>
            <option>Freezer</option>
            <option>Pantry</option>
          </select>
        </div>
      </div>

      <div className="usage-table-card">
        <div className="usage-table-header">
          <span>Date & Time ↓</span>
          <span>Item</span>
          <span>Location</span>
          <span>Quantity Used</span>
          <span>Notes</span>
          <span>Action</span>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="usage-empty">No usage history yet.</div>
        ) : (
          filteredHistory.map((event) => (
            <div className="usage-row" key={event.id}>
              <div>
                <strong>{formatDate(event.date)}</strong>
                <p>{formatTime(event.date)}</p>
              </div>

              <div className="usage-item">
                <span className="usage-category-icon">
                  {getCategoryIcon(event.category)}
                </span>

                <div>
                  <h3>
                    {event.brand
                      ? `${event.brand} ${event.name || event.itemName}`
                      : event.name || event.itemName}
                  </h3>
                  <p>{event.category || "—"}</p>
                </div>
              </div>

              <div className="location-cell">
                <span className="location-icon">
                  {getLocationIcon(event.location)}
                </span>
                <span>{event.location || "—"}</span>
              </div>

              <div>
                {event.quantityUsed || event.quantity || "—"} {event.unit || ""}
              </div>

              <div>{event.usageNote || event.usedFor || event.note || event.notes || "—"}</div>

              <div>
                <button
                  className="remove-btn"
                  onClick={() => handleDelete(event.id)}
                >
                  🗑 Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="usage-footer">
        Showing {filteredHistory.length} usage event
        {filteredHistory.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export default UsageHistory;