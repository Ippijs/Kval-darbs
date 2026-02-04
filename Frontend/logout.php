<?php
// Logout page

logout_user();
?>

<div class="message-container">
    <div class="success-message">
        <h2>You have been logged out</h2>
        <p>Thank you for shopping with FishingGear Pro!</p>
        <a href="index.php" class="btn-primary">Back to Shop</a>
    </div>
</div>

<?php
// Redirect after 2 seconds
echo '<meta http-equiv="refresh" content="2;url=index.php">';
?>
