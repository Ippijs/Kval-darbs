<?php
// Profile page

if (!is_logged_in()) {
    header('Location: index.php?page=login');
    exit;
}

$user_id = get_current_user_id();
?>

<div class="profile-container">
    <h1>My Profile</h1>

    <div class="profile-content">
        <div class="profile-section">
            <h2>User Information</h2>
            <p><strong>Username:</strong> <?php echo htmlspecialchars($_SESSION['username']); ?></p>
            <p><strong>Name:</strong> <?php echo htmlspecialchars($_SESSION['first_name']); ?></p>
        </div>

        <div class="profile-section">
            <h2>Quick Links</h2>
            <ul>
                <li><a href="index.php?page=orders">View My Orders</a></li>
                <li><a href="index.php?page=cart">View Shopping Cart</a></li>
                <li><a href="index.php">Continue Shopping</a></li>
                <li><a href="index.php?page=logout">Logout</a></li>
            </ul>
        </div>
    </div>
</div>
