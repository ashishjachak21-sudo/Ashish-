import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, reviewAPI, userAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const addToCart = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await productAPI.getById(id!);
      setProduct(res.data.product);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await reviewAPI.getProductReviews(id!);
      setReviews(res.data.reviews);
    } catch (error) {
      console.error('Failed to load reviews');
    }
  };

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error('Product is out of stock');
      return;
    }

    addToCart({
      _id: product._id,
      product: product,
      quantity,
      price: product.finalPrice
    });

    toast.success('Added to cart');
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    try {
      await userAPI.addToWishlist(product._id);
      toast.success('Added to wishlist');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  if (!product) {
    return <div className="container"><p>Product not found</p></div>;
  }

  return (
    <div className="product-detail container">
      <div className="product-main">
        <div className="product-gallery">
          <div className="main-image">
            <img
              src={product.images[selectedImage]?.url || 'https://via.placeholder.com/500'}
              alt={product.name}
            />
          </div>
          <div className="thumbnail-list">
            {product.images.map((img: any, index: number) => (
              <img
                key={index}
                src={img.url}
                alt={`${product.name} ${index + 1}`}
                className={selectedImage === index ? 'active' : ''}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="product-details">
          <h1>{product.name}</h1>
          
          <div className="rating-section">
            <span className="rating">⭐ {product.rating.average.toFixed(1)}</span>
            <span className="review-count">({product.rating.count} reviews)</span>
          </div>

          <div className="price-section">
            <span className="current-price">${product.finalPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <>
                <span className="original-price">${product.price.toFixed(2)}</span>
                <span className="discount-badge">{product.discount}% OFF</span>
              </>
            )}
          </div>

          <div className="stock-info">
            {product.inStock ? (
              <span className="in-stock">In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          <p className="description">{product.description}</p>

          {product.specifications && product.specifications.length > 0 && (
            <div className="specifications">
              <h3>Specifications</h3>
              <ul>
                {product.specifications.map((spec: any, index: number) => (
                  <li key={index}>
                    <strong>{spec.key}:</strong> {spec.value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button className="btn btn-outline" onClick={handleAddToWishlist}>
              <FiHeart /> Add to Wishlist
            </button>
          </div>

          <div className="product-meta">
            <p><strong>Brand:</strong> {product.brand || 'N/A'}</p>
            <p><strong>SKU:</strong> {product.sku || 'N/A'}</p>
            <p><strong>Category:</strong> {product.category?.name || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review: any) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <img
                      src={review.user.avatar || 'https://via.placeholder.com/50'}
                      alt={review.user.name}
                    />
                    <div>
                      <h4>{review.user.name}</h4>
                      <span className="review-rating">⭐ {review.rating}</span>
                    </div>
                  </div>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.title && <h3>{review.title}</h3>}
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
