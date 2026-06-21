const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/productModel");
const User = require("./models/userModel");
const dns = require("dns");

// Force Google DNS for SRV record resolution
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Load environment variables
dotenv.config({ path: "./config/.env" });

const dbUri = process.env.DB_URI || process.env.MONGODB_URI || process.env.DB_URL;

if (!dbUri) {
  console.error("Database connection URI is not defined in env!");
  process.exit(1);
}

const sampleProducts = [
  {
    name: "Zenith Wireless Headphones",
    price: 4999,
    description: "Experience premium active noise-cancelling sound with long-lasting 40-hour battery life and memory foam comfort.",
    ratings: 4.5,
    images: [
      {
        public_id: "sample_headphone",
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
      }
    ],
    category: "Electronics",
    Stock: 15,
    numOfReviews: 0,
  },
  {
    name: "Minimalist Leather Watch",
    price: 2499,
    description: "Classic design with a genuine leather strap and waterproof stainless steel casing.",
    ratings: 4.0,
    images: [
      {
        public_id: "sample_watch",
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
      }
    ],
    category: "Accessories",
    Stock: 25,
    numOfReviews: 0,
  },
  {
    name: "Ultra-Light Running Shoes",
    price: 3999,
    description: "Breathable knit running shoes with impact cushioning and durable traction soles.",
    ratings: 4.7,
    images: [
      {
        public_id: "sample_shoes",
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
      }
    ],
    category: "Footwear",
    Stock: 50,
    numOfReviews: 0,
  },
  {
    name: "Ergonomic Smart Desk Lamp",
    price: 1899,
    description: "Adjustable brightness and color temperatures with built-in wireless phone charger.",
    ratings: 4.2,
    images: [
      {
        public_id: "sample_lamp",
        url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60",
      }
    ],
    category: "Electronics",
    Stock: 10,
    numOfReviews: 0,
  }
];

const seedProducts = async () => {
  try {
    // 1. Connect to DB
    console.log("Connecting to database...");
    await mongoose.connect(dbUri);
    console.log("Database connected successfully.");

    // 2. Ensure an Admin user exists (since products require a user reference)
    let admin = await User.findOne({ role: "admin" });
    if (!admin) {
      console.log("No admin user found. Creating a default admin user...");
      admin = await User.create({
        name: "Admin User",
        email: "admin@zenithmart.com",
        password: "adminpassword123", // Encrypted pre-save in model
        avatar: {
          public_id: "default_admin_avatar",
          url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60",
        },
        role: "admin",
      });
      console.log(`Default admin created: ${admin.email}`);
    }

    // 3. Clear existing products (optional, comment out if you want to keep them)
    console.log("Clearing existing products...");
    await Product.deleteMany();
    console.log("Existing products cleared.");

    // 4. Attach admin id to each product and insert
    const productsWithUser = sampleProducts.map((product) => ({
      ...product,
      user: admin._id,
    }));

    console.log("Inserting products...");
    await Product.insertMany(productsWithUser);
    console.log("All products seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedProducts();
