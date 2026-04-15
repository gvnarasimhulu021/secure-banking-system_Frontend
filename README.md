# Secure Banking Frontend

A React frontend for a secure banking system with JWT authentication, role-based routes, and Axios API integration.

## Features

- Login with JWT authentication
- Protected routes for authenticated users
- Role-based redirect for `ADMIN` and `USER`
- User dashboard, admin dashboard, account details, and transactions pages
- Axios interceptor to attach JWT token
- Bootstrap UI, loading states, and error handling

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm run dev
   ```
3. Update `VITE_API_BASE_URL` in `vite.config.js` or create an `.env` file to point to your Spring Boot backend.

## Netlify Deployment

1. Build the project for production:
   ```bash
   npm run build
   ```
2. Create a Netlify site and connect it to this repository.
3. Set the publish directory to `dist` and the build command to:
   ```bash
   npm run build
   ```
4. Add an environment variable in Netlify called `VITE_API_BASE_URL` and set it to your production backend URL, for example:
   ```bash
   https://api.your-domain.com/api
   ```
5. Ensure single-page app routing works by using the provided `netlify.toml` configuration.
6. Deploy and verify client-side routing by opening routes like `/dashboard`, `/admin`, or `/account` directly in the browser.

## Production Testing

- Use `npm run build` to create an optimized production build.
- Use `npm run preview` to locally preview the production output.
