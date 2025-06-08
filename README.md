# BlogTruyen - Manga Reading Website

A modern, responsive manga reading website built with React 18, TypeScript, and Vite. Features a clean UI, mobile-first design, and integration with OTruyenAPI.

## 🚀 Features

- **Modern Tech Stack**: React 18 + TypeScript + Vite + Tailwind CSS
- **Responsive Design**: Mobile-first approach with touch-friendly interface
- **Manga Reading**: Optimized reader with image preloading and smooth scrolling
- **Search & Browse**: Advanced search and category filtering
- **Hero Banner**: Auto-sliding carousel with manga highlights
- **State Management**: Zustand for efficient state handling
- **API Integration**: OTruyenAPI with TanStack Query for data fetching
- **Internationalization**: Support for English and Vietnamese
- **Theme Support**: Light/dark mode toggle
- **Performance**: Code splitting and optimized builds

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v3.4.17, shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite with optimized chunking
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BlogTruyen
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

## 🌍 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# API Configuration
VITE_API_BASE_URL=https://otruyenapi.com/v1/api

# App Configuration
VITE_APP_NAME=BlogTruyen
VITE_APP_VERSION=1.0.0

# Theme Configuration
VITE_PRIMARY_COLOR=#1B6FA8
VITE_ACCENT_COLOR=#F4B333

# Feature Flags
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_ANALYTICS=false
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Build

```bash
npm run build
npm run preview
```

## 📱 Mobile Features

- Touch-friendly navigation
- Responsive grid layouts (2-3-4-5 columns)
- Optimized image loading
- Smooth scrolling reader
- Mobile-first design approach

## 🎨 Design System

- **Primary Color**: #1B6FA8 (Blue)
- **Accent Color**: #F4B333 (Yellow)
- **Typography**: System fonts with fallbacks
- **Components**: shadcn/ui with custom styling
- **Responsive**: Mobile (2 cols) → Tablet (4 cols) → Desktop (5 cols)

## 📚 API Integration

Uses OTruyenAPI with the following endpoints:
- `/home` - Homepage data
- `/danh-sach/{type}` - Manga lists
- `/the-loai` - Categories
- `/the-loai/{slug}` - Manga by category
- `/truyen-tranh/{slug}` - Manga details
- `/tim-kiem` - Search functionality

## 🔧 Development

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For support, email [your-email] or create an issue on GitHub.
