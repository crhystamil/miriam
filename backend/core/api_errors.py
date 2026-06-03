from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def error_response(*, code: str, detail: str, status_code: int, field_errors=None) -> Response:
    payload = {
        "code": code,
        "detail": detail,
        "field_errors": field_errors or {},
    }
    return Response(payload, status=status_code)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response

    detail = response.data
    code = "validation_error"
    field_errors = {}

    if isinstance(detail, dict):
        if "detail" in detail and isinstance(detail["detail"], str):
            message = detail["detail"]
        else:
            message = "Error de validacion."
            field_errors = detail
    elif isinstance(detail, list):
        message = "Error de validacion."
        field_errors = {"non_field_errors": detail}
    else:
        message = str(detail)

    if response.status_code == status.HTTP_401_UNAUTHORIZED:
        code = "authentication_failed"
    elif response.status_code == status.HTTP_403_FORBIDDEN:
        code = "permission_denied"
    elif response.status_code == status.HTTP_404_NOT_FOUND:
        code = "not_found"

    response.data = {
        "code": code,
        "detail": message,
        "field_errors": field_errors,
    }
    return response
