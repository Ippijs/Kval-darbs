<?php
// Shopping cart page

if (!is_logged_in()) {
    header('Location: index.php?page=login');
    exit;
}

$user_id = get_current_user_id();
$cart_items = get_cart_items($user_id);
$total = get_cart_total($user_id);

$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        if ($_POST['action'] === 'remove' && isset($_POST['item_id'])) {
            $result = remove_from_cart($_POST['item_id']);
            $message = '<div class="alert alert-' . ($result['success'] ? 'success' : 'error') . '">' . $result['message'] . '</div>';
            $cart_items = get_cart_items($user_id);
            $total = get_cart_total($user_id);
        } elseif ($_POST['action'] === 'update' && isset($_POST['item_id']) && isset($_POST['quantity'])) {
            $result = update_cart_quantity($_POST['item_id'], $_POST['quantity']);
            $cart_items = get_cart_items($user_id);
            $total = get_cart_total($user_id);
        } elseif ($_POST['action'] === 'clear') {
            clear_cart($user_id);
            $message = '<div class="alert alert-success">Cart cleared</div>';
            $cart_items = [];
            $total = 0;
        }
    }
}
?>

<div class="cart-container">
    <h1>Shopping Cart</h1>

    <?php if ($message) echo $message; ?>

    <?php if (!empty($cart_items)): ?>
        <div class="cart-content">
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($cart_items as $item): ?>
                        <tr>
                            <td class="product-cell">
                                <div class="image-placeholder-small">
                                    <p>No Image</p>
                                </div>
                                <div>
                                    <a href="index.php?page=product&id=<?php echo $item['product_id']; ?>">
                                        <?php echo htmlspecialchars($item['name']); ?>
                                    </a>
                                </div>
                            </td>
                            <td>$<?php echo number_format($item['price'], 2); ?></td>
                            <td>
                                <form method="POST" style="display: flex; gap: 5px;">
                                    <input type="hidden" name="action" value="update">
                                    <input type="hidden" name="item_id" value="<?php echo $item['id']; ?>">
                                    <input type="number" name="quantity" min="1" value="<?php echo $item['quantity']; ?>" style="width: 60px;">
                                    <button type="submit" class="btn-small">Update</button>
                                </form>
                            </td>
                            <td>$<?php echo number_format($item['price'] * $item['quantity'], 2); ?></td>
                            <td>
                                <form method="POST" style="display: inline;">
                                    <input type="hidden" name="action" value="remove">
                                    <input type="hidden" name="item_id" value="<?php echo $item['id']; ?>">
                                    <button type="submit" class="btn-danger">Remove</button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>

            <div class="cart-summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <strong>$<?php echo number_format($total, 2); ?></strong>
                </div>
                <div class="summary-row">
                    <span>Shipping:</span>
                    <strong>FREE</strong>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <strong>$<?php echo number_format($total, 2); ?></strong>
                </div>
            </div>

            <div class="cart-actions">
                <a href="index.php?page=home" class="btn-secondary">Continue Shopping</a>
                <form method="POST" style="display: inline;">
                    <input type="hidden" name="action" value="clear">
                    <button type="submit" class="btn-secondary">Clear Cart</button>
                </form>
                <a href="index.php?page=checkout" class="btn-primary btn-large">Proceed to Checkout</a>
            </div>
        </div>
    <?php else: ?>
        <div class="empty-cart">
            <p>Your cart is empty</p>
            <a href="index.php?page=home" class="btn-primary">Continue Shopping</a>
        </div>
    <?php endif; ?>
</div>
