# Zero-to-Shipped Resume Parser

Upload a text-based PDF resume and a job description to get a Gemini-generated fit score, matching skills, and missing skills. Each successful comparison is saved to MongoDB; resume text is not stored.

## Local setup

1. Install dependencies from the repository root: `npm install`.
2. Copy `backend/.env.example` to `backend/.env`.
3. Set `MONGO_URI` to a reachable MongoDB database and `GEMINI_API_KEY` to a Google AI Studio Gemini API key.
4. Start the frontend and backend with `npm run dev`.
5. Open the Vite URL shown in the terminal. The frontend proxies `/api` requests to the local Express backend.

`GEMINI_MODEL` is optional and defaults to `gemini-2.5-flash`. Never add API keys or MongoDB credentials to frontend variables or commit them.

## Deploy to Vercel

Import the repository as one Vercel project with the repository root as the project root. The root `vercel.json` defines two services: `frontend` serves the Vite site, and `backend` serves the Express API. The public `/api/*` rewrite sends API requests to the backend; all other paths go to the frontend.

Add these environment variables to the Vercel project for every environment you deploy:

- `GEMINI_API_KEY`: Google AI Studio API key.
- `MONGO_URI`: MongoDB Atlas connection string for a database the deployment can reach.
- `GEMINI_MODEL` (optional): Gemini model name; defaults to `gemini-2.5-flash`.

For MongoDB Atlas, allow connections from your deployment and keep database credentials restricted. The `/api/health` endpoint checks MongoDB connectivity and Gemini configuration. A successful `/api/compare` request parses the PDF, calls Gemini, and writes the analysis record to MongoDB; it returns an error rather than reporting success if MongoDB is unavailable.

The backend and frontend do not call each other as server-side services: the browser calls the public `/api` route on the same deployment, so no Vercel service binding is needed.
