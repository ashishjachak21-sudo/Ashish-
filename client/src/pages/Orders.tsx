import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import './Orders.css';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getMyOrders();
      setOrders(res.data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return <div className="container"><p>Loading orders...</p></div>;
  }

  return (
    <div className="orders-page container">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet</p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order: any) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.orderNumber}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                >
                  {order.orderStatus}
                </span>
              </div>
              <div className="order-items">
                {order.items.slice(0, 3).map((item: any) => (
                  <div key={item._id} className="order-item-preview">
                    <img
                      src={item.image || 'https://via.placeholder.com/60'}
                      alt={item.name}
                    />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <span className="more-items">+{order.items.length - 3} more</span>
                )}
              </div>
              <div className="order-footer">
                <p className="order-total">
                  Total: <strong>${order.pricing.total.toFixed(2)}</strong>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
