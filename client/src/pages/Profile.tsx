import React from 'react';
import { useAuthStore } from '../store/authStore';
import './Profile.css';

const Profile: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="profile-page container">
      <h1>My Profile</h1>
      <div className="profile-card">
        <div className="profile-avatar">
          <img
            src={user?.avatar || 'https://via.placeholder.com/150'}
            alt={user?.name}
          />
        </div>
        <div className="profile-info">
          <div className="info-row">
            <label>Name:</label>
            <span>{user?.name}</span>
          </div>
          <div className="info-row">
            <label>Email:</label>
            <span>{user?.email}</span>
          </div>
          <div className="info-row">
            <label>Role:</label>
            <span className="role-badge">{user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
