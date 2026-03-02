import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Save user data
        localStorage.setItem('user', JSON.stringify(data.user));

        // ✅ Save token (if backend sends it)
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        // ✅ Role-based redirect
        if (data.user?.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }

      } else {
        setErrorMessage(data.message || 'Invalid email or password');
      }

    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Server not responding. Please try again later.");
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#f8fafc' }}>
      
      {/* Left Side */}
      <div style={{ 
        flex: 1, 
        backgroundColor: '#064e3b', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '0 10%',
        backgroundImage: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)'
      }}>
        <h1 style={{ fontSize: '48px', fontWeight: '700', margin: '0 0 20px 0' }}>
          Halal investing,<br/>made simple.
        </h1>
        <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#a7f3d0', maxWidth: '400px' }}>
          Build wealth without compromising your values. Access global, Shariah-compliant portfolios in minutes.
        </p>
      </div>

      {/* Right Side */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          
          <h2 style={{ fontSize: '32px', color: '#0f172a', marginBottom: '8px' }}>
            Welcome back
          </h2>
          <p style={{ color: '#64748b', marginBottom: '32px' }}>
            Enter your details to access your portfolio.
          </p>

          {/* Error Message */}
          {errorMessage && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
                Email
              </label>
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '16px',
                  outlineColor: '#059669'
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
                Password
              </label>
              <input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '16px',
                  outlineColor: '#059669'
                }}
              />
            </div>

            {/* Remember / Forgot */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#059669', width: '16px', height: '16px' }} />
                Remember me
              </label>
              <span style={{ color: '#059669', fontWeight: '600', cursor: 'pointer' }}>
                Forgot password?
              </span>
            </div>

            {/* Submit */}
            <button 
              type="submit"
              style={{
                padding: '16px',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Sign In
            </button>

          </form>

          {/* Signup */}
          <p style={{ marginTop: '32px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
            Don't have an account?
            <span 
              onClick={() => navigate('/signup')}
              style={{ color: '#059669', cursor: 'pointer', fontWeight: '600', marginLeft: '5px' }}
            >
              Open an account
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;