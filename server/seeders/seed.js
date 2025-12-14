const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-marketplace';

const categories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    image: 'https://via.placeholder.com/300/0000FF/FFFFFF?text=Electronics'
  },
  {
    name: 'Clothing',
    description: 'Fashion and apparel',
    image: 'https://via.placeholder.com/300/FF0000/FFFFFF?text=Clothing'
  },
  {
    name: 'Books',
    description: 'Books and reading materials',
    image: 'https://via.placeholder.com/300/00FF00/FFFFFF?text=Books'
  },
  {
    name: 'Home & Kitchen',
    description: 'Home and kitchen essentials',
    image: 'https://via.placeholder.com/300/FFFF00/000000?text=Home+Kitchen'
  },
  {
    name: 'Sports',
    description: 'Sports equipment and accessories',
    image: 'https://via.placeholder.com/300/FF00FF/FFFFFF?text=Sports'
  },
  {
    name: 'Beauty',
    description: 'Beauty and personal care',
    image: 'https://via.placeholder.com/300/00FFFF/000000?text=Beauty'
  }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Seller One',
    email: 'seller@example.com',
    password: 'seller123',
    role: 'seller'
  },
  {
    name: 'John Customer',
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer'
  }
];

const seed = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('✅ Cleared existing data');

    console.log('👥 Creating users...');
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    const seller = createdUsers.find(u => u.role === 'seller');

    console.log('📁 Creating categories...');
    const createdCategories = await Category.create(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    console.log('📦 Creating sample products...');
    const products = [];

    createdCategories.forEach((category, index) => {
      for (let i = 1; i <= 5; i++) {
        products.push({
          name: `${category.name} Product ${i}`,
          description: `High-quality ${category.name.toLowerCase()} product. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Perfect for your needs with excellent features and durability.`,
          price: Math.floor(Math.random() * 500) + 50,
          category: category._id,
          brand: ['Samsung', 'Apple', 'Nike', 'Adidas', 'Sony'][Math.floor(Math.random() * 5)],
          images: [
            {
              url: `https://via.placeholder.com/500/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${category.name}+${i}`,
              alt: `${category.name} Product ${i}`,
              isMain: true
            },
            {
              url: `https://via.placeholder.com/500/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${category.name}+${i}+Alt`,
              alt: `${category.name} Product ${i} Alt`,
              isMain: false
            }
          ],
          stock: Math.floor(Math.random() * 100) + 10,
          sku: `SKU-${category.name.substring(0, 3).toUpperCase()}-${i}${Math.floor(Math.random() * 1000)}`,
          seller: seller._id,
          specifications: [
            { key: 'Weight', value: `${Math.floor(Math.random() * 10) + 1} kg` },
            { key: 'Dimensions', value: '30x20x15 cm' },
            { key: 'Material', value: 'Premium Quality' }
          ],
          tags: [category.name.toLowerCase(), 'featured', 'best-seller'],
          rating: {
            average: (Math.random() * 2 + 3).toFixed(1),
            count: Math.floor(Math.random() * 100) + 10
          },
          isFeatured: Math.random() > 0.7,
          discount: Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 10 : 0,
          isActive: true
        });
      }
    });

    const createdProducts = await Product.create(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('');
    console.log('✨ Seed completed successfully!');
    console.log('');
    console.log('👥 Sample users created:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   Seller: seller@example.com / seller123');
    console.log('   Customer: customer@example.com / customer123');
    console.log('');
    console.log(`📁 Categories: ${createdCategories.length}`);
    console.log(`📦 Products: ${createdProducts.length}`);
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seed();
