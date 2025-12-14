import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import './Header.css';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>ShopHub</h1>
          </Link>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FiSearch />
            </button>
          </form>

          <nav className={`nav ${showMenu ? 'show' : ''}`}>
            <Link to="/products">Products</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/wishlist" className="icon-link">
                  <FiHeart />
                  <span>Wishlist</span>
                </Link>
                <Link to="/cart" className="icon-link">
                  <FiShoppingCart />
                  <span>Cart</span>
                  {itemCount > 0 && <span className="badge">{itemCount}</span>}
                </Link>
                <div className="dropdown">
                  <button className="icon-link">
                    <FiUser />
                    <span>{user?.name}</span>
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/profile">Profile</Link>
                    <Link to="/orders">Orders</Link>
                    {(user?.role === 'seller' || user?.role === 'admin') && (
                      <Link to="/seller">Seller Dashboard</Link>
                    )}
                    {user?.role === 'admin' && (
                      <Link to="/admin">Admin Dashboard</Link>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/cart" className="icon-link">
                  <FiShoppingCart />
                  <span>Cart</span>
                  {itemCount > 0 && <span className="badge">{itemCount}</span>}
                </Link>
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
              </>
            )}
          </nav>

          <button className="menu-toggle" onClick={() => setShowMenu(!showMenu)}>
            <FiMenu />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
