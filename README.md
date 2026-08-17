# Full-Stack Authentication System (MERN)

A complete, production-style authentication system with:

- JWT **access tokens** (short-lived, sent in memory / Authorization header) + **refresh tokens** (long-lived, stored as httpOnly cookies, rotated on every use)
- Password hashing with bcrypt (12 salt rounds)
- Register, Login, Logout, Silent refresh, Get current user
- Forgot password / Reset password flow (token hashed + expires in 10 min)
- Account lockout after 5 failed login attempts (15 min lock)
- Rate limiting on auth endpoints
- Role-based route protection (`user` / `admin`)
- React Context for global auth state + auto-refresh axios interceptor
- Protected routes via React Router

## Why access + refresh tokens?

Access tokens are short-lived (15 min) and kept only in memory on the frontend (not localStorage), which limits the damage if the token leaks via XSS. Refresh tokens are long-lived (7 days), stored in an httpOnly cookie (JS on the page can't read it, which limits XSS theft), and rotated every time they're used — if a stolen refresh token is reused after rotation, the server detects it and invalidates all sessions for that user.

## Backend setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in real secrets + your MongoDB URI
npm run dev
```

Generate strong secrets for `.env`, e.g.:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173`.

## API Endpoints

| Method | Endpoint                          | Auth required | Description                     |
|--------|------------------------------------|----------------|----------------------------------|
| POST   | /api/auth/register                | No             | Create account                  |
| POST   | /api/auth/login                   | No             | Log in                          |
| POST   | /api/auth/refresh                 | No (cookie)    | Get new access token             |
| POST   | /api/auth/logout                  | No             | Invalidate refresh token         |
| GET    | /api/auth/me                      | Yes            | Get current user                 |
| POST   | /api/auth/forgot-password         | No             | Request reset token              |
| POST   | /api/auth/reset-password/:token   | No             | Set new password                 |
| GET    | /api/protected/dashboard          | Yes            | Example protected resource       |
| GET    | /api/protected/admin              | Yes (admin)    | Example role-restricted resource |

## Things to change before production

1. Set `NODE_ENV=production` so cookies get `secure: true` (HTTPS only).
2. Wire up a real email service (e.g. SendGrid, Resend) in `forgotPassword` instead of returning the token in the response.
3. Add HTTPS + a proper reverse proxy (nginx) in front of the Node server.
4. Consider adding email verification on registration (the `isVerified` field is already scaffolded on the User model).
5. Move `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` into a secrets manager rather than a `.env` file.
