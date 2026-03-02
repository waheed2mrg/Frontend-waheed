import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from './Sidebar'; 

const portfolioData = [
  { name: 'Global Halal Equities (HLAL)', value: 60 },
  { name: 'Sukuk / Islamic Bonds (SPSK)', value: 30 },
  { name: 'Gold & Precious Metals (GLD)', value: 10 },
];
const COLORS = ['#059669', '#10b981', '#fbbf24']; 

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [balance, setBalance] = useState(0);
  const [investment, setInvestment] = useState(0); 
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [riskProfile, setRiskProfile] = useState('');
  const [amount, setAmount] = useState(''); 
  const [investAmount, setInvestAmount] = useState(''); 
  
  // NEW: Investment Plans State
  const [plans, setPlans] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setBalance(parsedUser.balance || 0);
      setInvestment(parsedUser.investment || 0); 
      setUserEmail(parsedUser.email);
      setUserName(parsedUser.name || 'Investor'); 
      setRiskProfile(parsedUser.riskProfile || 'Moderate'); 
      
      // Fetch the plans for the user to view!
      const fetchPlans = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/investments');
          if (response.ok) setPlans(await response.json());
        } catch (error) { console.error("Error fetching plans:", error); }
      };
      fetchPlans();

    } else {
      navigate('/login');
    }
  }, [navigate]);

  // --- FUNDING FUNCTIONS ---
  const handleDeposit = async () => {
    const val = parseFloat(amount);
    if (val > 0) {
      try {
        const response = await fetch('http://localhost:5000/api/deposit', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: userEmail, amount: val }),
        });
        const data = await response.json();
        if (response.ok) {
          setBalance(data.balance); setAmount('');
          updateLocalUser(data);
          alert(`Successfully deposited $${val.toFixed(2)}!`);
        } else alert(`Error: ${data.message}`);
      } catch (error) { alert("Could not connect to the server."); }
    }
  };

  const handleWithdraw = async () => {
    const val = parseFloat(amount);
    if (val > 0) {
      try {
        const response = await fetch('http://localhost:5000/api/withdraw', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: userEmail, amount: val }),
        });
        const data = await response.json();
        if (response.ok) {
          setBalance(data.balance); setAmount('');
          updateLocalUser(data);
          alert(`Successfully withdrew $${val.toFixed(2)}!`);
        } else alert(`Error: ${data.message}`); 
      } catch (error) { alert("Could not connect to the server."); }
    }
  };

  // --- INVESTMENT FUNCTIONS (Buy & Sell) ---
  const handleInvest = async (actionType) => {
    const val = parseFloat(investAmount);
    if (val > 0) {
      const endpoint = actionType === 'buy' ? '/api/invest' : '/api/sell';
      try {
        const response = await fetch(`http://localhost:5000${endpoint}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: userEmail, amount: val }),
        });
        const data = await response.json();
        if (response.ok) {
          setBalance(data.balance);
          setInvestment(data.investment);
          setInvestAmount('');
          updateLocalUser(data);
          alert(`Successfully ${actionType === 'buy' ? 'invested' : 'sold'} $${val.toFixed(2)}!`);
        } else alert(`Error: ${data.message}`);
      } catch (error) { alert("Could not connect to the server."); }
    }
  };

  const updateLocalUser = (data) => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    savedUser.balance = data.balance;
    if (data.investment !== undefined) savedUser.investment = data.investment;
    localStorage.setItem('user', JSON.stringify(savedUser));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userEmail={userEmail} handleLogout={handleLogout} role="user" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        <nav style={{ backgroundColor: 'white', padding: '24px 40px', borderBottom: '1px solid #e2e8f0' }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '24px', textTransform: 'capitalize' }}>
            {activeTab === 'overview' ? `Welcome back, ${userName}` : activeTab}
          </h1>
        </nav>

        <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '40px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: '2', minWidth: '300px', backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Total Portfolio Value</p>
                <h1 style={{ margin: '12px 0 24px 0', color: '#0f172a', fontSize: '48px', fontWeight: '700' }}>
                  ${(balance + investment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h1>
                
                <div style={{ display: 'flex', gap: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Available Cash</p>
                    <p style={{ margin: 0, color: '#0f172a', fontSize: '20px', fontWeight: '600' }}>${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Invested</p>
                    <p style={{ margin: 0, color: '#059669', fontSize: '20px', fontWeight: '600' }}>${investment.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>

              <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#064e3b', color: 'white', padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundImage: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Ready to Grow?</h3>
                <p style={{ margin: '0 0 20px 0', color: '#a7f3d0', fontSize: '14px' }}>Move your cash into the market to start building long-term halal wealth.</p>
                <button onClick={() => setActiveTab('portfolio')} style={{ padding: '14px', backgroundColor: 'white', color: '#064e3b', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
                  Invest Now
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              
              <div style={{ flex: '2', minWidth: '400px', backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 24px 0', color: '#0f172a', fontSize: '18px' }}>Target Asset Allocation</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={portfolioData} innerRadius={90} outerRadius={130} paddingAngle={5} dataKey="value">
                        {portfolioData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px', flexWrap: 'wrap' }}>
                  {portfolioData.map((entry, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: COLORS[index], marginRight: '8px', borderRadius: '4px' }}></div>
                      <span style={{ color: '#475569', fontSize: '14px', fontWeight: '500' }}>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 24px 0', color: '#0f172a', fontSize: '18px' }}>Trade Portfolio</h3>
                
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Available Cash:</span>
                    <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: '700' }}>${balance.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Currently Invested:</span>
                    <span style={{ color: '#059669', fontSize: '14px', fontWeight: '700' }}>${investment.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Amount to Trade (USD)</label>
                    <input type="number" placeholder="$0.00" value={investAmount} onChange={(e) => setInvestAmount(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', outlineColor: '#059669' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleInvest('buy')} style={{ flex: 1, padding: '14px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                      Buy Portfolio
                    </button>
                    <button onClick={() => handleInvest('sell')} style={{ flex: 1, padding: '14px', backgroundColor: 'white', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                      Sell
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: INVEST OPTIONS (NEW) */}
          {activeTab === 'investments' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#0f172a' }}>Available Investment Portfolios</h2>
              <p style={{ color: '#64748b', marginBottom: '32px' }}>Browse curated portfolios managed by our experts. Head to the Portfolio tab to allocate funds.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {plans.length === 0 ? <p style={{ color: '#64748b' }}>No investment plans currently available. Please check back later.</p> : plans.map((plan) => (
                  <div key={plan._id} style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <h3 style={{ margin: 0, color: '#0f172a', fontSize: '20px' }}>{plan.title}</h3>
                    </div>
                    <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '15px', lineHeight: '1.5', flex: 1 }}>{plan.description}</p>
                    
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Expected ROI</p>
                        <p style={{ margin: 0, color: '#059669', fontSize: '16px', fontWeight: '700' }}>{plan.roi}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Risk Profile</p>
                        <p style={{ margin: 0, color: '#0f172a', fontSize: '16px', fontWeight: '700' }}>{plan.riskLevel}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FUNDING */}
          {activeTab === 'funding' && (
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 24px 0', color: '#0f172a', fontSize: '18px' }}>Bank Transfer</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Amount (USD)</label>
                    <input type="number" placeholder="$0.00" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', outlineColor: '#059669' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleDeposit} style={{ flex: 1, padding: '14px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                      Deposit Cash
                    </button>
                    <button onClick={handleWithdraw} style={{ flex: 1, padding: '14px', backgroundColor: 'white', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                      Withdraw to Bank
                    </button>
                  </div>
                </div>
              </div>
              
              <div style={{ flex: '1', backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '18px' }}>Available Cash Balance</h3>
                <h1 style={{ margin: '0', color: '#0f172a', fontSize: '48px', fontWeight: '700' }}>
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h1>
                <p style={{ color: '#64748b', fontSize: '14px', marginTop: '10px' }}>This is uninvested cash. Head to the Portfolio tab to invest it into the market.</p>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', maxWidth: '600px' }}>
              <h3 style={{ margin: '0 0 24px 0', color: '#0f172a', fontSize: '18px' }}>Account Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Full Name</p>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '16px', fontWeight: '500' }}>{userName}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Email Address</p>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '16px', fontWeight: '500' }}>{userEmail}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Risk Tolerance</p>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '16px', fontWeight: '500' }}>{riskProfile}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;