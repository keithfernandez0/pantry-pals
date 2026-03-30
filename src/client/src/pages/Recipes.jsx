import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ChefHat, Check, X } from 'lucide-react';

const Recipes = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // MOCK database of recipes
  // Note: While the backend handles pantry items, we calculate intelligent intersections here on the frontend!
  const RECIPES_DB = [
    {
      id: 1,
      name: "Classic Omelette",
      image: "https://images.unsplash.com/photo-1510693062638-eeb6695b2cbf?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Eggs", "Milk", "Salt", "Butter"]
    },
    {
      id: 2,
      name: "Fried Rice",
      image: "https://images.unsplash.com/photo-1512058454905-6b841e7ad132?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Rice", "Eggs", "Frozen Peas", "Soy Sauce", "Carrots"]
    },
    {
      id: 3,
      name: "Creamy Chicken Pasta",
      image: "https://images.unsplash.com/photo-1611270629569-8b357cb88da9?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Pasta", "Chicken Breast", "Heavy Cream", "Parmesan"]
    },
    {
      id: 4,
      name: "Fresh Caprese Salad",
      image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Tomatoes", "Mozzarella", "Basil", "Balsamic Vinegar"]
    }
  ];

  useEffect(() => {
    // We only fetch the items from the backend to do our intersection analysis
    const fetchItems = async () => {
      try {
        const { data } = await api.get('/items');
        // Map everything to lowercase for loose string matching logic
        setItems(data.map(i => i.name.toLowerCase()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return <div>Loading recipe engine...</div>;

  return (
    <div className="container" style={{ padding: 0 }}>
      {/* Title block aligned to wireframes */}
      <div className="mb-8">
        <h1 className="text-2xl mb-2 flex items-center gap-2">
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.4rem', borderRadius: '8px' }}>
            <ChefHat className="text-primary" size={24} />
          </div>
          Recipe Suggestions
        </h1>
        <p className="text-secondary" style={{ marginLeft: '45px' }}>What you can make with what you have in your pantry right now.</p>
      </div>

      {/* Grid aligned to wireframes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {RECIPES_DB.map(recipe => {
          
          // Intersection Logic
          const matched = recipe.ingredients.filter(ing => 
            items.some(userItem => userItem.includes(ing.toLowerCase()) || ing.toLowerCase().includes(userItem))
          );
          const missing = recipe.ingredients.filter(ing => !matched.includes(ing));
          const matchPercent = Math.round((matched.length / recipe.ingredients.length) * 100);

          return (
            <div key={recipe.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'pointer' }}>
              <div style={{ height: '220px', backgroundImage: `url(${recipe.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1rem', background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
                  <span className={`badge ${matchPercent === 100 ? 'badge-success' : 'badge-warning'}`} style={{ backdropFilter: 'blur(4px)' }}>
                    {matchPercent}% Match
                 </span>
                </div>
              </div>
              
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 className="text-xl mb-4">{recipe.name}</h3>
                
                <div className="mb-4">
                  <h4 className="text-sm text-secondary uppercase tracking-wider mb-2">You Have:</h4>
                  {matched.length > 0 ? (
                    <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                      {matched.map(ing => (
                        <span key={ing} className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}><Check size={12} className="text-accent" /> <span style={{ color: 'white' }}>{ing}</span></span>
                      ))}
                    </div>
                  ) : <span className="text-secondary text-sm">Nothing matched</span>}
                </div>

                <div className="mb-6">
                  <h4 className="text-sm text-secondary uppercase tracking-wider mb-2">Missing:</h4>
                  {missing.length > 0 ? (
                    <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                      {missing.map(ing => (
                        <span key={ing} className="badge badge-danger" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}><X size={12} className="text-danger" /> <span style={{ color: 'white' }}>{ing}</span></span>
                      ))}
                    </div>
                  ) : <span className="text-secondary text-sm">You have everything!</span>}
                </div>

                <button className="btn btn-secondary w-full" style={{ width: '100%', marginTop: 'auto' }}>
                  View Full Recipe
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recipes;
