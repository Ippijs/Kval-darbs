<?php
// Database connection settings with environment variable overrides.
define('DB_HOST', getenv('DB_HOST') ?: 'localhost:3307');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'KvalDB');

// Shared MySQL connection used by backend modules.
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    error_log('Database connection failed: ' . $conn->connect_error);
    http_response_code(500);
    die('Database connection failed');
}

// Ensure UTF-8 data is read/written consistently.
$conn->set_charset("utf8");
?>
