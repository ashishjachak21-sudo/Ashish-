import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import './OrderDetail.css';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await orderAPI.getById(id!);
      setOrder(res.data.order);
    } catch (error) {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading order...</p></div>;
  }

  if (!order) {
    return <div className="container"><p>Order not found</p></div>;
  }

  return (
    <div className="order-detail container">
      <h1>Order Details</h1>

      <div className="order-info-grid">
        <div className="info-card">
          <h3>Order Information</h3>
          <p><strong>Order Number:</strong> {order.orderNumber}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> <span className="status-badge">{order.orderStatus}</span></p>
          <p><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</p>
        </div>

        <div className="info-card">
          <h3>Shipping Address</h3>
          <p>{order.shippingAddress.name}</p>
          <p>{order.shippingAddress.phone}</p>
          <p>{order.shippingAddress.addressLine1}</p>
          {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
          <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
          <p>{order.shippingAddress.country} - {order.shippingAddress.zipCode}</p>
        </div>
      </div>

      <div className="order-items-section">
        <h2>Order Items</h2>
        <div className="order-items-list">
          {order.items.map((item: any) => (
            <div key={item._id} className="order-item">
              <img
                src={item.image || 'https://via.placeholder.com/100'}
                alt={item.name}
              />
              <div className="item-details">
                <h4>{item.name}</h4>
                <p>Quantity: {item.quantity}</p>
              </div>
              <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="order-summary-section">
        <h2>Order Summary</h2>
        <div className="summary-rows">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${order.pricing.subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>${order.pricing.shipping.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>${order.pricing.tax.toFixed(2)}</span>
          </div>
          {order.pricing.discount > 0 && (
            <div className="summary-row">
              <span>Discount</span>
              <span className="discount">-${order.pricing.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>Total</span>
            <span>${order.pricing.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
