import React, { useState } from "react";

function AddItemModal({ section, onClose, setItems }) {
  const [formData, setFormData] = useState({
    item_name: "",
    brand_name: "",
    quantity: 1,
    unit: "Units",
    storage_category: section || "Pantry",
    expiration_date: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddItem = async () => {
    if (!formData.item_name.trim()) {
      alert("Please enter an item name.");
      return;
    }

    const itemToSave = {
      pantry_id: 1,
      item_name: formData.item_name,
      brand_name: formData.brand_name,
      quantity: formData.quantity,
      price: 0,
      expiration_date: formData.expiration_date || null,
      storage_category: section || formData.storage_category,
      notes: `${formData.notes} Unit: ${formData.unit}`,
    };

    try {
      const response = await fetch(
        "http://localhost/pantrypal-backend/add-item.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemToSave),
        }
      );

      const result = await response.json();

      if (result.success) {
        if (setItems) {
          setItems((prevItems) => [...prevItems, itemToSave]);
        }

        onClose();
      } else {
        alert(result.message || "Item was not saved.");
      }
    } catch (error) {
      console.error(error);
      alert("Could not connect to backend.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="add-item-modal">
        <button className="modal-back-btn" onClick={onClose}>
          ← Back to {section}
        </button>

        <h1>Add New Item</h1>

        <div className="add-item-grid">
          <div>
            <label>Item Name *</label>
            <input
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              placeholder="e.g., Milk, Eggs, Bread"
            />
          </div>

          <div>
            <label>Brand</label>
            <input
              name="brand_name"
              value={formData.brand_name}
              onChange={handleChange}
              placeholder="e.g., Organic Valley"
            />
          </div>

          <div>
            <label>Quantity *</label>
            <input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Unit *</label>
            <select name="unit" value={formData.unit} onChange={handleChange}>
              <option>Units</option>
              <option>Cartons</option>
              <option>Bottles</option>
              <option>Cans</option>
            </select>
          </div>

          <div>
            <label>Category *</label>
            <select
              name="storage_category"
              value={formData.storage_category}
              onChange={handleChange}
            >
              <option>Other</option>
              <option>Dairy</option>
              <option>Produce</option>
              <option>Frozen</option>
            </select>
          </div>

          <div>
            <label>Expiration Date</label>
            <input
              name="expiration_date"
              type="date"
              value={formData.expiration_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="notes-area">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional notes..."
          />
        </div>

        <div className="add-item-actions">
          <button className="submit-item-btn" onClick={handleAddItem}>
            Add Item
          </button>

          <button className="cancel-item-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddItemModal;