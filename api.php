<?php
// API handler for AJAX and React requests

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
// Allow React dev server from localhost and LAN IP when using --host
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$isAllowedOrigin = false;

if ($origin) {
    if (preg_match('/^http:\/\/localhost:5173$/', $origin)) {
        $isAllowedOrigin = true;
    }

    if (preg_match('/^http:\/\/(?:\d{1,3}\.){3}\d{1,3}:5173$/', $origin)) {
        $isAllowedOrigin = true;
    }
}

if ($isAllowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $origin);
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_set_cookie_params(array(
    'lifetime' => 0,
    'path' => '/',
    'secure' => $isHttps,
    'httponly' => true,
    'samesite' => 'Lax'
));

session_start();

require_once 'Backend/config.php';
require_once 'Backend/auth/auth.php';
require_once 'Backend/cart/cart.php';
require_once 'Backend/products/products.php';
require_once 'Backend/contact/contact.php';

// Get JSON input for POST requests
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    $input = array();
}

function is_rate_limited($action, $windowSeconds, $maxAttempts) {
    $key = 'rate_limit_' . $action;
    $now = time();

    if (!isset($_SESSION[$key]) || !is_array($_SESSION[$key])) {
        $_SESSION[$key] = array();
    }

    $_SESSION[$key] = array_values(array_filter($_SESSION[$key], function ($timestamp) use ($now, $windowSeconds) {
        return ($now - (int)$timestamp) < $windowSeconds;
    }));

    if (count($_SESSION[$key]) >= $maxAttempts) {
        return true;
    }

    $_SESSION[$key][] = $now;
    return false;
}

function fetch_json_from_url($url, $timeoutSeconds = 6) {
    $raw = false;

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeoutSeconds);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeoutSeconds);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json'));
        $raw = curl_exec($ch);
        $statusCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($raw === false || $statusCode >= 400) {
            $raw = false;
        }
    } else {
        $context = stream_context_create(array(
            'http' => array(
                'method' => 'GET',
                'timeout' => $timeoutSeconds,
                'header' => "Accept: application/json\r\n"
            )
        ));

        $raw = @file_get_contents($url, false, $context);
    }

    if ($raw === false) {
        return null;
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        return null;
    }

    return $decoded;
}

$action = isset($_GET['action']) ? $_GET['action'] : (isset($input['action']) ? $input['action'] : null);
$response = array('success' => false, 'message' => 'Invalid request');

