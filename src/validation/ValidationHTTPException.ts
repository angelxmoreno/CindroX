import { HTTPException } from "hono/http-exception";

/**
 * ValidationHTTPException represents an HTTP error caused by failed validation.
 */
export class ValidationHTTPException extends HTTPException {
    constructor(validationErrors: unknown) {
        super(400, { message: "Validation failed", cause: validationErrors });
    }
}
