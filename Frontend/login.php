<?php
// Login page

$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    
    if (empty($username) || empty($password)) {
        $message = '<div class="alert alert-error">Please fill in all fields</div>';
    } else {
        $result = login_user($username, $password);
        if ($result['success']) {
            $message = '<div class="alert alert-success">' . $result['message'] . '</div>';
            echo '<meta http-equiv="refresh" content="2;url=index.php">';
        } else {
            $message = '<div class="alert alert-error">' . $result['message'] . '</div>';
        }
    }
}
?>

<div class="auth-container">
    <div class="auth-box">
        <h1>Login</h1>
        
        <?php if ($message) echo $message; ?>

        <form method="POST" class="auth-form">
            <div class="form-group">
                <label for="username">Username or Email:</label>
                <input type="text" id="username" name="username" required autofocus>
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>

            <button type="submit" class="btn-primary btn-block">Login</button>
        </form>

        <p class="auth-link">Don't have an account? <a href="index.php?page=register">Register here</a></p>
    </div>
</div>
