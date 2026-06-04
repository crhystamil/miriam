# Quickstart: Acceso por celular para mayoristas

## Prerequisites

- Frontend dependencies installed in `frontend/`.
- Mayorista products view available or represented by the target mayorista route.

## Verification Steps

1. Build the frontend from `frontend/`:

   ```bash
   npm run build
   ```

2. Start the frontend using the project's normal development command.

3. Open the mayorista products route with no prior access session.

   Expected result: the phone access form is shown and mayorista product information is hidden.

4. Try to continue with an empty phone number.

   Expected result: an empty-number message is shown and content remains hidden.

5. Try to continue with letters or a clearly incomplete number.

   Expected result: a correction message is shown and content remains hidden.

6. Enter a valid phone number.

   Expected result: access is enabled and the mayorista products view is shown within 30 seconds.

7. Refresh the browser during the same session.

   Expected result: access remains enabled and the mayorista view stays visible.

8. End the browser session or clear the access state, then reopen the mayorista route.

   Expected result: the phone access form is shown again.

9. Open an internal mayorista link directly without an access session.

   Expected result: phone access is required before content is shown.

## Success Criteria Mapping

- SC-001 is validated by completing access with a valid number in under 30 seconds.
- SC-002 and SC-005 are validated by direct access attempts without a valid session.
- SC-003 is validated by empty, incomplete, and invalid number checks.
- SC-004 is validated by reviewing the access screen copy with users or reviewers.
