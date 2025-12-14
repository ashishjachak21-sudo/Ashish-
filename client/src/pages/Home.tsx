import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import toast from 'react-hot-toast';
import './Home.css';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productAPI.getFeatured(),
          categoryAPI.getAll()
        ]);
        setFeaturedProducts(productsRes.data.products);
        setCategories(categoriesRes.data.categories.slice(0, 8));
      } catch (error: any) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to ShopHub</h1>
            <p>Discover amazing products at unbeatable prices</p>
            <Link to="/products" className="btn btn-primary">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category: any) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="category-card"
              >
                <img src={category.image} alt={category.name} />
                <h3>{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map((product: any) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="product-card"
              >
                <div className="product-image">
                  <img
                    src={product.images[0]?.url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                  />
                  {product.discount > 0 && (
                    <span className="discount-badge">{product.discount}% OFF</span>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="rating">
                    <span>⭐ {product.rating.average.toFixed(1)}</span>
                    <span>({product.rating.count})</span>
                  </div>
                  <div className="price">
                    <span className="current-price">${product.finalPrice.toFixed(2)}</span>
                    {product.discount > 0 && (
                      <span className="original-price">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>On orders over $50</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💳</div>
              <h3>Secure Payment</h3>
              <p>100% secure transactions</p>
            </div>
            <div className="feature">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎧</div>
              <h3>24/7 Support</h3>
              <p>Dedicated customer service</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
