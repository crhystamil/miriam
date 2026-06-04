# Quickstart: Resolver conflicto de acceso admin

## Prerequisites

- Backend dependencies installed from `backend/requirements.txt`.
- Frontend dependencies installed in `frontend/`.
- Development servers available for backend and frontend.

## Verification Steps

1. Run backend checks from `backend/`:

   ```bash
   python manage.py check
   ```

2. Build the frontend from `frontend/`:

   ```bash
   npm run build
   ```

3. Start the backend and frontend using the project's normal development commands.

4. Visit `/admin/` directly in the browser.

   Expected result: the administrative login for the backend is shown, not the portal login.

5. Visit `/login` directly in the browser.

   Expected result: the portal login remains available.

6. Visit a protected portal route without an authenticated portal session.

   Expected result: the user is redirected to `/login`.

7. Visit the renamed portal administration route without an authenticated portal session.

   Expected result: the user is redirected to `/login` and `/admin/` remains reserved for the backend panel.

## Success Criteria Mapping

- SC-001 and SC-002 are validated by direct `/admin/` navigation.
- SC-003 is validated by completing login with an administrative account.
- SC-004 is validated by direct `/login` navigation.
- SC-005 is validated by checking protected portal routes and the renamed portal administration route.
