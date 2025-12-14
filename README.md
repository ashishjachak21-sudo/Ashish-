# E-Commerce Marketplace Platform

A full-featured e-commerce marketplace platform similar to Amazon, Shopify, and Flipkart. Built with **Node.js**, **Express**, **MongoDB**, **React**, and **TypeScript**.

## 🚀 Features

### Customer Features
- **User Authentication**: Register, login, JWT-based authentication
- **Product Browsing**: Search, filter, sort products by category, price, rating
- **Product Details**: View detailed product information, images, specifications, reviews
- **Shopping Cart**: Add to cart, update quantities, remove items
- **Wishlist**: Save favorite products for later
- **Checkout**: Secure checkout process with multiple payment options
- **Order Management**: View order history, track orders, cancel orders
- **Product Reviews**: Rate and review purchased products
- **User Profile**: Manage personal information and addresses

### Seller Features
- **Seller Dashboard**: Manage products and view sales
- **Product Management**: Create, update, delete products
- **Inventory Management**: Track stock levels
- **Order Fulfillment**: View and process orders

### Admin Features
- **Admin Dashboard**: Complete site overview and analytics
- **User Management**: Manage all users, activate/deactivate accounts
- **Product Management**: Approve/reject products, manage categories
- **Order Management**: View all orders, update order status
- **Analytics**: View sales reports and statistics

### Technical Features
- **Responsive Design**: Mobile-first, works on all devices
- **RESTful API**: Clean API architecture
- **JWT Authentication**: Secure authentication system
- **Role-Based Access Control**: Customer, Seller, Admin roles
- **Search & Filters**: Advanced product search and filtering
- **Pagination**: Efficient data loading
- **Image Management**: Support for multiple product images
- **Payment Integration**: Stripe payment gateway ready
- **Security**: Helmet, rate limiting, CORS, input validation
- **State Management**: Zustand for React state management
- **TypeScript**: Type-safe frontend code

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd ecommerce-marketplace
```

### 2. Install dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd client
npm install
cd ..
```

Or install all at once:
```bash
npm run install-all
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce-marketplace

# JWT Secret
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

# Stripe Payment (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Frontend URL
CLIENT_URL=http://localhost:3000
```

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# MacOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 5. Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

## 🚀 Running the Application

### Development Mode

**Run both frontend and backend:**
```bash
npm run dev
```

**Or run separately:**

Backend:
```bash
npm run server
```

Frontend:
```bash
npm run client
```

### Production Mode

Build the frontend:
```bash
npm run build
```

Start the server:
```bash
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search` - Search products
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (Seller/Admin)
- `PUT /api/products/:id` - Update product (Seller/Admin)
- `DELETE /api/products/:id` - Delete product (Seller/Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove from cart
- `DELETE /api/cart/clear` - Clear cart
- `POST /api/cart/apply-coupon` - Apply coupon code

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/cancel` - Cancel order

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark review as helpful

### User
- `GET /api/users/wishlist` - Get wishlist
- `POST /api/users/wishlist/:productId` - Add to wishlist
- `DELETE /api/users/wishlist/:productId` - Remove from wishlist
- `GET /api/users/addresses` - Get addresses
- `POST /api/users/addresses` - Add address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/toggle-status` - Toggle user status
- `GET /api/admin/products/pending` - Get pending products
- `PUT /api/admin/products/:id/approve` - Approve product

## 🏗️ Project Structure

```
ecommerce-marketplace/
├── server/
│   ├── models/           # Mongoose models
│   ├── controllers/      # Route controllers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Express server setup
├── client/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       ├── store/       # State management
│       ├── App.tsx      # Main App component
│       └── index.tsx    # Entry point
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore file
├── package.json        # Dependencies
└── README.md          # Documentation
```

## 🔐 User Roles

### Customer
- Browse and purchase products
- Manage cart and wishlist
- Place and track orders
- Write product reviews

### Seller
- All customer features
- Create and manage products
- View sales and orders
- Manage inventory

### Admin
- All seller features
- Manage all users
- Manage categories
- Approve products
- View analytics
- Manage orders

## 🎨 Frontend Routes

- `/` - Home page
- `/products` - Products listing
- `/products/:id` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/login` - Login page
- `/register` - Register page
- `/profile` - User profile
- `/orders` - Order history
- `/orders/:id` - Order details
- `/wishlist` - Wishlist
- `/seller/*` - Seller dashboard (Protected)
- `/admin/*` - Admin dashboard (Protected)

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📦 Deployment

### Backend Deployment (Heroku, Railway, etc.)
1. Set environment variables
2. Deploy the application
3. Ensure MongoDB is accessible

### Frontend Deployment (Vercel, Netlify, etc.)
1. Build the frontend: `npm run build`
2. Deploy the `client/build` directory
3. Set `REACT_APP_API_URL` to your backend URL

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Ashish**

## 🙏 Acknowledgments

- Express.js
- React
- MongoDB
- Mongoose
- Stripe
- TypeScript
- Zustand

## 📞 Support

For support, email support@shophub.com or open an issue in the repository.

---

Built with ❤️ by Ashish
