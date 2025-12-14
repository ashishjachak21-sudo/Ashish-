import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import toast from 'react-hot-toast';
import './Products.css';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, category, search, sort, minPrice, maxPrice]);

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data.categories);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = { page, sort };
      if (category) params.category = category;
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await productAPI.getAll(params);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="products-page container">
      <div className="filters-sidebar">
        <h3>Filters</h3>

        <div className="filter-group">
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => updateFilter('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <h4>Sort By</h4>
          <select value={sort} onChange={(e) => updateFilter('sort', e.target.value)}>
            <option value="-createdAt">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-rating.average">Top Rated</option>
            <option value="-sold">Best Selling</option>
          </select>
        </div>

        <div className="filter-group">
          <h4>Price Range</h4>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => updateFilter('minPrice', e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
            />
          </div>
        </div>

        <button
          className="btn btn-outline"
          onClick={() => setSearchParams({})}
        >
          Clear Filters
        </button>
      </div>

      <div className="products-content">
        <div className="products-header">
          <h1>Products</h1>
          <p>Showing {products.length} products</p>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <>
            <div className="products-grid">
              {products.map((product: any) => (
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
                    {!product.inStock && (
                      <span className="out-of-stock-badge">Out of Stock</span>
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

            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`page-btn ${p === page ? 'active' : ''}`}
                    onClick={() => updateFilter('page', p.toString())}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
