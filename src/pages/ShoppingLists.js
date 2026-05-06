import React, { useEffect, useState } from "react";

function ShoppingList({ currentUser, pantry }) {
  const pantryId = pantry?.inviteCode || pantry?.id || "default";
  const userEmail = currentUser?.email || "guest";

  const storageKey = `shoppingLists_${userEmail}_${pantryId}`;
  const selectedKey = `selectedShoppingListId_${userEmail}_${pantryId}`;

  const [shoppingLists, setShoppingLists] = useState(() => {
    const savedLists = localStorage.getItem(storageKey);
    return savedLists ? JSON.parse(savedLists) : [];
  });

  const [selectedListId, setSelectedListId] = useState(() => {
    const savedSelected = localStorage.getItem(selectedKey);
    return savedSelected ? Number(savedSelected) : null;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showListModal, setShowListModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [listName, setListName] = useState("");

  const [itemForm, setItemForm] = useState({
    name: "",
    brand: "",
    quantity: "",
    unit: "Units",
    category: "Other",
  });

  useEffect(() => {
    const savedLists = localStorage.getItem(storageKey);
    const savedSelected = localStorage.getItem(selectedKey);

    const loadedLists = savedLists ? JSON.parse(savedLists) : [];

    setShoppingLists(loadedLists);
    setSelectedListId(savedSelected ? Number(savedSelected) : null);
  }, [storageKey, selectedKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(shoppingLists));
  }, [shoppingLists, storageKey]);

  useEffect(() => {
    if (selectedListId) {
      localStorage.setItem(selectedKey, selectedListId);
    } else {
      localStorage.removeItem(selectedKey);
    }
  }, [selectedListId, selectedKey]);

  useEffect(() => {
    if (!selectedListId && shoppingLists.length > 0) {
      setSelectedListId(shoppingLists[0].id);
    }
  }, [shoppingLists, selectedListId]);

  const selectedList = shoppingLists.find((list) => list.id === selectedListId);

  const totalItems = shoppingLists.reduce(
    (total, list) => total + list.items.length,
    0
  );

  const purchasedCount =
    selectedList?.items.filter((item) => item.purchased).length || 0;

  const progress =
    selectedList && selectedList.items.length > 0
      ? (purchasedCount / selectedList.items.length) * 100
      : 0;

  const recentlyAdded = shoppingLists
    .flatMap((list) =>
      list.items.map((item) => ({
        ...item,
        listName: list.name,
      }))
    )
    .slice(-4)
    .reverse();

  const filteredItems =
    selectedList?.items.filter((item) => {
      const text = `${item.name} ${item.brand} ${item.category}`.toLowerCase();
      return text.includes(searchTerm.toLowerCase());
    }) || [];

  const resetItemForm = () => {
    setItemForm({
      name: "",
      brand: "",
      quantity: "",
      unit: "Units",
      category: "Other",
    });
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemForm((prev) => ({ ...prev, [name]: value }));
  };

  const openNewListModal = () => {
    setEditingList(null);
    setListName("");
    setShowListModal(true);
  };

  const openEditListModal = () => {
    if (!selectedList) return;
    setEditingList(selectedList);
    setListName(selectedList.name);
    setShowListModal(true);
  };

  const handleSaveList = () => {
    if (!listName.trim()) return;

    if (editingList) {
      setShoppingLists(
        shoppingLists.map((list) =>
          list.id === editingList.id ? { ...list, name: listName } : list
        )
      );
    } else {
      const newList = {
        id: Date.now(),
        name: listName,
        items: [],
      };

      setShoppingLists([...shoppingLists, newList]);
      setSelectedListId(newList.id);
    }

    setListName("");
    setEditingList(null);
    setShowListModal(false);
  };

  const handleDeleteList = (id) => {
    const updatedLists = shoppingLists.filter((list) => list.id !== id);
    setShoppingLists(updatedLists);
    setSelectedListId(updatedLists.length > 0 ? updatedLists[0].id : null);
  };

  const openAddItemModal = () => {
    if (!selectedList) return;
    setEditingItem(null);
    resetItemForm();
    setShowItemModal(true);
  };

  const openEditItemModal = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name || "",
      brand: item.brand || "",
      quantity: item.quantity || "",
      unit: item.unit || "Units",
      category: item.category || "Other",
    });
    setShowItemModal(true);
  };

  const handleSaveItem = () => {
    if (!itemForm.name.trim() || !selectedListId) return;

    if (editingItem) {
      setShoppingLists(
        shoppingLists.map((list) =>
          list.id === selectedListId
            ? {
                ...list,
                items: list.items.map((item) =>
                  item.id === editingItem.id ? { ...item, ...itemForm } : item
                ),
              }
            : list
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        ...itemForm,
        purchased: false,
      };

      setShoppingLists(
        shoppingLists.map((list) =>
          list.id === selectedListId
            ? { ...list, items: [...list.items, newItem] }
            : list
        )
      );
    }

    resetItemForm();
    setEditingItem(null);
    setShowItemModal(false);
  };

  const togglePurchased = (itemId) => {
    setShoppingLists(
      shoppingLists.map((list) =>
        list.id === selectedListId
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId
                  ? { ...item, purchased: !item.purchased }
                  : item
              ),
            }
          : list
      )
    );
  };

  const handleDeleteItem = (itemId) => {
    setShoppingLists(
      shoppingLists.map((list) =>
        list.id === selectedListId
          ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
          : list
      )
    );
  };

  return (
    <div className="shopping-page">
      <div className="shopping-top">
        <div>
          <h1>Shopping Lists</h1>
          <p>
            {shoppingLists.length} lists • {totalItems} total items
          </p>
        </div>

        <div className="shopping-top-actions">
          <input
            className="shopping-search"
            type="text"
            placeholder="Search lists or items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button className="shopping-new-btn" onClick={openNewListModal}>
            + New List
          </button>
        </div>
      </div>

      {shoppingLists.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h2>No shopping lists yet</h2>
          <button className="empty-btn" onClick={openNewListModal}>
            + New List
          </button>
        </div>
      ) : (
        <>
          <select
            className="pretty-list-select"
            value={selectedListId || ""}
            onChange={(e) => setSelectedListId(Number(e.target.value))}
          >
            {shoppingLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>

          <div className="shopping-layout">
            <div className="shopping-main-card">
              <div className="shopping-card-header">
                <div>
                  <h2>{selectedList?.name}</h2>
                  <p>
                    {selectedList?.items.length || 0} items • {purchasedCount} of{" "}
                    {selectedList?.items.length || 0} purchased
                  </p>
                </div>

                <button className="shopping-edit-icon" onClick={openEditListModal}>
                  ✎
                </button>
              </div>

              <div className="shopping-progress">
                <div style={{ width: `${progress}%` }}></div>
              </div>

              {filteredItems.length === 0 ? (
                <div className="shopping-empty-inside">
                  <div className="empty-icon">🛒</div>
                  <p>No items in this list</p>
                  <button className="empty-btn" onClick={openAddItemModal}>
                    + Add your first item
                  </button>
                </div>
              ) : (
                <div className="modern-shopping-items">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="modern-shopping-row">
                      <input
                        type="checkbox"
                        checked={item.purchased}
                        onChange={() => togglePurchased(item.id)}
                      />

                      <div className="shopping-item-emoji">
                        {item.category === "Dairy"
                          ? "🥛"
                          : item.category === "Eggs"
                          ? "🥚"
                          : item.category === "Produce"
                          ? "🍎"
                          : item.category === "Protein"
                          ? "🍗"
                          : item.category === "Bakery"
                          ? "🍞"
                          : item.category === "Pantry"
                          ? "🥫"
                          : "🛒"}
                      </div>

                      <div className="modern-shopping-info">
                        <h3 className={item.purchased ? "purchased" : ""}>
                          {item.brand ? `${item.brand} ${item.name}` : item.name}
                        </h3>
                        <p>
                          {item.quantity} {item.unit}
                        </p>
                      </div>

                      <span className="shopping-category-tag">
                        {item.category}
                      </span>

                      <div className="modern-shopping-actions">
                        <button onClick={() => openEditItemModal(item)}>✎</button>
                        <button onClick={() => handleDeleteItem(item.id)}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="shopping-bottom-actions">
                <button onClick={openAddItemModal}>+</button>
                <button
                  className="delete-list-btn"
                  onClick={() => handleDeleteList(selectedList.id)}
                >
                  🗑
                </button>
              </div>
            </div>

            <div className="shopping-side-column">
              <div className="shopping-side-card">
                <div className="side-card-title">
                  <h3>All Lists</h3>
                  <button onClick={openNewListModal}>+</button>
                </div>

                {shoppingLists.map((list) => (
                  <button
                    key={list.id}
                    className={
                      selectedListId === list.id
                        ? "side-list-item active"
                        : "side-list-item"
                    }
                    onClick={() => setSelectedListId(list.id)}
                  >
                    <span>🛒</span>
                    <div>
                      <strong>{list.name}</strong>
                      <p>{list.items.length} items</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="shopping-side-card">
                <h3>Recently Added</h3>

                {recentlyAdded.length === 0 ? (
                  <p className="side-muted">No recent items</p>
                ) : (
                  recentlyAdded.map((item) => (
                    <div className="recent-item" key={item.id}>
                      <span>🛒</span>
                      <div>
                        <strong>{item.name}</strong>
                        <p>Added recently</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {showListModal && (
        <div className="modal-overlay">
          <div className="add-item-modal">
            <div className="modal-card">
              <button
                className="modal-close"
                onClick={() => {
                  setListName("");
                  setEditingList(null);
                  setShowListModal(false);
                }}
              >
                ×
              </button>

              <h2>
                {editingList ? "Edit Shopping List" : "Create New Shopping List"}
              </h2>

              <div className="form-group full-width">
                <label>List Name</label>
                <input
                  type="text"
                  placeholder="e.g., Weekly Groceries"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveList();
                  }}
                  autoFocus
                />
              </div>

              <div className="modal-actions">
                <button
                  className="modal-cancel-btn"
                  onClick={() => {
                    setListName("");
                    setEditingList(null);
                    setShowListModal(false);
                  }}
                >
                  Cancel
                </button>

                <button className="modal-add-btn" onClick={handleSaveList}>
                  {editingList ? "Save Changes" : "Create List"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showItemModal && (
        <div className="modal-overlay">
          <div className="add-item-modal">
            <div className="modal-card">
              <h2>{editingItem ? "Edit Item" : "Add New Item"}</h2>

              <div className="item-form-grid">
                <div className="form-group">
                  <label>Item Name *</label>
                  <input
                    name="name"
                    value={itemForm.name}
                    onChange={handleItemChange}
                    placeholder="e.g., Milk, Eggs, Apples"
                  />
                </div>

                <div className="form-group">
                  <label>Brand</label>
                  <input
                    name="brand"
                    value={itemForm.brand}
                    onChange={handleItemChange}
                    placeholder="e.g., Organic Valley"
                  />
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    name="quantity"
                    type="number"
                    value={itemForm.quantity}
                    onChange={handleItemChange}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Unit *</label>
                  <select
                    name="unit"
                    value={itemForm.unit}
                    onChange={handleItemChange}
                  >
                    <option>Units</option>
                    <option>gallon</option>
                    <option>count</option>
                    <option>loaf</option>
                    <option>lbs</option>
                    <option>oz</option>
                    <option>bottle</option>
                    <option>box</option>
                    <option>bag</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Category</label>
                  <select
                    name="category"
                    value={itemForm.category}
                    onChange={handleItemChange}
                  >
                    <option>Other</option>
                    <option>Dairy</option>
                    <option>Eggs</option>
                    <option>Produce</option>
                    <option>Protein</option>
                    <option>Bakery</option>
                    <option>Pantry</option>
                    <option>Frozen</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <div className="item-modal-actions">
                    <button className="modal-add-btn" onClick={handleSaveItem}>
                      {editingItem ? "Save Changes" : "Add Item"}
                    </button>

                    <button
                      className="modal-cancel-btn"
                      onClick={() => {
                        resetItemForm();
                        setEditingItem(null);
                        setShowItemModal(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingList;