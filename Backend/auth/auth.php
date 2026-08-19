<?php
require_once __DIR__ . '/../config.php';

// Standard response shape for auth operations.
function auth_result($success, $message) {
    return array('success' => $success, 'message' => $message);
}

// Validates username format used across registration/profile updates.
function is_valid_username($username) {
    return (bool) preg_match('/^[A-Za-z0-9_]{3,30}$/', $username);
}

// Validates password strength policy enforced in backend.
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

// Creates a user account with validation and password hashing.
function register_user($username, $email, $password, $first_name = '', $last_name = '') {
    global $conn;

    $username = trim($username);
    $email = trim($email);

    if (!is_valid_username($username)) {
        return auth_result(false, 'Username must be 3-30 characters and use letters, numbers, or underscore');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return auth_result(false, 'Invalid email address');
    }

    if (!is_valid_password($password)) {
        return auth_result(false, 'Password must be at least 8 characters, include one uppercase letter, one special character, and have no leading or trailing spaces');
    }
    
    // Check if user already exists
    $check = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $check->bind_param("ss", $username, $email);
    $check->execute();
    
    if ($check->get_result()->num_rows > 0) {
        return auth_result(false, 'Username or email already exists');
    }
    
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    
    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (username, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $username, $email, $hashed_password, $first_name, $last_name);
    
    if ($stmt->execute()) {
        return auth_result(true, 'Registration successful');
    } else {
        error_log('Registration failed: ' . $conn->error);
        return auth_result(false, 'Registration failed');
    }
}

// Authenticates a user and writes the session identity.
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
            return auth_result(true, 'Login successful');
        } else {
            return auth_result(false, 'Invalid credentials');
        }
    }
    
    return auth_result(false, 'Invalid credentials');
}

// Destroys the current session and clears session cookie.
function logout_user() {
    $_SESSION = array();

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }

    session_destroy();
    return auth_result(true, 'Logged out successfully');
}

// Returns whether a user session exists.
function is_logged_in() {
    return isset($_SESSION['user_id']);
}

// Returns authenticated user id or null.
function get_current_user_id() {
    return $_SESSION['user_id'] ?? null;
}

// Checks whether current session is configured admin user.
function is_admin() {
    if (!is_logged_in()) {
        return false;
    }

    // Admin username can be configured with ADMIN_USERNAME env var.
    $adminUsername = getenv('ADMIN_USERNAME') ?: 'Ippijs';
    $username = $_SESSION['username'] ?? '';
    return $username === $adminUsername;
}

// Updates username/email and optional password for an existing user.
function update_user_profile($user_id, $username, $email, $new_password = '') {
    global $conn;

    $user_id = (int)$user_id;
    $username = trim($username);
    $email = trim($email);

    if ($user_id <= 0 || $username === '' || $email === '') {
        return auth_result(false, 'Username and email are required');
    }

    if (!is_valid_username($username)) {
        return auth_result(false, 'Username must be 3-30 characters and use letters, numbers, or underscore');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return auth_result(false, 'Invalid email address');
    }

    $check = $conn->prepare("SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?");
    $check->bind_param("ssi", $username, $email, $user_id);
    $check->execute();

    if ($check->get_result()->num_rows > 0) {
        return auth_result(false, 'Username or email already exists');
    }

    if ($new_password !== '') {
        if (!is_valid_password($new_password)) {
            return auth_result(false, 'Password must be at least 8 characters, include one uppercase letter, one special character, and have no leading or trailing spaces');
        }

        $hashed_password = password_hash($new_password, PASSWORD_BCRYPT);
        $stmt = $conn->prepare("UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?");
        $stmt->bind_param("sssi", $username, $email, $hashed_password, $user_id);
    } else {
        $stmt = $conn->prepare("UPDATE users SET username = ?, email = ? WHERE id = ?");
        $stmt->bind_param("ssi", $username, $email, $user_id);
    }

    if (!$stmt->execute()) {
        return auth_result(false, 'Failed to update profile');
    }

    return auth_result(true, 'Profile updated successfully');
}
?>