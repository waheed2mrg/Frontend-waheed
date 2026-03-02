import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users'); 
  const [users, setUsers] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  
  // Edit User State
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '', balance: 0, investment: 0, riskProfile: '' });
  
  // NEW: Investment Plans State
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ title: '', description: '', roi: '', riskLevel: 'Medium' });

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.role !== 'admin') {
        navigate('/dashboard'); 
      } else {
        setAdminName(parsedUser.name);
        setAdminEmail(parsedUser.email);
        fetchUsers();
        fetchPlans(); // Fetch the plans when the admin logs in!
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // --- FETCH FUNCTIONS ---
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users');
      if (response.ok) setUsers(await response.json());
    } catch (error) { console.error("Error fetching users:", error); }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/investments');
      if (response.ok) setPlans(await response.json());
    } catch (error) { console.error("Error fetching plans:", error); }
  };

  // --- USER MANAGEMENT FUNCTIONS ---
  const handleDelete = async (id, email) => {
    if (window.confirm(`Are you sure you want to permanently delete ${email}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/users/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setUsers(users.filter(user => user._id !== id));
        } else {
          const data = await response.json();
          alert(data.message); 
        }
      } catch (error) { console.error("Failed to delete user", error); }
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setEditFormData({
      name: user.name, email: user.email, role: user.role, 
      balance: user.balance || 0, investment: user.investment || 0, riskProfile: user.riskProfile
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${editingUser}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editFormData),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => (u._id === editingUser ? updatedUser : u)));
        setEditingUser(null); 
      }
    } catch (error) { console.error("Failed to update user", error); }
  };

  // --- NEW: PLAN MANAGEMENT FUNCTIONS ---
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/investments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newPlan),
      });
      if (response.ok) {
        const data = await response.json();
        setPlans([...plans, data]);
        setNewPlan({ title: '', description: '', roi: '', riskLevel: 'Medium' }); // Reset form
        alert('Plan created successfully!');
      }
    } catch (error) { console.error(error); }
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm("Delete this investment plan?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/investments/${id}`, { method: 'DELETE' });
        if (response.ok) setPlans(plans.filter(p => p._id !== id));
      } catch (error) { console.error(error); }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userEmail={adminEmail} handleLogout={handleLogout} role="admin" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative' }}>
        <nav style={{ backgroundColor: 'white', padding: '24px 40px', borderBottom: '1px solid #e2e8f0' }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '24px' }}>
            Admin Control Panel <span style={{ color: '#64748b', fontSize: '16px', fontWeight: 'normal', marginLeft: '10px' }}>| Welcome back, {adminName}</span>
          </h1>
        </nav>

        <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '40px', boxSizing: 'border-box' }}>
          
          {/* TAB 1: MANAGE USERS */}
          {activeTab === 'users' && (
            <>
              <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '30px', borderLeft: '6px solid #059669' }}>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Registered Users</p>
                <h2 style={{ margin: '10px 0 0 0', fontSize: '48px', color: '#0f172a' }}>{users.length}</h2>
              </div>

              <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '14px' }}>
                      <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Name</th>
                      <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Email</th>
                      <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Role</th>
                      <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Cash Balance</th>
                      <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Invested</th>
                      <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
                        <td style={{ padding: '16px', color: '#0f172a', fontWeight: '500' }}>{user.name}</td>
                        <td style={{ padding: '16px', color: '#64748b' }}>{user.email}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ backgroundColor: user.role === 'admin' ? '#fef08a' : '#dcfce7', color: user.role === 'admin' ? '#854d0e' : '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {user.role}
                          </span>
                        </td>
                        <td style={{ padding: '16px', color: '#0f172a', fontWeight: '600' }}>${user.balance?.toFixed(2) || '0.00'}</td>
                        <td style={{ padding: '16px', color: '#059669', fontWeight: '600' }}>${user.investment?.toFixed(2) || '0.00'}</td>
                        <td style={{ padding: '16px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleEditClick(user)} style={{ padding: '6px 12px', backgroundColor: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>Edit</button>
                          <button onClick={() => handleDelete(user._id, user.email)} style={{ padding: '6px 12px', backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* TAB 2: INVESTMENT PLANS */}
          {activeTab === 'investments' && (
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 24px 0', color: '#0f172a' }}>Create New Plan</h3>
                <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input type="text" placeholder="Plan Title (e.g., Global Tech Fund)" value={newPlan.title} onChange={(e) => setNewPlan({...newPlan, title: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} required />
                  <textarea placeholder="Description" value={newPlan.description} onChange={(e) => setNewPlan({...newPlan, description: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '80px' }} required />
                  <input type="text" placeholder="Expected ROI (e.g., 8-10% Annually)" value={newPlan.roi} onChange={(e) => setNewPlan({...newPlan, roi: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} required />
                  <select value={newPlan.riskLevel} onChange={(e) => setNewPlan({...newPlan, riskLevel: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                  <button type="submit" style={{ padding: '14px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Create Plan</button>
                </form>
              </div>

              <div style={{ flex: '2', minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {plans.length === 0 ? <p style={{ color: '#64748b' }}>No plans created yet.</p> : plans.map((plan) => (
                  <div key={plan._id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a' }}>{plan.title}</h4>
                      <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b' }}>{plan.description}</p>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>ROI: {plan.roi}</span>
                        <span style={{ backgroundColor: '#f8fafc', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Risk: {plan.riskLevel}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeletePlan(plan._id)} style={{ padding: '8px 16px', backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', maxWidth: '600px' }}>
              <h3 style={{ margin: '0 0 24px 0', color: '#0f172a', fontSize: '18px' }}>System Administrator Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Master Account</p>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '16px', fontWeight: '500' }}>{adminEmail}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Access Level</p>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '16px', fontWeight: '500' }}>Super Admin (Unrestricted)</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* EDIT MODAL */}
      {editingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: '0 0 24px 0', color: '#0f172a' }}>Edit User</h2>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Name</label>
                <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Email</label>
                <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Cash Balance ($)</label>
                  <input type="number" value={editFormData.balance} onChange={(e) => setEditFormData({...editFormData, balance: parseFloat(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#059669', marginBottom: '4px' }}>Invested ($)</label>
                  <input type="number" value={editFormData.investment} onChange={(e) => setEditFormData({...editFormData, investment: parseFloat(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Role</label>
                  <select value={editFormData.role} onChange={(e) => setEditFormData({...editFormData, role: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Risk Profile</label>
                  <select value={editFormData.riskProfile} onChange={(e) => setEditFormData({...editFormData, riskProfile: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="Conservative">Conservative</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Aggressive">Aggressive</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setEditingUser(null)} style={{ padding: '10px 16px', backgroundColor: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;