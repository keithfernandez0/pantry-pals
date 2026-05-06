import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, List, ChefHat, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="glass-panel flex-col justify-between" style={{ width: '250px', height: '100vh', padding: '2rem', display: 'flex', borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--primary-color)' }}>
          Pantry Pal
        </h2>
        <div className="text-secondary mb-8 text-sm glass-panel" style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', border: 'none' }}>
          Welcome back,<br/>
          <span className="text-primary font-bold text-xl" style={{ color: '#fff' }}>{user?.email?.split('@')[0]}</span>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink 
            to="/dashboard"
            style={({ isActive }) => ({
              display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.85rem', borderRadius: '8px',
              textDecoration: 'none', color: isActive ? 'white' : 'var(--text-secondary)',
              background: isActive ? 'var(--primary-color)' : 'transparent',
              fontWeight: isActive ? 600 : 500,
              boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none',
              transition: 'all 0.2s'
            })}
          >
            <Home size={20} />
            Dashboard
          </NavLink>
          <NavLink 
            to="/pantry"
            style={({ isActive }) => ({
              display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.85rem', borderRadius: '8px',
              textDecoration: 'none', color: isActive ? 'white' : 'var(--text-secondary)',
              background: isActive ? 'var(--primary-color)' : 'transparent',
              fontWeight: isActive ? 600 : 500,
              boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none',
              transition: 'all 0.2s'
            })}
          >
            <List size={20} />
            My Pantry
          </NavLink>
          <NavLink 
            to="/recipes"
            style={({ isActive }) => ({
              display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.85rem', borderRadius: '8px',
              textDecoration: 'none', color: isActive ? 'white' : 'var(--text-secondary)',
              background: isActive ? 'var(--primary-color)' : 'transparent',
              fontWeight: isActive ? 600 : 500,
              boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none',
              transition: 'all 0.2s'
            })}
          >
            <ChefHat size={20} />
            Recipes
          </NavLink>
        </nav>
      </div>

      <button onClick={logout} className="btn btn-secondary w-full" style={{ width: '100%', marginTop: 'auto' }}>
        <LogOut size={18} />
        Log Out
      </button>
    </aside>
  );
};

export default Sidebar;
