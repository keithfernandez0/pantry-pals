import React from "react";

function OutOfStock({ items = [], setItems }) {
  const fridgeItems = JSON.parse(localStorage.getItem("fridgeItems")) || [];
  const freezerItems = JSON.parse(localStorage.getItem("freezerItems")) || [];
  const pantryItems = JSON.parse(localStorage.getItem("pantryItems")) || [];

  const allItems = [
    ...items,
    ...fridgeItems.map((item) => ({
      ...item,
      location: item.location || "Fridge",
    })),
    ...freezerItems.map((item) => ({
      ...item,
      location: item.location || "Freezer",
    })),
    ...pantryItems.map((item) => ({
      ...item,
      location: item.location || "Pantry",
    })),
  ];

  const uniqueItems = allItems.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        (i) => i.id === item.id && i.location === item.location
      )
  );

  const outOfStockItems = uniqueItems
    .filter((item) => Number(item.quantity) === 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const getCategoryIcon = (category = "") => {
    if (category.includes("Dairy")) return "🥛";
    if (category.includes("Produce")) return "🥬";
    if (category.includes("Meat")) return "🍗";
    if (category.includes("Seafood")) return "🐟";
    if (category.includes("Bakery")) return "🍞";
    if (category.includes("Frozen")) return "❄️";
    if (category.includes("Snack")) return "🍪";
    if (category.includes("Beverage")) return "☕";
    if (category.includes("Grain")) return "🥣";
    if (category.includes("Household")) return "🧻";
    return "🍽️";
  };

  const getLocationIcon = (location = "") => {
    if (location === "Fridge") return "▣";
    if (location === "Freezer") return "❄️";
    return "▤";
  };

  const handleDelete = (itemToDelete) => {
    const storageKey =
      itemToDelete.location === "Fridge"
        ? "fridgeItems"
        : itemToDelete.location === "Freezer"
        ? "freezerItems"
        : "pantryItems";

    const savedItems = JSON.parse(localStorage.getItem(storageKey)) || [];
    const updatedItems = savedItems.filter(
      (item) => item.id !== itemToDelete.id
    );

    localStorage.setItem(storageKey, JSON.stringify(updatedItems));

    if (setItems) {
      setItems(items.filter((item) => item.id !== itemToDelete.id));
    }

    window.location.reload();
  };

  const handleAddToList = (item) => {
    const shoppingLists =
      JSON.parse(localStorage.getItem("shoppingLists")) || [];

    if (shoppingLists.length === 0) {
      alert("You need to create a shopping list first.");
      return;
    }

    const listOptions = shoppingLists
      .map((list, index) => `${index + 1}. ${list.name}`)
      .join("\n");

    const choice = prompt(
      `Which shopping list do you want to add this to?\n\n${listOptions}\n\nEnter the number:`
    );

    if (!choice) return;

    const selectedIndex = Number(choice) - 1;

    if (
      Number.isNaN(selectedIndex) ||
      selectedIndex < 0 ||
      selectedIndex >= shoppingLists.length
    ) {
      alert("Invalid shopping list choice.");
      return;
    }

    const selectedList = shoppingLists[selectedIndex];

    const updatedLists = shoppingLists.map((list, index) => {
      if (index !== selectedIndex) return list;

      return {
        ...list,
        items: [
          ...(list.items || []),
          {
            id: Date.now(),
            name: item.name,
            brand: item.brand || "",
            category: item.category || "",
            quantity: 1,
            unit: item.unit || "",
            checked: false,
          },
        ],
      };
    });

    localStorage.setItem("shoppingLists", JSON.stringify(updatedLists));

    alert(`${item.name} added to ${selectedList.name}.`);
  };

  return (
    <div className="outofstock-page">
      <div className="outofstock-top">
        <div className="outofstock-header">
          <div className="outofstock-main-icon"></div>

          <div>
            <h1>Out of Stock</h1>
            <p>Items with a quantity of 0 in your pantry, fridge, or freezer.</p>
          </div>
        </div>

        <div className="outofstock-tip">
          ℹ️ Add items to your shopping list to restock and keep your pantry
          ready.
        </div>
      </div>

      <div className="outofstock-table-card">
        <div className="outofstock-table-header">
          <span>Item ↓</span>
          <span>Category</span>
          <span>Location</span>
          <span>Quantity</span>
          <span>Notes</span>
          <span>Action</span>
        </div>

        {outOfStockItems.length === 0 ? (
          <div className="outofstock-empty">
            No out of stock items right now.
          </div>
        ) : (
          outOfStockItems.map((item) => (
            <div className="outofstock-row" key={`${item.location}-${item.id}`}>
              <div className="outofstock-item">
                <span className="outofstock-category-icon">
                  {getCategoryIcon(item.category)}
                </span>

                <div>
                  <h3>
                    {item.brand ? `${item.brand} ${item.name}` : item.name}
                  </h3>
                  <p>{item.category}</p>
                </div>
              </div>

              <div>{item.category || "—"}</div>

              <div className="location-cell">
                <span className="location-icon">
                  {getLocationIcon(item.location)}
                </span>
                <span>{item.location || "—"}</span>
              </div>

              <div>{item.quantity}</div>

              <div>{item.notes || "—"}</div>

              <div className="outofstock-actions">
                <button
                  className="add-list-btn"
                  onClick={() => handleAddToList(item)}
                >
                  🛒 Add to List
                </button>

                <button
                  className="remove-btn"
                  onClick={() => handleDelete(item)}
                >
                  🗑 Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OutOfStock;