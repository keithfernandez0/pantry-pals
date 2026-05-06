import React from "react";

function ExpiringSoon({ items = [], setItems }) {
  const today = new Date();

  const getDaysLeft = (expirationDate) => {
    const expDate = new Date(expirationDate);
    const diffTime = expDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getCategoryIcon = (category = "") => {
    if (category.includes("Dairy")) return "🥛";
    if (category.includes("Produce")) return "🥬";
    if (category.includes("Meat")) return "🥩";
    if (category.includes("Seafood")) return "🐟";
    if (category.includes("Bakery")) return "🍞";
    if (category.includes("Frozen")) return "❄️";
    if (category.includes("Snack")) return "🍪";
    if (category.includes("Beverage")) return "🥤";
    if (category.includes("Canned")) return "🥫";
    if (category.includes("Condiment")) return "🧂";
    if (category.includes("Grain") || category.includes("Pasta")) return "🍝";
    return "🍽️";
  };

  const expiringItems = items
    .filter((item) => item.expirationDate)
    .map((item) => ({
      ...item,
      daysLeft: getDaysLeft(item.expirationDate),
    }))
    .filter((item) => item.daysLeft >= 0 && item.daysLeft <= 14)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleEdit = () => {
    alert("Edit this item from its Fridge, Freezer, or Pantry page.");
  };

  return (
    <div className="expiring-page">
      <div className="expiring-header">
        <div className="expiring-icon"></div>

        <div>
          <h1>Expiring Soon</h1>
          <p>{expiringItems.length} items expiring within the next 14 days</p>
        </div>
      </div>

      <div className="expiring-table-card">
        <div className="expiring-table-header">
          <span>Item</span>
          <span>Location</span>
          <span>Quantity</span>
          <span>Expires On</span>
          <span>Days Left</span>
          <span>Action</span>
        </div>

        {expiringItems.length === 0 ? (
          <div className="expiring-empty">
            No items are expiring in the next 14 days.
          </div>
        ) : (
          expiringItems.map((item) => (
            <div className="expiring-row" key={item.id}>
              <div className="expiring-item-name">
                <span className="expiring-category-icon">
                  {getCategoryIcon(item.category)}
                </span>

                <div>
                  <h3>{item.brand ? `${item.brand} ${item.name}` : item.name}</h3>
                  <p>{item.category}</p>
                </div>
              </div>

              <div className="location-cell">
                <span
                  className={
                    item.location === "Fridge"
                      ? "location-icon fridge"
                      : item.location === "Freezer"
                      ? "location-icon freezer"
                      : "location-icon pantry"
                  }
                >
                  {item.location === "Fridge"
                    ? "▣"
                    : item.location === "Freezer"
                    ? "❄️"
                    : "▤"}
                </span>

                <span>{item.location}</span>
              </div>

              <div>
                {item.quantity} {item.unit}
              </div>

              <div>{item.expirationDate}</div>

              <div
                className={
                  item.daysLeft <= 2
                    ? "days-left danger"
                    : "days-left warning"
                }
              >
                {item.daysLeft === 0
                  ? "Today"
                  : `${item.daysLeft} day(s) left`}
              </div>

              <div className="expiring-actions">
                <button
                  className="icon-btn edit-btn"
                  onClick={handleEdit}
                >
                  ✎
                </button>

                <button
                  className="icon-btn delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ExpiringSoon;