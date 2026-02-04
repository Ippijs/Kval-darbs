# Quick Reference Card

## 🎯 To Run React App

```bash
cd react-app
npm install          # Only first time
npm run dev          # Every time you want to develop
```

Then open: **http://localhost:5173**

## 📂 Project Structure

```
Your app now has:

OLD (still works):
- Frontend/ (PHP pages)
- Backend/ (PHP API)
- index.php

NEW (React):
- react-app/ ← Development here!
```

## 🛠️ What You Can Do

### View Code
- Components: `react-app/src/pages/` and `react-app/src/components/`
- Styling: `react-app/src/index.css`
- API calls: `react-app/src/api/client.js`

### Edit Pages
1. Open file in `react-app/src/pages/`
2. Make changes
3. Save - browser updates automatically!

### Add New Page
1. Create `NewPage.jsx` in `react-app/src/pages/`
2. Add route in `App.jsx`
3. Done!

### Change Styling
1. Edit `react-app/src/index.css`
2. Save - updates instantly

## 🔌 How It Connects

```
React App (Port 5173)
       ↓ (API calls)
Vite Dev Server (Proxy)
       ↓
Your PHP Backend (localhost/KvalDarbs/)
       ↓
Database
```

## ✅ Test Checklist

- [ ] React app loads at http://localhost:5173
- [ ] Products display on home page
- [ ] Can add items to cart
- [ ] Can search/filter products
- [ ] Can click product details
- [ ] Login form appears
- [ ] Navigation works

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| React app won't start | Make sure you're in `react-app/` folder |
| Can't see products | Check XAMPP is running (Apache) |
| "Cannot find module" | Run `npm install` |
| Port 5173 in use | Run `npm run dev -- --port 3000` |
| CORS errors | Check `vite.config.js` proxy settings |

## 📱 Responsive Design

Your app works on:
- ✅ Desktop
- ✅ Tablet  
- ✅ Mobile

All styling uses CSS Grid and Flexbox

## 🎨 Styling Notes

- Colors: Check `:root` in `index.css`
- Breakpoints: `@media (max-width: 768px)`
- All classes start with `.` (CSS, not Tailwind)

## 🔐 Authentication

Login/Register calls:
- `/api.php` (your existing PHP endpoint)
- Returns user data as JSON
- React stores in component state

## 🛒 Cart Behavior

- Stored in browser (`localStorage`)
- Persists after page refresh
- No database needed
- Cleared only if user deletes it

## 📦 Build for Production

When ready to deploy:

```bash
npm run build
```

Creates `dist/` folder with optimized files.

---

**You're all set!** Start with: `cd react-app && npm run dev`
