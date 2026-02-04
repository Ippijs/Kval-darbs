<?php
require_once 'config.php';

function register_user($username, $email, $password, $first_name = '', $last_name = '') {
    global $conn;
    
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
        return array('success' => false, 'message' => 'Registration failed: ' . $conn->error);
    }
}

function login_user($username, $password) {
    global $conn;
    
    $stmt = $conn->prepare("SELECT id, username, email, password, first_name FROM users WHERE username = ? OR email = ?");
    $stmt->bind_param("ss", $username, $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['first_name'] = $user['first_name'];
            return array('success' => true, 'message' => 'Login successful');
        } else {
            return array('success' => false, 'message' => 'Invalid password');
        }
    }
    
    return array('success' => false, 'message' => 'User not found');
}

function logout_user() {
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
    // Check if current user is the admin account
    $username = $_SESSION['username'] ?? '';
    return $username === 'Ippijs';
}
?>
