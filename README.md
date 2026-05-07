# FitPulse Fitness App

A React fitness training app with workout browsing, challenges, user dashboard, and admin screens.

## Run Locally

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:5173/
```

## Build For Deployment

```bash
npm run build
```

The deployable static files are generated in `dist/`.

## Environment

The frontend expects a backend URL in `.env`:

```text
REACT_APP_BACKEND_URL=your_backend_url_here
```