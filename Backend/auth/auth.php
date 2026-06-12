<?php
require_once __DIR__ . '/../config.php';

function is_valid_username($username) {
    return (bool) preg_match('/^[A-Za-z0-9_]{3,30}$/', $username);
}

function is_valid_password($password) {
    if (strlen($password) < 8) {
        return false;
    }

    if (trim($password) !== $password) {
        return false;
    }

    if (!preg_match('/[A-Z]/', $password)) {
        return false;
    }

    if (!preg_match('/[@!#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/', $password)) {
        return false;
    }

    return true;
}

function register_user($username, $email, $password, $first_name = '', $last_name = '') {
    global $conn;

    $username = trim($username);
    $email = trim($email);

    if (!is_valid_username($username)) {
        return array('success' => false, 'message' => 'Username must be 3-30 characters and use letters, numbers, or underscore');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return array('success' => false, 'message' => 'Invalid email address');
    }

    if (!is_valid_password($password)) {
        return array('success' => false, 'message' => 'Password must be at least 8 characters, include one uppercase letter, one special character, and have no leading or trailing spaces');
    }
    
    // Check if user already exists
    $check = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $check->bind_param("ss", $username, $email);
    $check->execute();
    
    if ($check->get_result()->num_rows > 0) {
        return array('success' => false, 'message' => 'Username or email already exists');
    }
    
    // Hash password
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    
    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (username, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $username, $email, $hashed_password, $first_name, $last_name);
    
    if ($stmt->execute()) {
        return array('success' => true, 'message' => 'Registration successful');
    } else {
        error_log('Registration failed: ' . $conn->error);
        return array('success' => false, 'message' => 'Registration failed');
    }
}

function login_user($username, $password) {
    global $conn;

    $username = trim($username);
    
    $stmt = $conn->prepare("SELECT id, username, email, password, first_name FROM users WHERE username = ? OR email = ?");
    $stmt->bind_param("ss", $username, $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            session_regenerate_id(true);
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['first_name'] = $user['first_name'];
            return array('success' => true, 'message' => 'Login successful');
        } else {
            return array('success' => false, 'message' => 'Invalid credentials');
        }
    }
    
    return array('success' => false, 'message' => 'Invalid credentials');
}

function logout_user() {
    $_SESSION = array();

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }

    session_destroy();
    return array('success' => true, 'message' => 'Logged out successfully');
}

function is_logged_in() {
    return isset($_SESSION['user_id']);
}

function get_current_user_id() {
    return $_SESSION['user_id'] ?? null;
}

function is_admin() {
    if (!is_logged_in()) {
        return false;
    }

    // Admin username can be configured with ADMIN_USERNAME env var.
    $adminUsername = getenv('ADMIN_USERNAME') ?: 'Ippijs';
    $username = $_SESSION['username'] ?? '';
    return $username === $adminUsername;
}

function update_user_profile($user_id, $username, $email, $new_password = '') {
    global $conn;

    $user_id = (int)$user_id;
    $username = trim($username);
    $email = trim($email);

    if ($user_id <= 0 || $username === '' || $email === '') {
        return array('success' => false, 'message' => 'Username and email are required');
    }

    if (!is_valid_username($username)) {
        return array('success' => false, 'message' => 'Username must be 3-30 characters and use letters, numbers, or underscore');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return array('success' => false, 'message' => 'Invalid email address');
    }

    $check = $conn->prepare("SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?");
    $check->bind_param("ssi", $username, $email, $user_id);
    $check->execute();

    if ($check->get_result()->num_rows > 0) {
        return array('success' => false, 'message' => 'Username or email already exists');
    }

    if ($new_password !== '') {
        if (!is_valid_password($new_password)) {
            return array('success' => false, 'message' => 'Password must be at least 8 characters, include one uppercase letter, one special character, and have no leading or trailing spaces');
        }

        $hashed_password = password_hash($new_password, PASSWORD_BCRYPT);
        $stmt = $conn->prepare("UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?");
        $stmt->bind_param("sssi", $username, $email, $hashed_password, $user_id);
    } else {
        $stmt = $conn->prepare("UPDATE users SET username = ?, email = ? WHERE id = ?");
        $stmt->bind_param("ssi", $username, $email, $user_id);
    }

    if (!$stmt->execute()) {
        return array('success' => false, 'message' => 'Failed to update profile');
    }

    return array('success' => true, 'message' => 'Profile updated successfully');
}
?>