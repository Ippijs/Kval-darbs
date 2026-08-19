<?php
require_once __DIR__ . '/../config.php';

// Builds reusable SQL filter clauses for category/search product queries.
function build_product_filters($category, $search) {
    $where = "";
    $params = array();
    $types = "";

    if ($category) {
        $where .= " AND category = ?";
        $params[] = $category;
        $types .= "s";
    }

    if ($search) {
        $where .= " AND (name LIKE ? OR description LIKE ?)";
        $search_term = "%$search%";
        $params[] = $search_term;
        $params[] = $search_term;
        $types .= "ss";
    }

    return array($where, $params, $types);
}

// Returns a paginated product list with optional category/search filters.
function get_all_products($category = null, $search = null, $limit = 12, $offset = 0) {
    global $conn;

    list($where, $params, $types) = build_product_filters($category, $search);
    $query = "SELECT * FROM products WHERE 1=1" . $where;

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

// Returns one product row by id.
function get_product_by_id($product_id) {
    global $conn;

    $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();

    return $stmt->get_result()->fetch_assoc();
}

// Returns product count for pagination using the same filters as listing.
function get_product_count($category = null, $search = null) {
    global $conn;

    list($where, $params, $types) = build_product_filters($category, $search);
    $query = "SELECT COUNT(*) as count FROM products WHERE 1=1" . $where;

    $stmt = $conn->prepare($query);

    if ($params) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    return $result['count'];
}

// Returns all unique product categories.
function get_categories() {
    global $conn;

    $result = $conn->query("SELECT DISTINCT category FROM products ORDER BY category");
    return $result->fetch_all(MYSQLI_ASSOC);
}

// Inserts a new product row.
function add_product($name, $category, $price, $description, $image = '', $stock = 0) {
    global $conn;

    $stmt = $conn->prepare("INSERT INTO products (name, category, price, description, image, stock) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssdssi", $name, $category, $price, $description, $image, $stock);

    if ($stmt->execute()) {
        return array('success' => true, 'id' => $conn->insert_id);
    }

    return array('success' => false, 'message' => 'Failed to add product');
}

// Updates an existing product row.
function update_product($id, $name, $category, $price, $description, $image, $stock) {
    global $conn;

    $stmt = $conn->prepare("UPDATE products SET name = ?, category = ?, price = ?, description = ?, image = ?, stock = ? WHERE id = ?");
    $stmt->bind_param("ssdssii", $name, $category, $price, $description, $image, $stock, $id);

    if ($stmt->execute()) {
        return array('success' => true);
    }

    return array('success' => false, 'message' => 'Failed to update product');
}

// Deletes a product row.
function delete_product($id) {
    global $conn;

    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        return array('success' => true);
    }

    return array('success' => false, 'message' => 'Failed to delete product');
}

// Sets stock quantity for a product row.
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