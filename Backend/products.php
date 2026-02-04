<?php
require_once 'config.php';

function get_all_products($category = null, $search = null, $limit = 12, $offset = 0) {
    global $conn;
    
    $query = "SELECT * FROM products WHERE 1=1";
    $params = [];
    $types = "";
    
    if ($category) {
        $query .= " AND category = ?";
        $params[] = $category;
        $types .= "s";
    }
    
    if ($search) {
        $query .= " AND (name LIKE ? OR description LIKE ?)";
        $search_term = "%$search%";
        $params[] = $search_term;
        $params[] = $search_term;
        $types .= "ss";
    }
    
    $query .= " LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    $types .= "ii";
    
    $stmt = $conn->prepare($query);
    
    if ($params) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}

function get_product_by_id($product_id) {
    global $conn;
    
    $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    
    return $stmt->get_result()->fetch_assoc();
}

function get_product_count($category = null, $search = null) {
    global $conn;
    
    $query = "SELECT COUNT(*) as count FROM products WHERE 1=1";
    $params = [];
    $types = "";
    
    if ($category) {
        $query .= " AND category = ?";
        $params[] = $category;
        $types .= "s";
    }
    
    if ($search) {
        $query .= " AND (name LIKE ? OR description LIKE ?)";
        $search_term = "%$search%";
        $params[] = $search_term;
        $params[] = $search_term;
        $types .= "ss";
    }
    
    $stmt = $conn->prepare($query);
    
    if ($params) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    
    return $result['count'];
}

function get_categories() {
    global $conn;
    
    $result = $conn->query("SELECT DISTINCT category FROM products ORDER BY category");
    return $result->fetch_all(MYSQLI_ASSOC);
}

function add_product($name, $category, $price, $description, $image = '', $stock = 0) {
    global $conn;

    $stmt = $conn->prepare("INSERT INTO products (name, category, price, description, image, stock) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssdssi", $name, $category, $price, $description, $image, $stock);

    if ($stmt->execute()) {
        return array('success' => true, 'id' => $conn->insert_id);
    }

    return array('success' => false, 'message' => 'Failed to add product');
}

function update_product($id, $name, $category, $price, $description, $image, $stock) {
    global $conn;

    $stmt = $conn->prepare("UPDATE products SET name = ?, category = ?, price = ?, description = ?, image = ?, stock = ? WHERE id = ?");
    $stmt->bind_param("ssdssii", $name, $category, $price, $description, $image, $stock, $id);

    if ($stmt->execute()) {
        return array('success' => true);
    }

    return array('success' => false, 'message' => 'Failed to update product');
}

function delete_product($id) {
    global $conn;

    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        return array('success' => true);
    }

    return array('success' => false, 'message' => 'Failed to delete product');
}

function set_product_stock($id, $stock) {
    global $conn;

    $stmt = $conn->prepare("UPDATE products SET stock = ? WHERE id = ?");
    $stmt->bind_param("ii", $stock, $id);

    if ($stmt->execute()) {
        return array('success' => true);
    }

    return array('success' => false, 'message' => 'Failed to update stock');
}
?>
