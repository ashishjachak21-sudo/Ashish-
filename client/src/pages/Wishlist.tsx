import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';
import './Wishlist.css';

const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await userAPI.getWishlist();
      setWishlist(res.data.wishlist);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await userAPI.removeFromWishlist(productId);
      setWishlist(wishlist.filter((item: any) => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  if (loading) {
    return <div className="container"><p>Loading wishlist...</p></div>;
  }

  return (
    <div className="wishlist-page container">
      <h1>My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <p>Your wishlist is empty</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {wishlist.map((product: any) => (
            <div key={product._id} className="product-card">
              <button
                className="remove-btn"
                onClick={() => handleRemove(product._id)}
              >
                <FiTrash2 />
              </button>
              <Link to={`/products/${product._id}`}>
                <div className="product-image">
                  <img
                    src={product.images[0]?.url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="rating">
                    <span>⭐ {product.rating.average.toFixed(1)}</span>
                    <span>({product.rating.count})</span>
                  </div>
                  <div className="price">
                    <span className="current-price">${product.price.toFixed(2)}</span>
                  </div>
                  <p className="stock-status">
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
