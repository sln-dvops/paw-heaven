# Pet Heaven

Pet Heaven is a React + Vite frontend for browsing pet profiles, adoption requests, events, educational content, and staff management.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Netlify: import the Git repository, build command `npm run build`, publish directory `dist`. The `public/_redirects` file handles SPA routes.

## Project structure

- `src/pages/`: route pages
- `src/components/`: shared UI
- `src/context/AppContext.jsx`: browser-side application state
- `src/data/`: initial content and image mappings
- `src/styles/main.css`: site styles
- `public/images/`: website photographs and graphics

## Important before public use

This version stores accounts, applications, staff changes and selected donations only in each visitor's local browser. It is not multi-user authentication or a real payment service. Do not accept actual applications, sensitive documents or payments using this setup. A shared backend and secure access controls are required for a public service.
