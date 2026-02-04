<?php
// API handler for AJAX and React requests

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

require_once 'Backend/config.php';
require_once 'Backend/auth.php';
require_once 'Backend/cart.php';
require_once 'Backend/products.php';
require_once 'Backend/contact.php';

// Get JSON input for POST requests
$input = json_decode(file_get_contents('php://input'), true);

$action = isset($_GET['action']) ? $_GET['action'] : (isset($input['action']) ? $input['action'] : null);
$response = array('success' => false, 'message' => 'Invalid request');

switch($action) {
    // Product endpoints
    case 'getProducts':
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $category = isset($_GET['category']) ? $_GET['category'] : null;
        $search = isset($_GET['search']) ? $_GET['search'] : null;
        $limit = 12;
        $offset = ($page - 1) * $limit;
        
        $products = get_all_products($category, $search, $limit, $offset);
        $total = get_product_count($category, $search);
        
        echo json_encode(array(
            'success' => true,
            'products' => $products,
            'total' => $total,
            'page' => $page
        ));
        break;

    case 'getProduct':
        if (isset($_GET['id'])) {
            $product = get_product_by_id($_GET['id']);
            if ($product) {
                echo json_encode(array('success' => true, 'product' => $product));
            } else {
                echo json_encode(array('success' => false, 'message' => 'Product not found'));
            }
        }
        break;

    case 'getCategories':
        $categories = get_categories();
        echo json_encode(array('success' => true, 'categories' => $categories));
        break;

    case 'getAllProductsAdmin':
        if (is_admin()) {
            $products = get_all_products(null, null, 1000, 0);
            echo json_encode(array('success' => true, 'products' => $products));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Admin access required'));
        }
        break;

    case 'createProduct':
        if (is_admin()) {
            $name = isset($input['name']) ? trim($input['name']) : '';
            $category = isset($input['category']) ? trim($input['category']) : '';
            $price = isset($input['price']) ? (float)$input['price'] : 0;
            $description = isset($input['description']) ? trim($input['description']) : '';
            $image = isset($input['image']) ? trim($input['image']) : '';
            $stock = isset($input['stock']) ? (int)$input['stock'] : 0;

            if ($name && $category && $price >= 0) {
                $result = add_product($name, $category, $price, $description, $image, $stock);
                echo json_encode($result);
            } else {
                echo json_encode(array('success' => false, 'message' => 'Name, category and price are required'));
            }
        } else {
            echo json_encode(array('success' => false, 'message' => 'Admin access required'));
        }
        break;

    case 'updateProduct':
        if (is_admin()) {
            $id = isset($input['id']) ? (int)$input['id'] : 0;
            $name = isset($input['name']) ? trim($input['name']) : '';
            $category = isset($input['category']) ? trim($input['category']) : '';
            $price = isset($input['price']) ? (float)$input['price'] : 0;
            $description = isset($input['description']) ? trim($input['description']) : '';
            $image = isset($input['image']) ? trim($input['image']) : '';
            $stock = isset($input['stock']) ? (int)$input['stock'] : 0;

            if ($id && $name && $category) {
                $result = update_product($id, $name, $category, $price, $description, $image, $stock);
                echo json_encode($result);
            } else {
                echo json_encode(array('success' => false, 'message' => 'Invalid product data'));
            }
        } else {
            echo json_encode(array('success' => false, 'message' => 'Admin access required'));
        }
        break;

    case 'deleteProduct':
        if (is_admin()) {
            $id = isset($input['id']) ? (int)$input['id'] : 0;
            if ($id) {
                $result = delete_product($id);
                echo json_encode($result);
            } else {
                echo json_encode(array('success' => false, 'message' => 'Product ID required'));
            }
        } else {
            echo json_encode(array('success' => false, 'message' => 'Admin access required'));
        }
        break;

    case 'setSoldOut':
        if (is_admin()) {
            $id = isset($input['id']) ? (int)$input['id'] : 0;
            if ($id) {
                $result = set_product_stock($id, 0);
                echo json_encode($result);
            } else {
                echo json_encode(array('success' => false, 'message' => 'Product ID required'));
            }
        } else {
            echo json_encode(array('success' => false, 'message' => 'Admin access required'));
        }
        break;

    // Cart endpoints
    case 'getCart':
        if (is_logged_in()) {
            $items = get_cart_items(get_current_user_id());
            echo json_encode(array('success' => true, 'items' => $items));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Not logged in', 'items' => []));
        }
        break;

    case 'addToCart':
        if (is_logged_in()) {
            $product_id = isset($input['product_id']) ? (int)$input['product_id'] : 0;
            $quantity = isset($input['quantity']) ? (int)$input['quantity'] : 1;
            $result = add_to_cart(get_current_user_id(), $product_id, $quantity);
            echo json_encode($result);
        } else {
            echo json_encode(array('success' => false, 'message' => 'Please login first'));
        }
        break;

    case 'removeFromCart':
        if (is_logged_in()) {
            $cart_item_id = isset($input['cart_item_id']) ? (int)$input['cart_item_id'] : 0;
            $result = remove_from_cart($cart_item_id);
            echo json_encode($result);
        } else {
            echo json_encode(array('success' => false, 'message' => 'Not logged in'));
        }
        break;

    case 'updateCartItem':
        if (is_logged_in()) {
            $cart_item_id = isset($input['cart_item_id']) ? (int)$input['cart_item_id'] : 0;
            $quantity = isset($input['quantity']) ? (int)$input['quantity'] : 1;
            $result = update_cart_item($cart_item_id, $quantity);
            echo json_encode($result);
        } else {
            echo json_encode(array('success' => false, 'message' => 'Not logged in'));
        }
        break;

    // Auth endpoints
    case 'login':
        $username = isset($input['username']) ? $input['username'] : '';
        $password = isset($input['password']) ? $input['password'] : '';
        
        if ($username && $password) {
            $result = login_user($username, $password);
            if ($result['success']) {
                echo json_encode(array(
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => array(
                        'id' => $_SESSION['user_id'],
                        'username' => $_SESSION['username'],
                        'is_admin' => is_admin()
                    )
                ));
            } else {
                echo json_encode($result);
            }
        } else {
            echo json_encode(array('success' => false, 'message' => 'Username and password required'));
        }
        break;

    case 'register':
        $username = isset($input['username']) ? $input['username'] : '';
        $email = isset($input['email']) ? $input['email'] : '';
        $password = isset($input['password']) ? $input['password'] : '';
        
        if ($username && $email && $password) {
            $result = register_user($username, $email, $password);
            echo json_encode($result);
        } else {
            echo json_encode(array('success' => false, 'message' => 'All fields required'));
        }
        break;

    case 'getCurrentUser':
        if (is_logged_in()) {
            echo json_encode(array(
                'success' => true,
                'user' => array(
                    'id' => $_SESSION['user_id'],
                    'username' => $_SESSION['username'],
                    'email' => isset($_SESSION['email']) ? $_SESSION['email'] : '',
                    'is_admin' => is_admin()
                )
            ));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Not logged in', 'user' => null));
        }
        break;

    case 'logout':
        logout_user();
        echo json_encode(array('success' => true, 'message' => 'Logged out'));
        break;

    // Orders endpoints
    case 'getOrders':
        if (is_logged_in()) {
            require_once 'Backend/orders.php';
            $orders = get_user_orders(get_current_user_id());
            echo json_encode(array('success' => true, 'orders' => $orders));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Not logged in'));
        }
        break;

    case 'createOrder':
        if (is_logged_in()) {
            require_once 'Backend/orders.php';
            $shipping_address = isset($input['shipping_address']) ? $input['shipping_address'] : '';
            $result = create_order(get_current_user_id(), $shipping_address);
            echo json_encode($result);
        } else {
            echo json_encode(array('success' => false, 'message' => 'Not logged in'));
        }
        break;

    case 'sendContactMessage':
        $name = isset($input['name']) ? trim($input['name']) : '';
        $email = isset($input['email']) ? trim($input['email']) : '';
        $message = isset($input['message']) ? trim($input['message']) : '';
        
        if ($name && $email && $message) {
            $result = send_contact_message($name, $email, '', $message);
            echo json_encode($result);
        } else {
            echo json_encode(array('success' => false, 'message' => 'All fields are required'));
        }
        break;

    default:
        echo json_encode($response);
}
?>
