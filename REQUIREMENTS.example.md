# Example requirements (for agent when not using GitHub)

## Feature: GET /api/version

Return the application version from package.json.

### Acceptance criteria

- GET /api/version returns HTTP 200
- Response is JSON with a `version` field
- `version` matches the `version` in package.json

### Notes

- Use existing server style (plain http, routes object in src/server.js).
