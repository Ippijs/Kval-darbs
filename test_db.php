<?php
// Test database connection
require_once 'Backend/config.php';

echo "<h2>Database Connection Test</h2>";

if ($conn->connect_error) {
    echo "<p style='color: red;'>❌ Connection failed: " . $conn->connect_error . "</p>";
    echo "<p>Current settings:</p>";
    echo "<ul>";
    echo "<li>Host: " . DB_HOST . "</li>";
    echo "<li>User: " . DB_USER . "</li>";
    echo "<li>Database: " . DB_NAME . "</li>";
    echo "</ul>";
    echo "<p><strong>Common fixes:</strong></p>";
    echo "<ul>";
    echo "<li>Check if XAMPP MySQL is running</li>";
    echo "<li>Try changing port: localhost (default 3306) or localhost:3307</li>";
    echo "<li>Verify database name in phpMyAdmin</li>";
    echo "</ul>";
} else {
    echo "<p style='color: green;'>✅ Connected successfully to database!</p>";
    echo "<p>Connection details:</p>";
    echo "<ul>";
    echo "<li>Host: " . DB_HOST . "</li>";
    echo "<li>Database: " . DB_NAME . "</li>";
    echo "</ul>";
    
    // Test if products table exists
    $result = $conn->query("SHOW TABLES LIKE 'products'");
    if ($result->num_rows > 0) {
        echo "<p style='color: green;'>✅ Products table exists</p>";
        
        // Count products
        $count = $conn->query("SELECT COUNT(*) as count FROM products")->fetch_assoc();
        echo "<p>Products in database: " . $count['count'] . "</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Products table not found. Run db_init.php to create tables.</p>";
    }
    
    // Test if users table exists
    $result = $conn->query("SHOW TABLES LIKE 'users'");
    if ($result->num_rows > 0) {
        echo "<p style='color: green;'>✅ Users table exists</p>";
        
        $count = $conn->query("SELECT COUNT(*) as count FROM users")->fetch_assoc();
        echo "<p>Users in database: " . $count['count'] . "</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Users table not found.</p>";
    }
}

$conn->close();
?>
