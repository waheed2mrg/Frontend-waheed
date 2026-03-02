// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Signup = () => {
//   const [name, setName] = useState(''); // NEW: Name state
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [passwordStrength, setPasswordStrength] = useState(0); // NEW: Strength percentage
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
  
//   const navigate = useNavigate();

//   // --- NEW: Function to calculate password strength live ---
//   const handlePasswordChange = (e) => {
//     const pwd = e.target.value;
//     setPassword(pwd);

//     let strength = 0;
//     if (pwd.length >= 8) strength += 20; // Length
//     if (/[A-Z]/.test(pwd)) strength += 20; // Uppercase
//     if (/[a-z]/.test(pwd)) strength += 20; // Lowercase
//     if (/[0-9]/.test(pwd)) strength += 20; // Numbers
//     if (/[^A-Za-z0-9]/.test(pwd)) strength += 20; // Special characters

//     setPasswordStrength(strength);
//   };

//   // Determine the color and text of the strength bar
//   const getStrengthColor = () => {
//     if (passwordStrength <= 40) return '#ef4444'; // Red - Weak
//     if (passwordStrength <= 80) return '#f59e0b'; // Yellow - Medium
//     return '#10b981'; // Green - Strong
//   };

//   const getStrengthText = () => {
//     if (passwordStrength === 0) return '';
//     if (passwordStrength <= 40) return 'Weak';
//     if (passwordStrength <= 80) return 'Medium';
//     return 'Strong';
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');
//     setSuccessMessage('');

//     // Extra safety net: Don't let them submit if it's not strong!
//     if (passwordStrength < 100) {
//       setErrorMessage('Please create a stronger password before continuing.');
//       return;
//     }

//     try {
//       // Send the name along with email and password
//       const response = await fetch('http://localhost:5000/api/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccessMessage('Account created successfully! Redirecting...');
//         setTimeout(() => {
//           navigate('/login'); 
//         }, 2000);
//       } else {
//         setErrorMessage(data.message);
//       }
//     } catch (error) {
//       setErrorMessage("Could not connect to the server.");
//     }
//   };

//   return (
//     <div style={{ display: 'flex', height: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#f8fafc' }}>
      
//       {/* Left Side - Branding */}
//       <div style={{ flex: 1, backgroundColor: '#064e3b', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10%', backgroundImage: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' }}>
//         <h1 style={{ fontSize: '48px', fontWeight: '700', margin: '0 0 20px 0' }}>Start your journey.</h1>
//         <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#a7f3d0', maxWidth: '400px' }}>
//           Create an account today and start growing your wealth with Halal investments.
//         </p>
//       </div>

//       {/* Right Side - Signup Form */}
//       <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
//         <div style={{ width: '100%', maxWidth: '420px' }}>
//           <h2 style={{ fontSize: '32px', color: '#0f172a', marginBottom: '8px' }}>Create an Account</h2>
//           <p style={{ color: '#64748b', marginBottom: '32px' }}>Join the platform today.</p>

//           {errorMessage && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{errorMessage}</div>}
//           {successMessage && <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{successMessage}</div>}

//           <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
//             {/* NEW: Full Name Input */}
//             <div>
//               <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Full Name</label>
//               <input 
//                 type="text" 
//                 placeholder="John Doe" 
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', outlineColor: '#059669' }}
//               />
//             </div>

//             <div>
//               <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Email</label>
//               <input 
//                 type="email" 
//                 placeholder="you@example.com" 
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', outlineColor: '#059669' }}
//               />
//             </div>
            
//             <div>
//               <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Password</label>
//               <input 
//                 type="password" 
//                 placeholder="Create a strong password" 
//                 value={password}
//                 onChange={handlePasswordChange} // Trigger strength calculation on every keystroke!
//                 required
//                 style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', outlineColor: '#059669' }}
//               />
              
//               {/* NEW: Password Strength Meter Visual */}
//               {password.length > 0 && (
//                 <div style={{ marginTop: '10px' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
//                     <span style={{ color: '#64748b' }}>Password Strength</span>
//                     <span style={{ color: getStrengthColor(), fontWeight: 'bold' }}>{getStrengthText()} ({passwordStrength}%)</span>
//                   </div>
//                   <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
//                     <div style={{ 
//                       width: `${passwordStrength}%`, 
//                       height: '100%', 
//                       backgroundColor: getStrengthColor(), 
//                       transition: 'width 0.3s ease, background-color 0.3s ease' 
//                     }}></div>
//                   </div>
//                   <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px', margin: '6px 0 0 0' }}>
//                     Must include 8+ chars, uppercase, lowercase, numbers & symbols.
//                   </p>
//                 </div>
//               )}
//             </div>

