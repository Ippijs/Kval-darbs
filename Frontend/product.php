<?php
// Product detail page

if (!isset($_GET['id'])) {
    header('Location: index.php');
    exit;
}

$product = get_product_by_id($_GET['id']);

if (!$product) {
    echo "<h2>Product not found</h2>";
    exit;
}

$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!is_logged_in()) {
        $message = '<div class="alert alert-warning">Please <a href="index.php?page=login">login</a> to add items to cart</div>';
    } else {
        $quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : 1;
        if ($quantity > 0 && $quantity <= $product['stock']) {
            $result = add_to_cart(get_current_user_id(), $product['id'], $quantity);
            $message = '<div class="alert alert-' . ($result['success'] ? 'success' : 'error') . '">' . $result['message'] . '</div>';
        } else {
            $message = '<div class="alert alert-error">Invalid quantity</div>';
        }
    }
}
?>

<div class="product-detail">
    <div class="breadcrumb">
        <a href="index.php">Shop</a> > 
        <a href="index.php?category=<?php echo urlencode($product['category']); ?>"><?php echo ucfirst($product['category']); ?></a> > 
        <?php echo htmlspecialchars($product['name']); ?>
    </div>

    <?php if ($message) echo $message; ?>

    <div class="product-detail-container">
        <div class="product-image-large">
            <div class="image-placeholder-large">
                <p>No Image</p>
            </div>
        </div>

        <div class="product-details-info">
            <h1><?php echo htmlspecialchars($product['name']); ?></h1>
            <p class="category-label">Category: <span><?php echo ucfirst($product['category']); ?></span></p>
            
            <div class="product-pricing">
                <h2 class="price">$<?php echo number_format($product['price'], 2); ?></h2>
                <span class="stock-info <?php echo $product['stock'] > 0 ? 'available' : 'unavailable'; ?>">
                    <?php echo $product['stock'] > 0 ? 'In Stock (' . $product['stock'] . ')' : 'Out of Stock'; ?>
                </span>
            </div>

            <div class="product-description">
                <h3>Description</h3>
                <p><?php echo htmlspecialchars($product['description']); ?></p>
            </div>

            <?php if ($product['stock'] > 0): ?>
                <form method="POST" class="add-to-cart-form">
                    <div class="quantity-selector">
                        <label for="quantity">Quantity:</label>
                        <input type="number" id="quantity" name="quantity" min="1" max="<?php echo $product['stock']; ?>" value="1" required>
                    </div>
                    <button type="submit" class="btn-primary btn-large">Add to Cart</button>
                </form>
            <?php else: ?>
                <button class="btn-primary btn-large" disabled>Out of Stock</button>
            <?php endif; ?>

            <div class="product-features">
                <h3>Product Details</h3>
                <ul>
                    <li><strong>SKU:</strong> FG-<?php echo str_pad($product['id'], 4, '0', STR_PAD_LEFT); ?></li>
                    <li><strong>Stock Available:</strong> <?php echo $product['stock']; ?> units</li>
                    <li><strong>Category:</strong> <?php echo ucfirst($product['category']); ?></li>
                </ul>
            </div>
        </div>
    </div>

    <div class="related-products">
        <h3>Similar Products</h3>
        <div class="products-grid">
            <?php 
            $related = get_all_products($product['category'], null, 4, 0);
            foreach ($related as $item):
                if ($item['id'] !== $product['id']):
            ?>
                <div class="product-card">
                    <div class="product-image">
                        <div class="image-placeholder">
                            <p>No Image</p>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3><?php echo htmlspecialchars($item['name']); ?></h3>
                        <span class="price">$<?php echo number_format($item['price'], 2); ?></span>
                        <a href="index.php?page=product&id=<?php echo $item['id']; ?>" class="btn-details">View Details</a>
                    </div>
                </div>
            <?php 
                endif;
            endforeach; 
            ?>
        </div>
    </div>
</div>
