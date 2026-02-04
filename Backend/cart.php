<?php
require_once 'config.php';
require_once 'auth.php';

function add_to_cart($user_id, $product_id, $quantity = 1) {
    global $conn;
    
    // Check if product exists and has stock
    $product_check = $conn->prepare("SELECT stock FROM products WHERE id = ?");
    $product_check->bind_param("i", $product_id);
    $product_check->execute();
    $product = $product_check->get_result()->fetch_assoc();
    
    if (!$product || $product['stock'] < $quantity) {
        return array('success' => false, 'message' => 'Product not available or insufficient stock');
    }
    
    // Check if item already in cart
    $existing = $conn->prepare("SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?");
    $existing->bind_param("ii", $user_id, $product_id);
    $existing->execute();
    $result = $existing->get_result();
    
    if ($result->num_rows > 0) {
        // Update quantity
        $item = $result->fetch_assoc();
        $new_quantity = $item['quantity'] + $quantity;
        $update = $conn->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
        $update->bind_param("ii", $new_quantity, $item['id']);
        $update->execute();
    } else {
        // Add new item
        $insert = $conn->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
        $insert->bind_param("iii", $user_id, $product_id, $quantity);
        $insert->execute();
    }
    
    return array('success' => true, 'message' => 'Item added to cart');
}

function get_cart_items($user_id) {
    global $conn;
    
    $stmt = $conn->prepare("
        SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image 
        FROM cart c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = ?
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    
    return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}

function remove_from_cart($cart_id) {
    global $conn;
    
    $stmt = $conn->prepare("DELETE FROM cart WHERE id = ?");
    $stmt->bind_param("i", $cart_id);
    
    if ($stmt->execute()) {
        return array('success' => true, 'message' => 'Item removed from cart');
    }
    return array('success' => false, 'message' => 'Failed to remove item');
}

function update_cart_quantity($cart_id, $quantity) {
    global $conn;
    
    if ($quantity <= 0) {
        return remove_from_cart($cart_id);
    }
    
    $stmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
    $stmt->bind_param("ii", $quantity, $cart_id);
    
    if ($stmt->execute()) {
        return array('success' => true, 'message' => 'Cart updated');
    }
    return array('success' => false, 'message' => 'Failed to update cart');
}

function get_cart_total($user_id) {
    $items = get_cart_items($user_id);
    $total = 0;
    
    foreach ($items as $item) {
        $total += $item['price'] * $item['quantity'];
    }
    
    return round($total, 2);
}

function clear_cart($user_id) {
    global $conn;
    
    $stmt = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    
    if ($stmt->execute()) {
        return array('success' => true, 'message' => 'Cart cleared');
    }
    return array('success' => false, 'message' => 'Failed to clear cart');
}
?>
