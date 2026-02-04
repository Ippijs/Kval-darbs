-- FishingGear Pro - Database SQL Script
-- Run this in XAMPP phpMyAdmin to set up the complete database

-- Create Database
CREATE DATABASE IF NOT EXISTS `KvalDB`;
USE `KvalDB`;

-- =====================================================
-- Create Users Table
-- =====================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100),
  `last_name` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Create Products Table
-- =====================================================
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `description` TEXT,
  `image` VARCHAR(255),
  `stock` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Create Cart Table
-- =====================================================
CREATE TABLE IF NOT EXISTS `cart` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT DEFAULT 1,
  `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Create Orders Table
-- =====================================================
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `total_price` DECIMAL(10, 2) NOT NULL,
  `status` VARCHAR(20) DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Create Order Items Table
-- =====================================================
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Insert Sample User (for testing)
-- =====================================================
-- Password is 'admin123' (hashed with bcrypt)
INSERT INTO `users` (`username`, `email`, `password`, `first_name`, `last_name`) VALUES
('admin', 'admin@gmail.com', '$2y$10$ZYmDhoyxkLK87wqNG22fo.EviF4ilB4TSgtWZajZcRbcS/h4lIIhS', 'Admin', 'User');

-- =====================================================
-- Insert Sample Products - Fishing Gear
-- =====================================================
INSERT INTO `products` (`name`, `category`, `price`, `description`, `image`, `stock`) VALUES
('Fishing Rod - Spincast', 'rods', 49.99, 'Perfect for beginners. Durable spincast fishing rod 5.5ft long', 'rod1.jpg', 15),
('Fishing Rod - Baitcasting', 'rods', 89.99, 'Professional baitcasting rod for advanced anglers. 6ft length', 'rod2.jpg', 10),
('Spinning Reel 2500', 'reels', 34.99, 'Smooth spinning reel with 5 bearings. Perfect for freshwater', 'reel1.jpg', 20),
('Baitcasting Reel Pro', 'reels', 79.99, 'High-speed baitcasting reel for saltwater fishing', 'reel2.jpg', 12),
('Fishing Line 300m', 'line', 12.99, 'Braided fishing line 20lb test strength', 'line1.jpg', 30),
('Fishing Lures Set', 'lures', 24.99, 'Assorted pack of 10 realistic fishing lures', 'lures1.jpg', 25),
('Fishing Net', 'nets', 29.99, 'Landing net with rubber mesh. Extends to 6ft', 'net1.jpg', 18),
('Tackle Box', 'storage', 44.99, 'Waterproof tackle box with compartments for organization', 'box1.jpg', 14),
('Fishing Hooks Set', 'hooks', 9.99, 'Assorted pack of 50 stainless steel hooks', 'hooks1.jpg', 40),
('Fishing Weights Assorted', 'weights', 7.99, 'Mix of sinker weights for different fishing conditions', 'weights1.jpg', 35),
('Fishing Gloves Neoprene', 'clothing', 19.99, 'Warm neoprene gloves for cold water fishing', 'gloves1.jpg', 22),
('Fishing Backpack', 'storage', 54.99, 'Waterproof fishing backpack with multiple compartments', 'backpack1.jpg', 16);

-- =====================================================
-- Create Contact Messages Table
-- =====================================================
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Create Indexes for Better Performance
-- =====================================================
CREATE INDEX idx_user_cart ON `cart`(`user_id`);
CREATE INDEX idx_product_cart ON `cart`(`product_id`);
CREATE INDEX idx_user_orders ON `orders`(`user_id`);
CREATE INDEX idx_order_items ON `order_items`(`order_id`);
CREATE INDEX idx_category ON `products`(`category`);
CREATE INDEX idx_username ON `users`(`username`);
CREATE INDEX idx_email ON `users`(`email`);

-- =====================================================
-- Database Setup Complete
-- =====================================================
-- Now you can use the application!
