Frontend (React + Vite)

Quick start:

cd frontend
npm install
npm run dev

The dev server will host the frontend on a port (default 5173). When using Azure Static Web Apps, the `api` folder should be mapped to the functions API so calls to `/api/*` will be proxied to the functions.

Production & styling notes

- Build for production:

	cd frontend
	npm install
	npm run build

	The `dist/` folder will contain the static assets. Azure Static Web Apps or any static host (Netlify, Vercel, S3+CloudFront) can serve the built files.

- Styling and animations

	This project uses a lightweight bespoke stylesheet in `src/styles.css` and `framer-motion` for list animations. For a more extensive design system (tokens, dark/light themes, utility classes) consider adding Tailwind CSS or a component library.

- Performance & accessibility

	- Keep images optimized and prefer SVGs for icons.
	- Use semantic elements and ARIA attributes when you add more interactive controls.
	- For production, set proper cache headers on static assets and enable gzipped/brotli compression.
