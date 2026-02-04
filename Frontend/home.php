<?php
// Home page - Products listing

$page = isset($_GET['page_num']) ? (int)$_GET['page_num'] : 1;
$limit = 12;
$offset = ($page - 1) * $limit;

$total = get_product_count($category, $search);
$total_pages = ceil($total / $limit);
$products = get_all_products($category, $search, $limit, $offset);
$categories = get_categories();
?>

<div class="hero">
    <div class="hero-content">
        <h1>Welcome to FishingGear Pro</h1>
        <p>Your Ultimate Destination for Premium Fishing Equipment</p>
        <form method="GET" class="search-bar">
            <input type="hidden" name="page" value="home">
            <input type="text" name="search" placeholder="Search for fishing gear..." value="<?php echo htmlspecialchars($search); ?>">
            <button type="submit">Search</button>
        </form>
    </div>
</div>

<div class="shop-container">
    <!-- Sidebar with filters -->
    <aside class="filters">
        <h3>Categories</h3>
        <ul class="category-list">
            <li><a href="index.php?page=home" class="<?php echo !$category ? 'active' : ''; ?>">All Products</a></li>
            <?php foreach ($categories as $cat): ?>
                <li>
                    <a href="index.php?page=home&category=<?php echo urlencode($cat['category']); ?>" 
                       class="<?php echo $category === $cat['category'] ? 'active' : ''; ?>">
                        <?php echo ucfirst($cat['category']); ?>
                    </a>
                </li>
            <?php endforeach; ?>
        </ul>
    </aside>

    <!-- Main content -->
    <main class="products-section">
        <div class="section-header">
            <h2><?php echo $category ? ucfirst($category) : 'All Products'; ?></h2>
            <p><?php echo $total; ?> products found</p>
        </div>

        <div class="products-grid">
            <?php if (!empty($products)): ?>
                <?php foreach ($products as $product): ?>
                    <div class="product-card">
                        <div class="product-image">
                            <div class="image-placeholder">
                                <p>No Image</p>
                            </div>
                        </div>
                        <div class="product-info">
                            <h3><?php echo htmlspecialchars($product['name']); ?></h3>
                            <p class="category-badge"><?php echo ucfirst($product['category']); ?></p>
                            <p class="description"><?php echo substr($product['description'], 0, 80); ?>...</p>
                            <div class="product-footer">
                                <span class="price">$<?php echo number_format($product['price'], 2); ?></span>
                                <span class="stock <?php echo $product['stock'] > 0 ? 'in-stock' : 'out-stock'; ?>">
                                    <?php echo $product['stock'] > 0 ? 'In Stock' : 'Out of Stock'; ?>
                                </span>
                            </div>
                            <a href="index.php?page=product&id=<?php echo $product['id']; ?>" class="btn-details">View Details</a>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p class="no-products">No products found</p>
            <?php endif; ?>
        </div>

        <!-- Pagination -->
        <?php if ($total_pages > 1): ?>
            <div class="pagination">
                <?php if ($page > 1): ?>
                    <a href="index.php?page=home&page_num=1<?php echo $category ? '&category=' . urlencode($category) : ''; ?>" class="page-link">First</a>
                    <a href="index.php?page=home&page_num=<?php echo $page - 1; ?><?php echo $category ? '&category=' . urlencode($category) : ''; ?>" class="page-link">Previous</a>
                <?php endif; ?>

                <?php for ($i = max(1, $page - 2); $i <= min($total_pages, $page + 2); $i++): ?>
                    <a href="index.php?page=home&page_num=<?php echo $i; ?><?php echo $category ? '&category=' . urlencode($category) : ''; ?>" 
                       class="page-link <?php echo $i === $page ? 'active' : ''; ?>">
                        <?php echo $i; ?>
                    </a>
                <?php endfor; ?>

                <?php if ($page < $total_pages): ?>
                    <a href="index.php?page=home&page_num=<?php echo $page + 1; ?><?php echo $category ? '&category=' . urlencode($category) : ''; ?>" class="page-link">Next</a>
                    <a href="index.php?page=home&page_num=<?php echo $total_pages; ?><?php echo $category ? '&category=' . urlencode($category) : ''; ?>" class="page-link">Last</a>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </main>
</div>
