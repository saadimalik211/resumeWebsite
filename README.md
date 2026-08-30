# Saad Malik — Resume Website

Modern developer portfolio and resume site built with [Astro](https://astro.build) and TypeScript, deployed automatically to GitHub Pages.

**Live site:** https://saadimalik211.github.io/resumeWebsite/ *(after first deploy)*

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:4321/resumeWebsite/ in your browser.

## Updating Resume Content

Edit the typed data file at [`src/data/resume.ts`](src/data/resume.ts). All page sections pull from this single source of truth.

Replace [`public/SaadMalikResume.pdf`](public/SaadMalikResume.pdf) when you have an updated PDF.

## Build & Preview

```bash
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## CI/CD

Every push to `main` triggers the [Deploy to GitHub Pages](.github/workflows/deploy.yml) workflow:

1. Install dependencies (`npm ci`)
2. Build the static site (`npm run build`)
3. Deploy the `dist/` artifact to GitHub Pages

### One-time GitHub Setup

1. Create a repo named `resumeWebsite` under your GitHub account
2. Push this project to the `main` branch
3. Go to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**
4. The workflow runs automatically on push

### Using a User Site Instead

If the repo is named `<username>.github.io`, update [`astro.config.mjs`](astro.config.mjs):

```js
export default defineConfig({
  site: "https://saadimalik211.github.io",
  base: "/",
  output: "static",
});
```

## Project Structure

```
src/
├── data/resume.ts       # Resume content (typed)
├── components/          # UI sections
├── layouts/Layout.astro # HTML shell + theme init
├── pages/index.astro    # Single-page site
└── styles/global.css    # Theme variables + animations
```

## Tech Stack

- Astro 7 (static site generation)
- TypeScript (strict)
- CSS custom properties (dark/light themes)
- GitHub Actions + GitHub Pages