switch($action) {
    case 'health':
        echo json_encode(array('success' => true, 'status' => 'ok', 'timestamp' => date('c')));
        break;

    case 'uploadProductImage':
        if (!is_admin()) {
            http_response_code(403);
            echo json_encode(array('success' => false, 'message' => 'Admin access required'));
            break;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(array('success' => false, 'message' => 'Method not allowed'));
            break;
        }

        if (!isset($_FILES['image'])) {
            http_response_code(400);
            echo json_encode(array('success' => false, 'message' => 'No image file provided'));
            break;
        }

        $file = $_FILES['image'];

        if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(array('success' => false, 'message' => 'File upload failed'));
            break;
        }

        $maxBytes = 5 * 1024 * 1024;
        if ((int)$file['size'] <= 0 || (int)$file['size'] > $maxBytes) {
            http_response_code(400);
            echo json_encode(array('success' => false, 'message' => 'Image size must be between 1 byte and 5 MB'));
            break;
        }

        $tmpName = $file['tmp_name'];
        if (!is_uploaded_file($tmpName)) {
            http_response_code(400);
            echo json_encode(array('success' => false, 'message' => 'Invalid uploaded file'));
            break;
        }

        $mimeType = '';

        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            if ($finfo) {
                $mimeType = (string) finfo_file($finfo, $tmpName);
                finfo_close($finfo);
            }
        }

        $allowedMimeToExt = array(
            'image/png' => 'png',
            'image/jpeg' => 'jpg'
        );

        $extension = isset($allowedMimeToExt[$mimeType]) ? $allowedMimeToExt[$mimeType] : '';

        if ($extension === '') {
            $originalName = isset($file['name']) ? (string)$file['name'] : '';
            $pathInfo = pathinfo($originalName);
            $fallbackExt = isset($pathInfo['extension']) ? strtolower((string)$pathInfo['extension']) : '';

            if ($fallbackExt === 'jpeg') {
                $fallbackExt = 'jpg';
            }

            if (in_array($fallbackExt, array('png', 'jpg'), true)) {
                $extension = $fallbackExt;
            }
        }

        if ($extension === '') {
            http_response_code(400);
            echo json_encode(array('success' => false, 'message' => 'Only PNG and JPEG images are allowed'));
            break;
        }

        $uploadDirAbsolute = __DIR__ . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR . 'products';
        if (!is_dir($uploadDirAbsolute) && !mkdir($uploadDirAbsolute, 0755, true)) {
            http_response_code(500);
            echo json_encode(array('success' => false, 'message' => 'Failed to prepare upload directory'));
            break;
        }

        try {
            $safeBase = bin2hex(random_bytes(8));
        } catch (Exception $e) {
            $safeBase = uniqid('', true);
            $safeBase = str_replace('.', '', $safeBase);
        }
        $fileName = 'product_' . date('Ymd_His') . '_' . $safeBase . '.' . $extension;
        $destinationAbsolute = $uploadDirAbsolute . DIRECTORY_SEPARATOR . $fileName;

        if (!move_uploaded_file($tmpName, $destinationAbsolute)) {
            http_response_code(500);
            echo json_encode(array('success' => false, 'message' => 'Failed to save uploaded image'));
            break;
        }

        $publicPath = 'images/products/' . $fileName;
        echo json_encode(array(
            'success' => true,
            'image' => $publicPath
        ));
        break;

    case 'getApproxLocation':
        $services = array(
            array('url' => 'https://ipapi.co/json/', 'name' => 'ipapi'),
            array('url' => 'http://ip-api.com/json/?fields=status,country,city,lat,lon', 'name' => 'ip-api')
        );

        $resolved = false;

        foreach ($services as $service) {
            $data = fetch_json_from_url($service['url']);
            if (!is_array($data)) {
                continue;
            }

            $latitude = null;
            $longitude = null;

            if (isset($data['latitude']) && isset($data['longitude'])) {
                $latitude = (float) $data['latitude'];
                $longitude = (float) $data['longitude'];
            } elseif (isset($data['lat']) && isset($data['lon'])) {
                if (isset($data['status']) && $data['status'] !== 'success') {
                    continue;
                }
                $latitude = (float) $data['lat'];
                $longitude = (float) $data['lon'];
            }

            if (is_finite($latitude) && is_finite($longitude)) {
                echo json_encode(array(
                    'success' => true,
                    'latitude' => $latitude,
                    'longitude' => $longitude,
                    'city' => isset($data['city']) ? $data['city'] : '',
                    'country' => isset($data['country_name']) ? $data['country_name'] : (isset($data['country']) ? $data['country'] : ''),
                    'source' => $service['name']
                ));
                $resolved = true;
                break;
            }
        }

        if (!$resolved) {
            http_response_code(502);
            echo json_encode(array('success' => false, 'message' => 'Failed to resolve approximate location'));
        }
        break;

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
        if (is_rate_limited('login', 300, 10)) {
            http_response_code(429);
            echo json_encode(array('success' => false, 'message' => 'Too many login attempts. Please try again later.'));
            break;
        }

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
        if (is_rate_limited('register', 300, 6)) {
            http_response_code(429);
            echo json_encode(array('success' => false, 'message' => 'Too many registration attempts. Please try again later.'));
            break;
        }

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

    case 'updateProfile':
        if (is_logged_in()) {
            $username = isset($input['username']) ? trim($input['username']) : '';
            $email = isset($input['email']) ? trim($input['email']) : '';
            $password = isset($input['password']) ? trim($input['password']) : '';

            // Prevent accidentally stripping admin rights from the special admin account.
            if (is_admin() && $username !== ($_SESSION['username'] ?? '')) {
                echo json_encode(array('success' => false, 'message' => 'Admin username cannot be changed'));
                break;
            }

            $result = update_user_profile(get_current_user_id(), $username, $email, $password);

            if ($result['success']) {
                $_SESSION['username'] = $username;
                $_SESSION['email'] = $email;
                echo json_encode(array(
                    'success' => true,
                    'message' => $result['message'],
                    'user' => array(
                        'id' => $_SESSION['user_id'],
                        'username' => $_SESSION['username'],
                        'email' => $_SESSION['email'],
                        'is_admin' => is_admin()
                    )
                ));
            } else {
                echo json_encode($result);
            }
        } else {
            echo json_encode(array('success' => false, 'message' => 'Not logged in'));
        }
        break;

    case 'logout':
        logout_user();
        echo json_encode(array('success' => true, 'message' => 'Logged out'));
        break;

    // Orders endpoints
    case 'getOrders':
        if (is_logged_in()) {
            require_once 'Backend/orders/orders.php';
            $orders = get_user_orders(get_current_user_id());
            echo json_encode(array('success' => true, 'orders' => $orders));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Not logged in'));
        }
        break;

    case 'createOrder':
        if (is_logged_in()) {
            require_once 'Backend/orders/orders.php';
            $shipping_address = isset($input['shipping_address']) ? $input['shipping_address'] : '';
            $result = create_order(get_current_user_id(), $shipping_address);
            echo json_encode($result);
        } else {
            echo json_encode(array('success' => false, 'message' => 'Not logged in'));
        }
        break;

    case 'sendContactMessage':
        if (is_rate_limited('contact', 300, 6)) {
            http_response_code(429);
            echo json_encode(array('success' => false, 'message' => 'Too many messages sent. Please try again later.'));
            break;
        }

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
