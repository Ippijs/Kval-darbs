<?php
// Register page

$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm_password']);
    $first_name = trim($_POST['first_name']);
    $last_name = trim($_POST['last_name']);
    
    if (empty($username) || empty($email) || empty($password) || empty($confirm_password)) {
        $message = '<div class="alert alert-error">Please fill in all fields</div>';
    } elseif ($password !== $confirm_password) {
        $message = '<div class="alert alert-error">Passwords do not match</div>';
    } elseif (strlen($password) < 6) {
        $message = '<div class="alert alert-error">Password must be at least 6 characters</div>';
    } else {
        $result = register_user($username, $email, $password, $first_name, $last_name);
        if ($result['success']) {
            $message = '<div class="alert alert-success">' . $result['message'] . '. <a href="index.php?page=login">Login now</a></div>';
        } else {
            $message = '<div class="alert alert-error">' . $result['message'] . '</div>';
        }
    }
}
?>

<div class="auth-container">
    <div class="auth-box">
        <h1>Register</h1>
        
        <?php if ($message) echo $message; ?>

        <form method="POST" class="auth-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="first_name">First Name:</label>
                    <input type="text" id="first_name" name="first_name" required>
                </div>
                <div class="form-group">
                    <label for="last_name">Last Name:</label>
                    <input type="text" id="last_name" name="last_name" required>
                </div>
            </div>

            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
            </div>

            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>

            <div class="form-group">
                <label for="confirm_password">Confirm Password:</label>
                <input type="password" id="confirm_password" name="confirm_password" required>
            </div>

            <button type="submit" class="btn-primary btn-block">Register</button>
        </form>

        <p class="auth-link">Already have an account? <a href="index.php?page=login">Login here</a></p>
    </div>
</div>
