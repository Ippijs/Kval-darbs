# FishingGear Pro - E-Shop for Fishing Gear

Welcome to FishingGear Pro, a complete e-commerce solution for selling premium fishing gear!

## Features

- **Product Catalog** - Browse through a wide selection of fishing equipment organized by category
- **User Authentication** - Secure registration and login system
- **Shopping Cart** - Add, update, and remove items from your cart
- **Checkout System** - Complete checkout with billing information and payment options
- **Order Management** - View past orders and order details
- **Product Search** - Search for products by name or description
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Admin Ready** - Database structure supports future admin panel expansion

## Installation & Setup

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache, Nginx, etc.)
- Modern web browser

### Step 1: Database Setup

1. Open your MySQL client (phpMyAdmin, MySQL Workbench, or command line)
2. Navigate to the Backend folder and run `db_init.php` in your browser:
   ```
   http://localhost/Kval%20darbs/Backend/db_init.php
   ```
   This will create the database, tables, and sample products automatically.

### Step 2: Configuration

Edit `Backend/config.php` if needed to match your database credentials:
```php
define('DB_HOST', 'localhost');  // Your database host
define('DB_USER', 'root');       // Your database user
define('DB_PASS', '');           // Your database password
define('DB_NAME', 'fishing_shop'); // Database name
```

### Step 3: Create Images Directory

Create a folder named `images` in the root directory to store product images:
```
mkdir images
```

### Step 4: Run the Application

1. Start your web server
2. Navigate to: `http://localhost/Kval%20darbs/`
3. The shop is ready to use!

## Project Structure

```
Kval darbs/
├── index.php                 # Main entry point
├── style.css                 # Main stylesheet
├── api.php                   # API endpoints for AJAX
├── Backend/
│   ├── config.php            # Database configuration
│   ├── db_init.php           # Database initialization script
│   ├── auth.php              # Authentication functions
│   ├── products.php          # Product management functions
│   ├── cart.php              # Shopping cart functions
│   └── orders.php            # Order management functions
├── Frontend/
│   ├── home.php              # Product listing page
│   ├── product.php           # Product detail page
│   ├── cart.php              # Shopping cart page
│   ├── checkout.php          # Checkout page
│   ├── login.php             # Login page
│   ├── register.php          # Registration page
│   ├── logout.php            # Logout page
│   ├── orders.php            # Order history page
│   ├── profile.php           # User profile page
│   ├── about.php             # About page
│   └── contact.php           # Contact page
└── images/                   # Product images directory
```

## Database Schema

### Users Table
- Stores user account information
- Fields: id, username, email, password, first_name, last_name, created_at

### Products Table
- Contains all fishing gear products
- Fields: id, name, category, price, description, image, stock, created_at

### Cart Table
- Temporary storage for user shopping carts
- Fields: id, user_id, product_id, quantity, added_at

### Orders Table
- Stores completed orders
- Fields: id, user_id, total_price, status, created_at

### Order Items Table
- Individual items in each order
- Fields: id, order_id, product_id, quantity, price

## Default Products

The system comes with 12 sample fishing gear products:
- Fishing Rods (Spincast, Baitcasting)
- Fishing Reels (Spinning, Baitcasting)
- Fishing Line
- Lures & Baits
- Hooks & Weights
- Tackle Storage
- Fishing Clothing

## Usage Guide

### For Customers

1. **Browse Products**
   - Visit the shop homepage to see all products
   - Use categories to filter by product type
   - Use search to find specific items

2. **View Product Details**
   - Click "View Details" on any product
   - See full description, pricing, and stock information
   - Add items to cart with desired quantity

3. **Shopping Cart**
   - Update quantities or remove items as needed
   - View total price including shipping information

4. **Checkout**
   - Enter billing information
   - Select payment method
   - Place order

5. **Order History**
   - View all past orders
   - Click on order to see detailed information

### For Developers

To add new features:

1. **Add Products Programmatically**
   ```php
   require_once 'Backend/products.php';
   $product = get_product_by_id(1);
   ```

2. **Extend Cart Functionality**
   ```php
   require_once 'Backend/cart.php';
   add_to_cart($user_id, $product_id, $quantity);
   ```

3. **Customize Database**
   - Edit `Backend/db_init.php` to modify products or schema
   - Run it again to apply changes

## Color Scheme

- **Primary Color**: #1a5f7a (Deep Blue)
- **Secondary Color**: #f39c12 (Orange)
- **Success Color**: #27ae60 (Green)
- **Danger Color**: #e74c3c (Red)
- **Background**: #f5f5f5 (Light Gray)

## Security Considerations

- Passwords are hashed with BCrypt
- SQL prepared statements prevent SQL injection
- Session-based authentication
- User input validation

## Future Enhancements

- Admin panel for product management
- Payment gateway integration (Stripe, PayPal)
- Order tracking
- Customer reviews and ratings
- Wishlist functionality
- Email notifications
- Advanced analytics

## Troubleshooting

**Database Connection Error**
- Verify MySQL is running
- Check config.php credentials
- Run db_init.php again

**Images Not Loading**
- Ensure `images` folder exists
- Check image filenames match product data
- Place product images in the images folder

**Session Issues**
- Clear browser cookies
- Verify PHP session configuration
- Check file permissions

## Support

For issues or questions, contact: kristersmateuss@gmail.com

## License

This project is provided as-is for educational purposes.

---

**Version**: 1.0
**Last Updated**: January 21, 2026
**Author**: FishingGear Pro Team
