import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="seller-dashboard container">
      <h1>Seller Dashboard</h1>
      <p>Manage your products, orders, and sales here.</p>
      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p className="stat-value">$0.00</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-value">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
