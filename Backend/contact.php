<?php
require_once 'config.php';

function send_contact_message($name, $email, $subject, $message) {
    global $conn;
    
    // Save message to database
    $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $subject, $message);
    
    if ($stmt->execute()) {
        return array('success' => true, 'message' => 'Message sent successfully! We will respond soon.');
    } else {
        return array('success' => false, 'message' => 'Failed to send message. Please try again.');
    }
}

function get_all_contact_messages() {
    global $conn;
    
    $result = $conn->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
    return $result->fetch_all(MYSQLI_ASSOC);
}
?>

