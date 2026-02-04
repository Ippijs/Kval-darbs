<?php
session_start();
require_once 'Backend/auth.php';
require_once 'Backend/config.php';
require_once 'Backend/products.php';
require_once 'Backend/cart.php';
require_once 'Backend/orders.php';

$page = isset($_GET['page']) ? $_GET['page'] : 'home';
$category = isset($_GET['category']) ? $_GET['category'] : null;
$search = isset($_GET['search']) ? $_GET['search'] : null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FishingGear Pro - Your Premium Fishing Shop</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <div class="navbar-brand">
                <a href="index.php" class="logo">🎣 FishingGear Pro</a>
            </div>
            <ul class="nav-links">
                <li><a href="index.php">Shop</a></li>
                <li><a href="index.php?page=about">About</a></li>
                <li><a href="index.php?page=contact">Contact</a></li>
                <?php if (is_logged_in()): ?>
                    <li><a href="index.php?page=cart">Cart (<?php 
                        $user_id = get_current_user_id();
                        $count = count(get_cart_items($user_id)); 
                        echo $count;
                    ?>)</a></li>
                    <li><a href="index.php?page=orders">My Orders</a></li>
                    <?php if (is_admin()): ?>
                        <li><a href="index.php?page=admin" style="color: var(--secondary-color);">Admin</a></li>
                    <?php endif; ?>
                    <li><a href="index.php?page=profile"><?php echo $_SESSION['username']; ?></a></li>
                    <li><a href="index.php?page=logout">Logout</a></li>
                <?php else: ?>
                    <li><a href="index.php?page=login">Login</a></li>
                    <li><a href="index.php?page=register">Register</a></li>
                <?php endif; ?>
            </ul>
        </div>
    </nav>

    <div class="container">
        <?php
        switch($page) {
            case 'home':
                include 'Frontend/home.php';
                break;
            case 'product':
                include 'Frontend/product.php';
                break;
            case 'cart':
                include 'Frontend/cart.php';
                break;
            case 'checkout':
                include 'Frontend/checkout.php';
                break;
            case 'login':
                include 'Frontend/login.php';
                break;
            case 'register':
                include 'Frontend/register.php';
                break;
            case 'logout':
                include 'Frontend/logout.php';
                break;
            case 'orders':
                include 'Frontend/orders.php';
                break;
            case 'profile':
                include 'Frontend/profile.php';
                break;
            case 'about':
                include 'Frontend/about.php';
                break;
            case 'contact':
                include 'Frontend/contact.php';
                break;
            case 'admin':
                include 'Frontend/admin.php';
                break;
            default:
                include 'Frontend/home.php';
        }
        ?>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h4>About Us</h4>
                <p>FishingGear Pro is your one-stop shop for premium fishing equipment.</p>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="index.php">Shop</a></li>
                    <li><a href="index.php?page=about">About</a></li>
                    <li><a href="index.php?page=contact">Contact</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Contact</h4>
                <p>Email: <a href="mailto:kristersmateuss@gmail.com">kristersmateuss@gmail.com</a></p>
                <p>Phone: <a href="tel:+37126369452">+371 26 369 452</a></p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 FishingGear Pro. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>
