import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Package, Tags, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // We map hardcoded Location IDs for UI friendliness right now since we didn't add the /locations generic route
  const getLocationName = (id) => {
    if (id === 1) return 'Fridge';
    if (id === 2) return 'Freezer';
    return 'Cupboard';
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [itemsRes, expiringRes] = await Promise.all([
          api.get('/items'),
          api.get('/items/expiring-soon')
        ]);
        setItems(itemsRes.data);
        setExpiringItems(expiringRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const uniqueCategories = new Set(items.map(i => i.category).filter(Boolean)).size;

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="container" style={{ padding: 0 }}>
      <h1 className="text-2xl mb-8">Overview</h1>

      {/* Top Value Add Cards */}
      <div className="flex gap-6 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="glass-panel flex items-center justify-between">
          <div>
            <h3 className="text-secondary text-sm font-bold uppercase tracking-wider mb-2">Total Managed Items</h3>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '1rem', borderRadius: '12px', color: 'var(--primary-color)' }}>
            <Package size={28} />
          </div>
        </div>

        <div className="glass-panel flex items-center justify-between">
          <div>
            <h3 className="text-secondary text-sm font-bold uppercase tracking-wider mb-2">Active Categories</h3>
            <p className="text-2xl font-bold">{uniqueCategories}</p>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '12px', color: 'var(--accent-color)' }}>
            <Tags size={28} />
          </div>
        </div>
      </div>

      {/* Expiring Priority List */}
      <h2 className="text-xl mb-4 flex items-center gap-2">
        <AlertTriangle size={20} className="text-warning" />
        Expiring Soon <span className="text-secondary text-sm font-normal">(Next 14 Days)</span>
      </h2>
      
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {expiringItems.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Location</th>
                <th>Quantity</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {expiringItems.map(item => (
                <tr key={item.id}>
                  <td className="font-bold">{item.name}</td>
                  <td>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {getLocationName(item.location_id)}
                    </span>
                  </td>
                  <td>{parseFloat(item.quantity)}</td>
                  <td className="text-warning font-bold">
                    {new Date(item.expiration_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Package size={48} style={{ opacity: 0.3, margin: '0 auto 1rem auto' }} />
            <p className="text-lg">You have no items expiring soon! Awesome.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <Link to="/pantry" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
          Open Full Database <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
