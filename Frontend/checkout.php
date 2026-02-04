<?php
// Checkout page

if (!is_logged_in()) {
    header('Location: index.php?page=login');
    exit;
}

$user_id = get_current_user_id();
require_once 'Backend/orders.php';

$cart_items = get_cart_items($user_id);
$total = get_cart_total($user_id);

if (empty($cart_items)) {
    header('Location: index.php?page=cart');
    exit;
}

$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['place_order'])) {
        $result = create_order($user_id);
        if ($result['success']) {
            $message = '<div class="alert alert-success">Order placed successfully! Order ID: ' . $result['order_id'] . '</div>';
            echo '<meta http-equiv="refresh" content="3;url=index.php?page=orders">';
        } else {
            $message = '<div class="alert alert-error">' . $result['message'] . '</div>';
        }
    }
}
?>

<div class="checkout-container">
    <h1>Checkout</h1>

    <?php if ($message) echo $message; ?>

    <div class="checkout-content">
        <div class="checkout-section">
            <h2>Order Summary</h2>
            <div class="order-items">
                <?php foreach ($cart_items as $item): ?>
                    <div class="order-item">
                        <span><?php echo htmlspecialchars($item['name']); ?> x <?php echo $item['quantity']; ?></span>
                        <span>$<?php echo number_format($item['price'] * $item['quantity'], 2); ?></span>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="order-total">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <strong>$<?php echo number_format($total, 2); ?></strong>
                </div>
                <div class="total-row">
                    <span>Shipping:</span>
                    <strong>FREE</strong>
                </div>
                <div class="total-row final-total">
                    <span>Total:</span>
                    <strong>$<?php echo number_format($total, 2); ?></strong>
                </div>
            </div>
        </div>

        <div class="checkout-section">
            <h2>Billing Information</h2>
            <form method="POST">
                <div class="form-group">
                    <label for="name">Full Name:</label>
                    <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($_SESSION['first_name'] ?? ''); ?>" required>
                </div>

                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>

                <div class="form-group">
                    <label for="address">Address:</label>
                    <input type="text" id="address" name="address" placeholder="Street address" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="city">City:</label>
                        <input type="text" id="city" name="city" required>
                    </div>
                    <div class="form-group">
                        <label for="postal">Postal Code:</label>
                        <input type="text" id="postal" name="postal" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="country">Country:</label>
                    <input type="text" id="country" name="country" value="Latvia" required>
                </div>

                <h3>Payment Method</h3>
                <div class="payment-methods">
                    <label class="payment-option">
                        <input type="radio" name="payment" value="card" checked>
                        <span>Credit/Debit Card</span>
                    </label>
                    <label class="payment-option">
                        <input type="radio" name="payment" value="bank">
                        <span>Bank Transfer</span>
                    </label>
                    <label class="payment-option">
                        <input type="radio" name="payment" value="cod">
                        <span>Cash on Delivery</span>
                    </label>
                </div>

                <div class="form-group">
                    <label class="checkbox">
                        <input type="checkbox" name="terms" required>
                        I agree to the Terms and Conditions
                    </label>
                </div>

                <button type="submit" name="place_order" class="btn-primary btn-large">Place Order</button>
                <a href="index.php?page=cart" class="btn-secondary">Back to Cart</a>
            </form>
        </div>
    </div>
</div>
