# Clair Frontend

The React/Vite frontend lives separately from the Express backend.

## Run locally

1. Start the backend on port `9000`.
2. From this directory, install dependencies and start Vite:

   ```sh
   npm install
   npm run dev
   ```

3. Open the URL printed by Vite. Its development proxy forwards the existing backend routes to `http://localhost:9000`.

Set `VITE_BACKEND_URL` in a frontend `.env` file if the backend uses another local URL. Do not put private backend API keys in frontend environment variables.

## API integration

The app uses the existing `/auth`, `/api/profile`, `/doctors`, `/appointments`, `/admin`, and `/notifications` endpoints. Auth tokens are held in `sessionStorage` for the current browser session and sent as Bearer tokens; the backend cookie is also accepted.

Admin dashboard access requires an already provisioned admin account. Public registration creates patient accounts only.
