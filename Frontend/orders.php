<?php
// Orders page

if (!is_logged_in()) {
    header('Location: index.php?page=login');
    exit;
}

$user_id = get_current_user_id();
$orders = get_user_orders($user_id);
?>

<div class="orders-container">
    <h1>My Orders</h1>

    <?php if (!empty($orders)): ?>
        <table class="orders-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($orders as $order): ?>
                    <tr>
                        <td>#<?php echo str_pad($order['id'], 6, '0', STR_PAD_LEFT); ?></td>
                        <td><?php echo date('M d, Y', strtotime($order['created_at'])); ?></td>
                        <td>$<?php echo number_format($order['total_price'], 2); ?></td>
                        <td>
                            <span class="status-badge status-<?php echo strtolower($order['status']); ?>">
                                <?php echo ucfirst($order['status']); ?>
                            </span>
                        </td>
                        <td>
                            <button onclick="showOrderDetails(<?php echo $order['id']; ?>)" class="btn-small">View Details</button>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <!-- Hidden order details -->
        <?php foreach ($orders as $order): ?>
            <?php $details = get_order_details($order['id']); ?>
            <div id="order-<?php echo $order['id']; ?>" class="order-details-modal" style="display: none;">
                <div class="modal-content">
                    <span class="close" onclick="closeOrderDetails(<?php echo $order['id']; ?>)">&times;</span>
                    <h3>Order #<?php echo str_pad($order['id'], 6, '0', STR_PAD_LEFT); ?></h3>
                    <p><strong>Date:</strong> <?php echo date('M d, Y H:i', strtotime($order['created_at'])); ?></p>
                    <p><strong>Status:</strong> <?php echo ucfirst($order['status']); ?></p>
                    
                    <h4>Items:</h4>
                    <ul>
                        <?php foreach ($details['items'] as $item): ?>
                            <li>
                                <?php echo htmlspecialchars($item['name']); ?> x <?php echo $item['quantity']; ?> 
                                = $<?php echo number_format($item['price'] * $item['quantity'], 2); ?>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                    
                    <p><strong>Total:</strong> $<?php echo number_format($order['total_price'], 2); ?></p>
                </div>
            </div>
        <?php endforeach; ?>

    <?php else: ?>
        <p>You haven't placed any orders yet.</p>
        <a href="index.php" class="btn-primary">Start Shopping</a>
    <?php endif; ?>
</div>

<script>
function showOrderDetails(orderId) {
    document.getElementById('order-' + orderId).style.display = 'block';
}

function closeOrderDetails(orderId) {
    document.getElementById('order-' + orderId).style.display = 'none';
}
</script>
