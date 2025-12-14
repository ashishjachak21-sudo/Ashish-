import React from 'react';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard container">
      <h1>Admin Dashboard</h1>
      <p>Manage users, products, orders, and site settings.</p>
      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">$0.00</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
