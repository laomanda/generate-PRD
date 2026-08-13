# API Documentation

> **Target System**: EventVibe Ticket Engine  
> **API Protocol**: REST / JSON API  
> **Auth Scheme**: basic  

---

## 1. API Overview
RESTful JSON API specification for **EventVibe Ticket Engine** supporting EventVibe Ticket Engine Platform operations.


## 2. API Architecture
Next.js App Router API Route Handlers (Serverless Functions). specifically tuned for serverless_edge performance.


## 3. Base URL / Environment
Base URL: `https://api.eventvibeticketengine.com/v1`.


## 4. Authentication
Cookie-based session authentication with CSRF token protection for eventvibeticketengine.


## 5. Authorization
Role-based permissions (basic) mapping to: EventVibe Admin, Event Organizer, Attendee.


## 6. Endpoints
Detailed specifications for all REST API endpoints implemented in the system.


#### User API
- `GET /api/v1/eventvibeticketengine-users` — List eventvibeticketengine-users
- `POST /api/v1/eventvibeticketengine-users` — Create user
- `GET /api/v1/eventvibeticketengine-users/:id` — Retrieve user
- `PATCH /api/v1/eventvibeticketengine-users/:id` — Update user
- `DELETE /api/v1/eventvibeticketengine-users/:id` — Delete user

#### Event API
- `GET /api/v1/events` — List events
- `POST /api/v1/events` — Create event
- `GET /api/v1/events/:id` — Retrieve event
- `PATCH /api/v1/events/:id` — Update event
- `DELETE /api/v1/events/:id` — Delete event

#### Ticket API
- `GET /api/v1/tickets` — List tickets
- `POST /api/v1/tickets` — Create ticket
- `GET /api/v1/tickets/:id` — Retrieve ticket
- `PATCH /api/v1/tickets/:id` — Update ticket
- `DELETE /api/v1/tickets/:id` — Delete ticket

#### Attendee API
- `GET /api/v1/attendees` — List attendees
- `POST /api/v1/attendees` — Create attendee
- `GET /api/v1/attendees/:id` — Retrieve attendee
- `PATCH /api/v1/attendees/:id` — Update attendee
- `DELETE /api/v1/attendees/:id` — Delete attendee

#### Qr API
- `GET /api/v1/qrs` — List qrs
- `POST /api/v1/qrs` — Create qr
- `GET /api/v1/qrs/:id` — Retrieve qr
- `PATCH /api/v1/qrs/:id` — Update qr
- `DELETE /api/v1/qrs/:id` — Delete qr


#### User Management API
- `GET /api/v1/eventvibeticketengine-users` — List system users and administrators
- `POST /api/v1/eventvibeticketengine-users` — Register a new credentialed user
- `GET /api/v1/eventvibeticketengine-users/:id` — Retrieve details for specific user ID

- `POST /api/v1/workflows/event-creation` — Execute Event Creation
- `POST /api/v1/workflows/ticket-sales` — Execute Ticket Sales
- `POST /api/v1/workflows/attendee-registration` — Execute Attendee Registration
- `POST /api/v1/workflows/qr-check-in` — Execute QR Check-in


## 7. Request Parameters
URL parameters: `page`, `limit`, `sort`, `filter[event_status]`.


## 8. Request Body
JSON payload format enforced via strict validation schemas (Zod) mapping to Event, Ticket, Attendee models.


## 9. Response Structure
Standard envelope: `{ success: true, data: {...}, timestamp: "..." }` returned by eventvibeticketengine endpoints.


## 10. HTTP Status Codes
200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 500 Internal Error.


## 11. Error Responses
Error payload format: `{ success: false, error: { code: "INVALID_EVENTVIBETICKETENGINE_INPUT", message: "..." } }`.


## 12. Validation Rules
Strict schema type validation on all request parameters and body payloads for Event, Ticket, Attendee, Qr.


## 13. Pagination
Cursor-based or offset pagination for Event record lists with default limit of 20 items.


## 14. Filtering & Sorting
Filtering via `filter[status]` and sorting via `sort=-created_at` across Event tables.


## 15. Rate Limiting
Max 100 requests per minute per IP address for eventvibeticketengine.


## 16. Versioning
API endpoints versioned via URL path prefix (`/v1`).


## 17. Security Considerations
CORS header validation, rate limiting, and sanitization for low risk profile protecting Event, Ticket, Attendee data.


## 18. External API Integrations
External API service endpoints for Event.