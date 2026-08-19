<?php
require_once __DIR__ . '/../config.php';

// Standard response shape for contact operations.
function contact_result($success, $successMessage, $errorMessage) {
    return array(
        'success' => $success,
        'message' => $success ? $successMessage : $errorMessage
    );
}

// Stores a contact form message in the database.
function send_contact_message($name, $email, $subject, $message) {
    global $conn;
    
    // Save message to database
    $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $subject, $message);
    
    return contact_result($stmt->execute(), 'Message sent successfully! We will respond soon.', 'Failed to send message. Please try again.');
}

// Returns all contact messages in reverse chronological order.
function get_all_contact_messages() {
    global $conn;
    
    $result = $conn->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
    return $result->fetch_all(MYSQLI_ASSOC);
}
?>