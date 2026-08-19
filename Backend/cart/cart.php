<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../auth/auth.php';

// Normalizes the common success/failure response structure.
function cart_result($success, $successMessage, $errorMessage) {
    return array(
        'success' => $success,
        'message' => $success ? $successMessage : $errorMessage
    );
}

// Calculates total item quantity for a list of cart rows.
function cart_item_count($items) {
    return array_reduce($items, function ($sum, $item) {
        return $sum + ((int)$item['quantity']);
    }, 0);
}

// Adds an item to the user's cart or increases quantity if it already exists.
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
    
    return cart_result(true, 'Item added to cart', 'Failed to add item');
}

// Returns all cart rows for a user joined with product details.
function get_cart_items($user_id) {
    global $conn;
    
    $stmt = $conn->prepare("\n        SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image \n        FROM cart c \n        JOIN products p ON c.product_id = p.id \n        WHERE c.user_id = ?\n    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    
    return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}

// Removes a cart row by cart id.
function remove_from_cart($cart_id) {
    global $conn;
    
    $stmt = $conn->prepare("DELETE FROM cart WHERE id = ?");
    $stmt->bind_param("i", $cart_id);
    
    return cart_result($stmt->execute(), 'Item removed from cart', 'Failed to remove item');
}

// Updates quantity for one cart row, or removes it if quantity is zero/negative.
function update_cart_quantity($cart_id, $quantity) {
    global $conn;
    
    if ($quantity <= 0) {
        return remove_from_cart($cart_id);
    }
    
    $stmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
    $stmt->bind_param("ii", $quantity, $cart_id);
    
    return cart_result($stmt->execute(), 'Cart updated', 'Failed to update cart');
}

// Returns monetary total for all items in the cart.
function get_cart_total($user_id) {
    $items = get_cart_items($user_id);
    $total = array_reduce($items, function ($sum, $item) {
        return $sum + ((float)$item['price'] * (int)$item['quantity']);
    }, 0.0);

    return round($total, 2);
}

// Clears the entire cart for a user.
function clear_cart($user_id) {
    global $conn;
    
    $stmt = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    
    return cart_result($stmt->execute(), 'Cart cleared', 'Failed to clear cart');
}
?>