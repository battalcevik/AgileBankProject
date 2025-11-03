# MyBank — Full-Stack Banking App

Tech stack:
- **Backend:** Java 21, Spring Boot 3, Spring Security (JWT + session), JPA/Hibernate, Validation
- **DB:** PostgreSQL 16
- **Frontend:** React + Vite, React Router
- **CI:** GitHub Actions (Java + Node builds)
- **Security CI:** OWASP Dependency-Check, Trivy FS scan
- **Containers:** Dockerfiles + `docker-compose.yml`

## Quickstart (Local)

Prereqs: Docker Desktop, ports 5432/8080/5173 open.

```bash
docker compose up --build
```

Open the UI at http://localhost:5173

Seed admin user:
- **email:** `admin@bank.local`
- **password:** `Password123!`

## Features

- Sign up with email (unique), password, first/last name, **7-digit SSN**, address, phone
- Login to receive **JWT** (Authorization: Bearer) and an HttpSession cookie
- Dashboard shows profile & **checking/savings** accounts
- Forgot/Reset password flow (token returned in UI for demo; would be emailed in prod)
- Handler **Interceptor** in addition to Spring Security demonstrating custom authorization
- Unit test for registration + password hashing

## API (excerpt)

- `POST /api/auth/signup` — `{ email, password, firstName, lastName, address, phone, ssn7 }`
- `POST /api/auth/login` — `{ email, password }` → `{ token, sessionId }`
- `GET /api/users/me` — Authorization: Bearer `<token>`
- `GET /api/accounts/me` — Authorization: Bearer `<token>`
- `POST /api/auth/forgot-password` — `{ email }` → `{ resetToken }`
- `POST /api/auth/reset-password` — `{ token, newPassword }`

## GitHub Actions

- **Backend CI** (`.github/workflows/java.yml`): Maven build & tests
- **Frontend CI** (`.github/workflows/node.yml`): Vite build
- **Security** (`.github/workflows/security.yml`):
  - **OWASP Dependency-Check** (SCA)
  - **Trivy** (vuln/config/secrets)

## Notes

- Change `JWT_SECRET` in `docker-compose.yml` for stronger security.
- In production, serve frontend behind HTTPS and do not expose the reset token in responses.
- Add more unit/integration tests for coverage.
