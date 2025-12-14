# Quick Setup Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (running locally or connection string)
- npm or yarn

## Installation Steps

### 1. Install Backend Dependencies
```bash
npm install
```

### 2. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 3. Configure Environment
The `.env` files are already created with default values. Update if needed:
- Root `.env` - Backend configuration
- `client/.env` - Frontend API URL

### 4. Start MongoDB
Make sure MongoDB is running:
```bash
# MacOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB

# Or use MongoDB Atlas connection string in .env
```

### 5. Seed Database (Optional but Recommended)
```bash
npm run seed
```

This creates:
- Sample categories (Electronics, Clothing, Books, etc.)
- 30 sample products
- 3 test users:
  - Admin: admin@example.com / admin123
  - Seller: seller@example.com / seller123
  - Customer: customer@example.com / customer123

### 6. Run the Application

**Development mode (both frontend & backend):**
```bash
npm run dev
```

**Or run separately:**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### 7. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Quick Test
1. Go to http://localhost:3000
2. Browse products or register a new account
3. Login with one of the seeded accounts
4. Add products to cart
5. Complete checkout
6. View orders

## Features Available

### Customer Features
✅ Browse and search products
✅ Filter by category, price, rating
✅ View product details and reviews
✅ Add to cart and wishlist
✅ Checkout and place orders
✅ Track order history
✅ Manage profile and addresses

### Seller Features
✅ All customer features
✅ Create and manage products
✅ View sales dashboard
✅ Manage inventory

### Admin Features
✅ All seller features
✅ User management
✅ Category management
✅ Order management
✅ Analytics dashboard
✅ Product approval

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Try: `mongodb://127.0.0.1:27017/ecommerce-marketplace`

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Create .env.local with PORT=3001

### CORS Issues
- Check CLIENT_URL in backend .env matches frontend URL
- Restart both servers after env changes

## Next Steps
- Configure Stripe for real payments
- Set up Cloudinary for image uploads
- Configure email service for notifications
- Customize branding and styling
- Add more products and categories
- Deploy to production

## Support
For issues or questions, refer to README.md