//             <button 
//               type="submit"
//               disabled={passwordStrength < 100} // Disable the button if it's not 100% strong!
//               style={{ 
//                 padding: '16px', backgroundColor: passwordStrength === 100 ? '#059669' : '#94a3b8', 
//                 color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', 
//                 cursor: passwordStrength === 100 ? 'pointer' : 'not-allowed', marginTop: '10px', 
//                 transition: 'background-color 0.2s' 
//               }}
//             >
//               Sign Up
//             </button>
//           </form>

//           <p style={{ marginTop: '32px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
//             Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#059669', cursor: 'pointer', fontWeight: '600' }}>Log In</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

///////////////////////////////////////////////////////////////

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState(''); // NEW: Name state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0); // NEW: Strength percentage
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  // --- NEW: Function to calculate password strength live ---
  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);

    let strength = 0;
    if (pwd.length >= 8) strength += 20; // Length
    if (/[A-Z]/.test(pwd)) strength += 20; // Uppercase
    if (/[a-z]/.test(pwd)) strength += 20; // Lowercase
    if (/[0-9]/.test(pwd)) strength += 20; // Numbers
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 20; // Special characters

    setPasswordStrength(strength);
  };

  // Determine the color and text of the strength bar
  const getStrengthColor = () => {
    if (passwordStrength <= 40) return '#ef4444'; // Red - Weak
    if (passwordStrength <= 80) return '#f59e0b'; // Yellow - Medium
    return '#10b981'; // Green - Strong
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 40) return 'Weak';
    if (passwordStrength <= 80) return 'Medium';
    return 'Strong';
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Extra safety net: Don't let them submit if it's not strong!
    if (passwordStrength < 100) {
      setErrorMessage('Please create a stronger password before continuing.');
      return;
    }

    // ✅ NEW: Dynamically grab the backend URL based on the environment
    const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    try {
      // ✅ NEW: Use the dynamic apiUrl instead of hardcoding localhost
      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/login'); 
        }, 2000);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("Could not connect to the server.");
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#f8fafc' }}>
      
      {/* Left Side - Branding */}
      <div style={{ flex: 1, backgroundColor: '#064e3b', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10%', backgroundImage: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '700', margin: '0 0 20px 0' }}>Start your journey.</h1>
        <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#a7f3d0', maxWidth: '400px' }}>
          Create an account today and start growing your wealth with Halal investments.
        </p>
      </div>

      {/* Right Side - Signup Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h2 style={{ fontSize: '32px', color: '#0f172a', marginBottom: '8px' }}>Create an Account</h2>
          <p style={{ color: '#64748b', marginBottom: '32px' }}>Join the platform today.</p>

          {errorMessage && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{errorMessage}</div>}
          {successMessage && <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{successMessage}</div>}

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Full Name Input */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', outlineColor: '#059669' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Email</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', outlineColor: '#059669' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Password</label>
              <input 
                type="password" 
                placeholder="Create a strong password" 
                value={password}
                onChange={handlePasswordChange} // Trigger strength calculation on every keystroke!
                required
                style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', outlineColor: '#059669' }}
              />
              
              {/* Password Strength Meter Visual */}
              {password.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Password Strength</span>
                    <span style={{ color: getStrengthColor(), fontWeight: 'bold' }}>{getStrengthText()} ({passwordStrength}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${passwordStrength}%`, 
                      height: '100%', 
                      backgroundColor: getStrengthColor(), 
                      transition: 'width 0.3s ease, background-color 0.3s ease' 
                    }}></div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px', margin: '6px 0 0 0' }}>
                    Must include 8+ chars, uppercase, lowercase, numbers & symbols.
                  </p>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={passwordStrength < 100} // Disable the button if it's not 100% strong!
              style={{ 
                padding: '16px', backgroundColor: passwordStrength === 100 ? '#059669' : '#94a3b8', 
                color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', 
                cursor: passwordStrength === 100 ? 'pointer' : 'not-allowed', marginTop: '10px', 
                transition: 'background-color 0.2s' 
              }}
            >
              Sign Up
            </button>
          </form>

          <p style={{ marginTop: '32px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
            Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#059669', cursor: 'pointer', fontWeight: '600' }}>Log In</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;