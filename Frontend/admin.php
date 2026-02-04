<?php
// Admin page - Only accessible to admin@gmail.com

if (!is_logged_in() || !is_admin()) {
    header('Location: index.php?page=home');
    exit;
}

// Handle product updates
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'update_stock':
                $product_id = (int)$_POST['product_id'];
                $new_stock = (int)$_POST['stock'];
                $stmt = $conn->prepare("UPDATE products SET stock = ? WHERE id = ?");
                $stmt->bind_param("ii", $new_stock, $product_id);
                if ($stmt->execute()) {
                    $message = '<div class="alert alert-success">Stock updated successfully</div>';
                } else {
                    $message = '<div class="alert alert-error">Failed to update stock</div>';
                }
                break;
            
            case 'update_price':
                $product_id = (int)$_POST['product_id'];
                $new_price = (float)$_POST['price'];
                $stmt = $conn->prepare("UPDATE products SET price = ? WHERE id = ?");
                $stmt->bind_param("di", $new_price, $product_id);
                if ($stmt->execute()) {
                    $message = '<div class="alert alert-success">Price updated successfully</div>';
                } else {
                    $message = '<div class="alert alert-error">Failed to update price</div>';
                }
                break;
        }
    }
}

// Get all products
$products = get_all_products(null, null, 100, 0);

// Get all orders
$orders_query = $conn->query("SELECT o.*, u.username, u.email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 50");
$all_orders = $orders_query->fetch_all(MYSQLI_ASSOC);

// Get statistics
$stats_query = $conn->query("SELECT 
    (SELECT COUNT(*) FROM products) as total_products,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM orders) as total_orders,
    (SELECT SUM(total_price) FROM orders WHERE status = 'completed') as total_revenue
");
$stats = $stats_query->fetch_assoc();
?>

<div class="admin-container">
    <h1>Admin Dashboard</h1>
    
    <?php if ($message) echo $message; ?>
    
    <!-- Statistics Cards -->
    <div class="admin-stats">
        <div class="stat-card">
            <h3>Total Products</h3>
            <p class="stat-value"><?php echo $stats['total_products']; ?></p>
        </div>
        <div class="stat-card">
            <h3>Total Users</h3>
            <p class="stat-value"><?php echo $stats['total_users']; ?></p>
        </div>
        <div class="stat-card">
            <h3>Total Orders</h3>
            <p class="stat-value"><?php echo $stats['total_orders']; ?></p>
        </div>
        <div class="stat-card">
            <h3>Total Revenue</h3>
            <p class="stat-value">$<?php echo number_format($stats['total_revenue'] ?? 0, 2); ?></p>
        </div>
    </div>

    <!-- Products Management -->
    <div class="admin-section">
        <h2>Product Management</h2>
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($products as $product): ?>
                    <tr>
                        <td><?php echo $product['id']; ?></td>
                        <td><?php echo htmlspecialchars($product['name']); ?></td>
                        <td><?php echo ucfirst($product['category']); ?></td>
                        <td>
                            <form method="POST" style="display: inline-flex; gap: 5px;">
                                <input type="hidden" name="action" value="update_price">
                                <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">
                                <input type="number" name="price" value="<?php echo $product['price']; ?>" step="0.01" style="width: 80px;">
                                <button type="submit" class="btn-small">Update</button>
                            </form>
                        </td>
                        <td>
                            <form method="POST" style="display: inline-flex; gap: 5px;">
                                <input type="hidden" name="action" value="update_stock">
                                <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">
                                <input type="number" name="stock" value="<?php echo $product['stock']; ?>" style="width: 60px;">
                                <button type="submit" class="btn-small">Update</button>
                            </form>
                        </td>
                        <td>
                            <a href="index.php?page=product&id=<?php echo $product['id']; ?>" class="btn-small">View</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <!-- Recent Orders -->
    <div class="admin-section">
        <h2>Recent Orders</h2>
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($all_orders as $order): ?>
                    <tr>
                        <td>#<?php echo $order['id']; ?></td>
                        <td><?php echo htmlspecialchars($order['username']); ?></td>
                        <td><?php echo htmlspecialchars($order['email']); ?></td>
                        <td>$<?php echo number_format($order['total_price'], 2); ?></td>
                        <td><span class="status-badge status-<?php echo $order['status']; ?>"><?php echo ucfirst($order['status']); ?></span></td>
                        <td><?php echo date('Y-m-d H:i', strtotime($order['created_at'])); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <!-- Contact Messages -->
    <div class="admin-section">
        <h2>Contact Messages</h2>
        <?php
        $messages = get_all_contact_messages();
        if (!empty($messages)):
        ?>
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($messages as $msg): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($msg['name']); ?></td>
                        <td><a href="mailto:<?php echo htmlspecialchars($msg['email']); ?>"><?php echo htmlspecialchars($msg['email']); ?></a></td>
                        <td><?php echo htmlspecialchars($msg['subject']); ?></td>
                        <td><?php echo nl2br(htmlspecialchars(substr($msg['message'], 0, 100))); ?>...</td>
                        <td><?php echo date('Y-m-d H:i', strtotime($msg['created_at'])); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php else: ?>
        <p>No contact messages yet.</p>
        <?php endif; ?>
    </div>
</div>
