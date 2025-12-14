import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { FiTrash2 } from 'react-icons/fi';
import './Cart.css';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some products to get started</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1>Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.product._id} className="cart-item">
              <img
                src={item.product.images[0]?.url || 'https://via.placeholder.com/150'}
                alt={item.product.name}
              />
              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p className="item-price">${item.price.toFixed(2)}</p>
              </div>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                  +
                </button>
              </div>
              <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
              <button
                className="remove-btn"
                onClick={() => removeItem(item.product._id)}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{getTotal() > 50 ? 'FREE' : '$5.00'}</span>
          </div>
          <div className="summary-row">
            <span>Tax (10%)</span>
            <span>${(getTotal() * 0.1).toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>
              ${(getTotal() + (getTotal() > 50 ? 0 : 5) + getTotal() * 0.1).toFixed(2)}
            </span>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          <Link to="/products" className="btn btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
