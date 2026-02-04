# React + PHP Migration Guide

Your project now has a **React frontend** alongside your existing PHP backend!

## What Changed

### New Structure
```
KvalDarbs/
├── Backend/           (unchanged - your PHP API)
├── Frontend/          (unchanged - old PHP pages)
├── react-app/         (NEW - React frontend)
│   ├── src/
│   │   ├── pages/     (Home, Product, Cart, Login, etc.)
│   │   ├── components/ (Navbar, Alert, etc.)
│   │   ├── api/       (API client & hooks)
│   │   ├── App.jsx    (Main app component)
│   │   └── index.css  (Your styling, ported to CSS)
│   ├── package.json
│   └── vite.config.js
├── index.php          (unchanged)
├── api.php            (unchanged)
└── SETUP.html         (new - quick start guide)
```

## How to Get Started

### Option 1: Use React (Recommended)
```bash
cd react-app
npm install
npm run dev
```
Then open: **http://localhost:5173**

### Option 2: Keep Using PHP
Your original setup still works:
```bash
# XAMPP → Start Apache
# Visit: http://localhost/KvalDarbs/
```

## Key Points

✅ **React app communicates with your PHP backend**
- All API calls go to `/api.php`
- Your Backend/ folder stays exactly the same
- Database connection is unchanged

✅ **Your styling is ported to React**
- All CSS from `style.css` is in `react-app/src/index.css`
- Same colors, layout, responsive design

✅ **Cart works client-side**
- Stored in browser's localStorage
- No server-side changes needed

✅ **Authentication flows through PHP**
- Login/Register calls your `Backend/auth.php`
- Session management uses your existing system

## Features Included

- 🏪 Product listing with filters & search
- 🛒 Shopping cart
- 👤 User login/register
- 📱 Responsive design
- 🎯 Clean component structure

## Next Steps (Optional)

1. **Test the React app** - Make sure products load, cart works, login works
2. **Customize styling** - Edit `react-app/src/index.css`
3. **Add more features** - Create new components in `src/pages/` or `src/components/`
4. **Deploy** - When ready, run `npm run build` to create optimized `dist/` folder

## Troubleshooting

**React app won't load products?**
- Check that XAMPP is running (PHP backend)
- Verify your PHP API endpoints are working
- Check browser console for errors

**CORS errors?**
- Update `vite.config.js` proxy settings if needed
- Ensure your PHP backend allows the requests

**Port 5173 in use?**
- Run: `npm run dev -- --port 3000` to use a different port

---

You can now develop with **modern React** while keeping your reliable **PHP backend**! 🎣
