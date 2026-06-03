# Backend Ready Checklist (Before Frontend)

- [x] Auth endpoints (`login`, `logout`, `me`) implemented.
- [x] Core CRUD APIs available (`products`, `purchases`, `sales`, `expenses`, `cuts`).
- [x] Role-based visibility/permissions enforced (admin/vendor).
- [x] Dashboard summary endpoint implemented with date/month filters.
- [x] Monthly report endpoint implemented (`/api/reports/monthly/`).
- [x] Closed-period constraints enforced for sales and expenses.
- [x] Standardized API error schema (`code`, `detail`, `field_errors`).
- [x] Pagination enabled globally.
- [x] Backend tests passing.
- [x] API contract documented in `docs/api-contract.md`.
- [x] Backend runbook documented in `docs/runbook-backend.md`.

## Suggested Frontend Kickoff Order

1. Implement auth flow against `/api/auth/login/`, `/api/auth/me/`, `/api/auth/logout/`.
2. Build role-aware route guards (admin/vendor).
3. Integrate dashboard with `/api/reports/dashboard/` and monthly selector (`/api/reports/monthly/`).
4. Integrate paginated list screens for products, sales, expenses.
5. Implement standardized error rendering from `code/detail/field_errors`.
