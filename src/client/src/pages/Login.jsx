import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChefHat } from 'lucide-react';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.errors?.[0]?.msg || 
        'An error occurred. Make sure the server database is active.'
      );
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2rem' }}>
        <div className="flex flex-col items-center mb-8">
          <div style={{ background: 'var(--primary-color)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <ChefHat size={36} color="white" />
          </div>
          <h1 className="text-2xl text-center">Welcome to <span style={{ color: 'var(--primary-color)' }}>Pantry Pal</span></h1>
          <p className="text-secondary text-sm mt-2">{isRegister ? 'Create your account' : 'Sign in to continue'}</p>
        </div>

        {error && (
          <div className="glass-panel" style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', marginBottom: '1.5rem', borderRadius: '8px' }}>
            <p className="text-danger text-sm text-center font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group mb-0">
            <label className="label">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group mb-0">
            <label className="label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isRegister ? 8 : undefined}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem', fontSize: '1rem' }}>
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button 
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-family)', textDecoration: 'underline' }}
          >
            {isRegister ? 'Already have an account? Sign in here' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
