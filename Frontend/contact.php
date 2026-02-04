<?php
// Contact page

$message = '';
$name = $email = $subject = $message_text = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once 'Backend/contact.php';
    
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
    $message_text = isset($_POST['message']) ? trim($_POST['message']) : '';
    
    if (!empty($name) && !empty($email) && !empty($subject) && !empty($message_text)) {
        $result = send_contact_message($name, $email, $subject, $message_text);
        if ($result['success']) {
            $message = '<div class="alert alert-success">' . $result['message'] . '</div>';
            $name = $email = $subject = $message_text = '';
        } else {
            $message = '<div class="alert alert-error">' . $result['message'] . '</div>';
        }
    } else {
        $message = '<div class="alert alert-error">Please fill in all fields.</div>';
    }
}
?>

<div class="contact-container">
    <h1>Contact Us</h1>

    <div class="contact-content">
        <div class="contact-info">
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you! Reach out with any questions or feedback.</p>

            <div class="contact-details">
                <div class="detail-item">
                    <h3>Email</h3>
                    <p><a href="mailto:kristersmateuss@gmail.com">kristersmateuss@gmail.com</a></p>
                </div>

                <div class="detail-item">
                    <h3>Phone</h3>
                    <p><a href="tel:+37126369452">+371 26 369 452</a></p>
                </div>

                <div class="detail-item">
                    <h3>Address</h3>
                    <p>Fishing Street 123<br>Riga, Latvia LV-1234</p>
                </div>

                <div class="detail-item">
                    <h3>Hours</h3>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM<br>
                    Saturday: 10:00 AM - 4:00 PM<br>
                    Sunday: Closed</p>
                </div>
            </div>
        </div>

        <div class="contact-form-wrapper">
            <h2>Send us a Message</h2>
            <?php if ($message) echo $message; ?>
            <form class="contact-form" method="POST">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($name); ?>" required>
                </div>

                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($email); ?>" required>
                </div>

                <div class="form-group">
                    <label for="subject">Subject:</label>
                    <input type="text" id="subject" name="subject" value="<?php echo htmlspecialchars($subject); ?>" required>
                </div>

                <div class="form-group">
                    <label for="message">Message:</label>
                    <textarea id="message" name="message" rows="5" required><?php echo htmlspecialchars($message_text); ?></textarea>
                </div>

                <button type="submit" class="btn-primary">Send Message</button>
            </form>
        </div>
    </div>
</div>
