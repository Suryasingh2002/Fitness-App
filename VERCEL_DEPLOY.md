# Vercel Frontend Deploy

Use these settings on Vercel:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

For now, add this environment variable in Vercel if you want the deployed frontend to call the current temporary backend:

```text
REACT_APP_BACKEND_URL=https://gaintrack-84.preview.emergentagent.com
```

Later, when the MongoDB backend is deployed, replace that value with the new backend URL.

Important: MongoDB is the database. The backend still needs to be hosted somewhere, such as Render, Railway, Vercel Serverless Functions, or another Node/Python backend host, and that backend will connect to MongoDB Atlas.
