# FishingGear Pro

Clean setup for React frontend + PHP backend.

## Project Layout

- `Frontend/` — React app (Vite)
- `Backend/` — PHP backend logic
- `api.php` — API entry used by React
- `Backend/KvalDB.sql` — SQL schema/data file
- `images/` — product images

## Run the App (localhost:5173)

1. Start XAMPP services:
   - Apache
   - MySQL
2. Start React frontend:
   - `cd Frontend`
   - `npm install` (first time only)
   - `npm run dev -- --host 0.0.0.0 --port 5173`
3. Open:
   - `http://localhost:5173`

## Backend Notes

- React calls `http://localhost/KvalDarbs/api.php`
- Core runtime backend files:
  - `Backend/config.php`
  - `Backend/auth.php`
  - `Backend/products.php`
  - `Backend/cart.php`
  - `Backend/orders.php`
  - `Backend/contact.php`

## Important

- Use `Frontend/` as the development folder.
- Any old `react-app/` references are legacy and should be ignored.
