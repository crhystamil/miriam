# Backend Runbook

## 1. Environment Setup

From repository root:

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

## 2. Database Setup

```bash
cd backend
.venv/bin/python manage.py migrate
```

## 3. Seed Demo Data

```bash
cd backend
.venv/bin/python manage.py seed_demo_data
```

Creates:
- admin user: `admin` / `admin12345`
- vendor user: `vendor_demo` / `vendor12345`
- sample products for UI/API integration

## 4. Run Development Server

```bash
cd backend
.venv/bin/python manage.py runserver
```

Default local URL:
- `http://127.0.0.1:8000/`

## 5. Smoke Checks

System:
- `GET /api/system/health/`
- `GET /api/system/version/`
- `GET /api/system/bootstrap/`

Auth:
- `POST /api/auth/login/`
- `GET /api/auth/me/`

Reports:
- `GET /api/reports/dashboard/`
- `GET /api/reports/monthly/?month=YYYY-MM`

## 6. Monthly Closing Flow (Admin)

1. Validate period metrics with `/api/reports/monthly/?month=YYYY-MM`.
2. Create monthly cut via `POST /api/cuts/` with target period.
3. Confirm blocked operations:
   - sales creation in closed period -> blocked
   - expense creation in closed period -> blocked

## 7. Test and Validation

```bash
cd backend
.venv/bin/python manage.py test
.venv/bin/python manage.py check
```

## 8. Troubleshooting

- **401 on protected endpoints**: Login first and send session/cookies.
- **403 for vendor actions**: Verify role-based restrictions in endpoint contract.
- **400 with `invalid_query_params`**: Validate date formats (`YYYY-MM-DD`, `YYYY-MM`).
- **400 on sales/expenses in active work**: Check if a monthly cut already exists for that period.
