# Stellar Portfolio Journey

An interactive 3D solar system portfolio built with React, Three.js, and TypeScript. Navigate through a visually stunning universe to explore professional experience, technical skills, and projects.

## Features

- Interactive 3D Solar System visualization using Three.js
- Responsive design for desktop and mobile devices
- Smooth animations and planetary navigation
- Modern UI components with Shadcn/UI
- Tailwind CSS styling for rapid development
- Performance optimized with React and Vite
- SEO optimized meta tags
- Accessible navigation controls

## Tech Stack

- React 18+ with TypeScript
- Three.js for 3D graphics
- React Three Fiber for React-Three integration
- Vite for fast build and development
- Tailwind CSS for styling
- Shadcn/UI component library
- Zustand for state management
- React Router for navigation
- React Query for data management

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/VaibhavChauhan7299/My-Portfolio.git
cd My-Portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The portfolio will open at `http://localhost:8080`

## Navigation

- **WASD Keys**: Move through space
- **Arrow Keys**: Look around
- **Mouse**: Click planets to view details
- **Mobile**: Use on-screen joystick for movement
- **Help Icon**: View keyboard shortcuts

## Portfolio Sections

The solar system represents different aspects of the portfolio:

- **Mercury**: About Me - Personal introduction and background
- **Venus**: Tech Stack - Technical skills and technologies
- **Earth**: Key Projects - Notable projects and achievements
- **Mars**: Professional Experience - Work experience and roles
- **Jupiter**: Education & Timeline - Educational background and certifications
- **Saturn**: Skills & Expertise - Core competencies and proficiencies
- **Neptune**: Contact & Connect - Social links and contact information

## Project Structure

```
src/
├── components/
│   ├── three/              # 3D components
│   │   ├── SolarSystem.tsx
│   │   ├── Planet.tsx
│   │   ├── OrbitRing.tsx
│   │   └── Stars.tsx
│   ├── ui/                 # UI components
│   │   ├── PlanetInfoModal.tsx
│   │   ├── HUDOverlay.tsx
│   │   ├── WarpNavigation.tsx
│   │   └── ...
│   └── NavLink.tsx
├── pages/
│   ├── Index.tsx          # Main portfolio page
│   └── NotFound.tsx
├── store/
│   └── gameStore.ts       # Zustand store with planet data
├── hooks/
│   └── use-mobile.tsx
├── lib/
│   └── utils.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Build Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (outputs to dist/)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages

```bash
npm run build
git subtree push --prefix dist origin gh-pages
```

## Customization

To customize the portfolio with your own information:

1. **Edit Portfolio Data**: Modify `src/store/gameStore.ts` to update planet information, titles, and descriptions
2. **Change Colors**: Update hex color values in the planet definitions
3. **Update Meta Tags**: Edit `index.html` and `src/pages/Index.tsx` for SEO information
4. **Customize UI**: Modify components in `src/components/ui/` using Tailwind CSS

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Fully responsive

## Performance

- Optimized Three.js rendering with LOD (Level of Detail)
- Lazy loading of components
- Production build optimization with Vite
- CSS purging with Tailwind
- Efficient state management with Zustand

## Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Semantic HTML structure
- Mobile-friendly controls
- Help overlay with navigation guide

## License

MIT License - feel free to use this portfolio as a template

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

## Author

Vaibhav Chauhan - [GitHub](https://github.com/VaibhavChauhan7299) | [LinkedIn](https://linkedin.com/in/vaibhav-chauhan-3a7b8b)
