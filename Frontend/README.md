# FishingGear Pro - React Frontend

This is a React application that works with your existing PHP backend.

## Setup

1. Install dependencies:
```bash
cd Frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173` and connect to your PHP backend on `http://localhost/KvalDarbs/`

## Building for Production

```bash
npm run build
```

This creates a `dist` folder with optimized files ready to deploy.

## How It Works

- React frontend calls your PHP API endpoints via `/api.php`
- Cart data is stored in browser localStorage
- Styling is ported from your original CSS
- All API communication uses your existing Backend/ PHP files

## Features

- Product listing with categories and search
- Product detail pages
- Shopping cart (client-side storage)
- User authentication (login/register)
- Responsive design
- Admin capabilities (when logged in as admin)
