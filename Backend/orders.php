<?php
require_once 'config.php';

function create_order($user_id) {
    global $conn;
    
    // Get cart items
    require_once 'cart.php';
    $cart_items = get_cart_items($user_id);
    
    if (empty($cart_items)) {
        return array('success' => false, 'message' => 'Cart is empty');
    }
    
    // Calculate total
    $total = 0;
    foreach ($cart_items as $item) {
        $total += $item['price'] * $item['quantity'];
    }
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Insert order
        $stmt = $conn->prepare("INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'completed')");
        $stmt->bind_param("id", $user_id, $total);
        $stmt->execute();
        $order_id = $conn->insert_id;
        
        // Insert order items and update stock
        $insert_item = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
        $update_stock = $conn->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
        
        foreach ($cart_items as $item) {
            $insert_item->bind_param("iiii", $order_id, $item['product_id'], $item['quantity'], $item['price']);
            $insert_item->execute();
            
            $update_stock->bind_param("ii", $item['quantity'], $item['product_id']);
            $update_stock->execute();
        }
        
        // Clear cart
        $clear = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
        $clear->bind_param("i", $user_id);
        $clear->execute();
        
        $conn->commit();
        
        return array('success' => true, 'message' => 'Order created successfully', 'order_id' => $order_id, 'total' => $total);
    } catch (Exception $e) {
        $conn->rollback();
        return array('success' => false, 'message' => 'Failed to create order: ' . $e->getMessage());
    }
}

function get_user_orders($user_id) {
    global $conn;
    
    $stmt = $conn->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    
    return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}

function get_order_details($order_id) {
    global $conn;
    
    $stmt = $conn->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $order = $stmt->get_result()->fetch_assoc();
    
    if ($order) {
        $items_stmt = $conn->prepare("
            SELECT oi.*, p.name, p.image 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?
        ");
        $items_stmt->bind_param("i", $order_id);
        $items_stmt->execute();
        $order['items'] = $items_stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    
    return $order;
}
?>
