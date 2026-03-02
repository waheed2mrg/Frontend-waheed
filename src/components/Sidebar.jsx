import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, userEmail, handleLogout, role }) => {

  const getSidebarItemStyle = (tabName) => ({
    padding: '12px 20px',
    margin: '4px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: activeTab === tabName ? '#059669' : '#475569',
    backgroundColor: activeTab === tabName ? '#ecfdf5' : 'transparent',
    fontWeight: activeTab === tabName ? '600' : '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  });

  return (
    <div
      style={{
        width: '260px',
        backgroundColor: 'white',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10
      }}
    >
      {/* Sidebar Logo */}
      <div
        style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '16px'
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#059669',
            borderRadius: '8px'
          }}
        ></div>
        <h2
          style={{
            margin: 0,
            color: '#0f172a',
            fontSize: '20px',
            fontWeight: '700'
          }}
        >
          Wahed Clone
        </h2>
      </div>

      {/* Role-Based Navigation */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {role === 'admin' ? (
          <>
            <div
              onClick={() => setActiveTab('users')}
              style={getSidebarItemStyle('users')}
            >
              <span>👥</span> Manage Users
            </div>

            <div
              onClick={() => setActiveTab('investments')}
              style={getSidebarItemStyle('investments')}
            >
              <span>📈</span> Investment Plans
            </div>

            <div
              onClick={() => setActiveTab('settings')}
              style={getSidebarItemStyle('settings')}
            >
              <span>⚙️</span> System Settings
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => setActiveTab('overview')}
              style={getSidebarItemStyle('overview')}
            >
              <span>📊</span> Overview
            </div>

            <div
              onClick={() => setActiveTab('portfolio')}
              style={getSidebarItemStyle('portfolio')}
            >
              <span>💼</span> Portfolio
            </div>

            <div
              onClick={() => setActiveTab('investments')}
              style={getSidebarItemStyle('investments')}
            >
              <span>📈</span> Invest Options
            </div>

            <div
              onClick={() => setActiveTab('funding')}
              style={getSidebarItemStyle('funding')}
            >
              <span>💸</span> Funding
            </div>

            <div
              onClick={() => setActiveTab('settings')}
              style={getSidebarItemStyle('settings')}
            >
              <span>⚙️</span> Settings
            </div>
          </>
        )}
      </div>

      {/* User Info & Logout */}
      <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0' }}>
        <p
          style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {userEmail}
        </p>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '10px 16px',
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = '#fecaca')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = '#fee2e2')
          }
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;