import React, { useEffect, useState } from "react";

function Freezer({ items = [], setItems }) {
  const freezerItems = items.filter((item) => item.location === "Freezer");

  const categories = [
    "All",
    "Frozen Meals",
    "Meat",
    "Vegetables",
    "Desserts",
    "Seafood",
    "Other",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("Units");
  const [category, setCategory] = useState("Other");
  const [expirationDate, setExpirationDate] = useState("");
  const [notes, setNotes] = useState("");

  const [showUsageForm, setShowUsageForm] = useState(false);
  const [usageItem, setUsageItem] = useState(null);
  const [usedFor, setUsedFor] = useState("");
  const [pendingUpdatedItem, setPendingUpdatedItem] = useState(null);


  const filteredItems = freezerItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const itemText = `${item.name || ""} ${item.brand || ""}`.toLowerCase();
    const matchesSearch = itemText.includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const resetForm = () => {
    setItemName("");
    setBrand("");
    setQuantity("");
    setUnit("Units");
    setCategory("Other");
    setExpirationDate("");
    setNotes("");
    setEditingItemId(null);
  };

  const resetUsageForm = () => {
    setShowUsageForm(false);
    setUsageItem(null);
    setUsedFor("");
    setPendingUpdatedItem(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingItemId(item.id);
    setItemName(item.name);
    setBrand(item.brand);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setCategory(item.category);
    setExpirationDate(item.expirationDate);
    setNotes(item.notes);
    setShowForm(true);
  };

  const handleSaveItem = () => {
    if (!itemName.trim()) {
      alert("Please enter an item name.");
      return;
    }

    if (quantity === "" || Number(quantity) < 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    const oldItem = items.find((item) => item.id === editingItemId);

    const savedItem = {
      id: editingItemId || Date.now(),
      name: itemName,
      brand,
      quantity: Number(quantity),
      unit,
      category,
      expirationDate,
      notes,
      location: "Freezer",
    };

    if (
      editingItemId &&
      oldItem &&
      Number(quantity) < Number(oldItem.quantity)
    ) {
      setUsageItem(oldItem);
      setPendingUpdatedItem(savedItem);
      setUsedFor("");
      setShowForm(false);
      setShowUsageForm(true);
      return;
    }

    if (editingItemId) {
      setItems(
        items.map((item) => (item.id === editingItemId ? savedItem : item))
      );
    } else {
      setItems([...items, savedItem]);
    }

    resetForm();
    setShowForm(false);
  };

  const handleSaveUsage = () => {
    if (!usedFor.trim()) {
      alert("Please enter what you used it for.");
      return;
    }

    const quantityUsed =
      Number(usageItem.quantity) - Number(pendingUpdatedItem.quantity);

    const usageRecord = {
      id: Date.now(),
      itemName: usageItem.name,
      brand: usageItem.brand || "",
      quantityUsed,
      unit: usageItem.unit || "",
      usedFor,
      location: "Freezer",
      date: new Date().toLocaleDateString(),
    };

    const currentHistory =
      JSON.parse(localStorage.getItem("usageHistory")) || [];

    localStorage.setItem(
      "usageHistory",
      JSON.stringify([usageRecord, ...currentHistory])
    );

    setItems(
      items.map((item) =>
        item.id === pendingUpdatedItem.id ? pendingUpdatedItem : item
      )
    );

    resetUsageForm();
    resetForm();
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
    resetForm();
    setShowForm(false);
  };

  return (
    <div className="inventory-page">
      <button className="back-btn" onClick={() => window.history.back()}>
        ← Back
      </button>

      <div className="inventory-header">
        <div>
          <h1>Freezer</h1>
          <p>{freezerItems.length} items</p>
        </div>

        <div className="inventory-header-actions">
          <input
            className="header-search"
            type="text"
            placeholder="Search freezer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button className="add-item-btn" onClick={openAddForm}>
            + Add Item
          </button>
        </div>
      </div>

      <div className="category-pills">
        {categories.map((cat) => (
          <button
            key={cat}
            className={
              selectedCategory === cat ? "category-pill active" : "category-pill"
            }
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">❄︎</div>
          <h2>No items found</h2>

          <button className="empty-btn" onClick={openAddForm}>
            + Add your first item
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map((item) => (
            <div className="item-card" key={item.id}>
              <div className="item-card-top">
                <h3>
                  {item.brand ? `${item.brand} ` : ""}
                  {item.name}
                </h3>

                <div className="item-card-actions">
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => openEditForm(item)}
                  >
                    ✎
                  </button>

                  <button
                    className="icon-btn delete-btn"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <p>
                Qty: {item.quantity} {item.unit}
              </p>

              <p>Category: {item.category}</p>

              {item.expirationDate && <p>Expires: {item.expirationDate}</p>}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="add-item-modal">
            <button
              className="modal-back-btn"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              ← Back to freezer
            </button>

            <div className="modal-card">
              <h2>{editingItemId ? "Edit Item" : "Add New Item"}</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Chicken, Pizza, Ice Cream"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    placeholder="e.g., Tyson, DiGiorno"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Unit *</label>
                  <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option>Units</option>
                    <option>Gallons</option>
                    <option>Cup(s)</option>
                    <option>Oz(s)</option>
                    <option>Fl Oz(s)</option>
                    <option>Pound(s)</option>
                    <option>Gram(s)</option>
                    <option>Box</option>
                    <option>Bag(s)</option>
                    <option>Ct</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>Other</option>
                    <option>Frozen Meals</option>
                    <option>Meat</option>
                    <option>Vegetables</option>
                    <option>Desserts</option>
                    <option>Seafood</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Expiration Date</label>
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  placeholder="Add any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button className="modal-add-btn" onClick={handleSaveItem}>
                  {editingItemId ? "Save Changes" : "Add Item"}
                </button>

                <button
                  className="modal-cancel-btn"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  Cancel
                </button>
              </div>

              {editingItemId && (
                <button
                  className="modal-delete-btn"
                  onClick={() => handleDeleteItem(editingItemId)}
                >
                  Delete Item
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showUsageForm && (
        <div className="modal-overlay">
          <div className="add-item-modal">
            <div className="modal-card">
              <h2>What did you use it for?</h2>

              <p>
                You used{" "}
                {Number(usageItem.quantity) -
                  Number(pendingUpdatedItem.quantity)}{" "}
                {usageItem.unit} of {usageItem.name}.
              </p>

              <div className="form-group full-width">
                <label>Used For *</label>
                <input
                  type="text"
                  placeholder="e.g., dinner, lunch, meal prep"
                  value={usedFor}
                  onChange={(e) => setUsedFor(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button className="modal-add-btn" onClick={handleSaveUsage}>
                  Save Usage
                </button>

                <button className="modal-cancel-btn" onClick={resetUsageForm}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Freezer;