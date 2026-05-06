import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, X, Search, Trash2 } from 'lucide-react';

const Pantry = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [locationId, setLocationId] = useState(1);
  const [unitId, setUnitId] = useState(1);
  const [expirationDate, setExpirationDate] = useState('');

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/items');
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post('/items', {
        name,
        category,
        quantity: parseFloat(quantity) || 0,
        location_id: parseInt(locationId),
        unit_id: parseInt(unitId),
        expiration_date: expirationDate || null
      });
      setShowModal(false);
      setName('');
      setCategory('');
      setQuantity('');
      setExpirationDate('');
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to add item');
    }
  };

  const getLocationName = (id) => {
    if (id === 1) return 'Fridge';
    if (id === 2) return 'Freezer';
    return 'Pantry Cabinet';
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = filterLocation ? item.location_id.toString() === filterLocation : true;
    return matchesSearch && matchesLocation;
  });

  if (loading) return <div>Loading pantry...</div>;

  return (
    <div className="container" style={{ padding: 0 }}>
      {/* Header aligned to wireframes */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl mb-0">My Pantry</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Modern Filter Ribbon */}
      <div className="glass-panel mb-6 flex gap-4" style={{ padding: '0.5rem 1rem' }}>
        <div className="flex items-center gap-2" style={{ flex: 1 }}>
          <Search size={18} className="text-secondary" />
          <input 
            type="text" 
            placeholder="Search ingredients..." 
            className="input-field" 
            style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        <select 
          className="input-field" 
          style={{ width: '200px', border: 'none', background: 'transparent' }}
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
        >
          <option value="" style={{ color: 'black' }}>All Locations</option>
          <option value="1" style={{ color: 'black' }}>Fridge</option>
          <option value="2" style={{ color: 'black' }}>Freezer</option>
          <option value="3" style={{ color: 'black' }}>Pantry Cabinet</option>
        </select>
      </div>

      {/* Main Table view */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Expires</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td className="font-bold">{item.name}</td>
                <td><span className="text-secondary">{item.category || '—'}</span></td>
                <td>{parseFloat(item.quantity) || 0}</td>
                <td>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {getLocationName(item.location_id)}
                  </span>
                </td>
                <td>{item.expiration_date ? new Date(item.expiration_date).toLocaleDateString() : '—'}</td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="btn" 
                    style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty States */}
        {filteredItems.length === 0 && (
           <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
             No pantry items found matching your filters.
           </div>
        )}
      </div>

      {/* Premium Blur Backdrop Modal for Adding Items */}
      {showModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content" style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowModal(false)} 
              title="Close"
              style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl mb-6">Add New Item</h2>
            
            <form onSubmit={handleAddItem} className="flex flex-col gap-4">
              <div className="form-group mb-0">
                <label className="label">Item Name</label>
                <input type="text" className="input-field" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Fuji Apples" />
              </div>

              <div className="flex gap-4">
                <div className="form-group mb-0" style={{ flex: 1 }}>
                  <label className="label">Category</label>
                  <input type="text" className="input-field" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Produce" />
                </div>
                <div className="form-group mb-0" style={{ flex: 1 }}>
                  <label className="label">Location</label>
                  <select className="input-field" value={locationId} onChange={e => setLocationId(e.target.value)}>
                    <option value="1">Fridge</option>
                    <option value="2">Freezer</option>
                    <option value="3">Pantry Cabinet</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="form-group mb-0" style={{ flex: 1 }}>
                  <label className="label">Quantity</label>
                  <input type="number" step="0.1" className="input-field" required value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g. 1" />
                </div>
                <div className="form-group mb-0" style={{ flex: 1 }}>
                  <label className="label">Units</label>
                  <select className="input-field" value={unitId} onChange={e => setUnitId(e.target.value)}>
                    <option value="1">Grams (g)</option>
                    <option value="2">Kilograms (kg)</option>
                    <option value="3">Pounds (lb)</option>
                    <option value="4">Ounces (oz)</option>
                    <option value="5">Liters (L)</option>
                    <option value="7">Whole Units (qty)</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="label">Expiration Date (Optional)</label>
                <input type="date" className="input-field" value={expirationDate} onChange={e => setExpirationDate(e.target.value)} />
              </div>

              <div className="flex justify-between mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, marginLeft: '1rem' }}>Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pantry;
