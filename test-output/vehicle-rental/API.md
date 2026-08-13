# API Documentation

> **Target System**: Vehicle Rental Management  
> **API Protocol**: REST / JSON API  
> **Auth Scheme**: basic  

---

## 1. API Overview
RESTful JSON API specification for **Vehicle Rental Management** supporting Vehicle Rental Management Platform operations.


## 2. API Architecture
Express.js REST API with routing controllers. specifically tuned for serverless_edge performance.


## 3. Base URL / Environment
Base URL: `https://api.vehiclerentalmanagement.com/v1`.


## 4. Authentication
Cookie-based session authentication with CSRF token protection for vehiclerentalmanagement.


## 5. Authorization
Role-based permissions (basic) mapping to: Vehicle Admin, Fleet Manager, Customer / Renter.


## 6. Endpoints
Detailed specifications for all REST API endpoints implemented in the system.


#### User API
- `GET /api/v1/vehiclerentalmanagement-users` — List vehiclerentalmanagement-users
- `POST /api/v1/vehiclerentalmanagement-users` — Create user
- `GET /api/v1/vehiclerentalmanagement-users/:id` — Retrieve user
- `PATCH /api/v1/vehiclerentalmanagement-users/:id` — Update user
- `DELETE /api/v1/vehiclerentalmanagement-users/:id` — Delete user

#### VehicleFleet API
- `GET /api/v1/vehiclefleets` — List vehiclefleets
- `POST /api/v1/vehiclefleets` — Create vehiclefleet
- `GET /api/v1/vehiclefleets/:id` — Retrieve vehiclefleet
- `PATCH /api/v1/vehiclefleets/:id` — Update vehiclefleet
- `DELETE /api/v1/vehiclefleets/:id` — Delete vehiclefleet

#### Customer API
- `GET /api/v1/customers` — List customers
- `POST /api/v1/customers` — Create customer
- `GET /api/v1/customers/:id` — Retrieve customer
- `PATCH /api/v1/customers/:id` — Update customer
- `DELETE /api/v1/customers/:id` — Delete customer

#### RentalReturn API
- `GET /api/v1/rentalreturns` — List rentalreturns
- `POST /api/v1/rentalreturns` — Create rentalreturn
- `GET /api/v1/rentalreturns/:id` — Retrieve rentalreturn
- `PATCH /api/v1/rentalreturns/:id` — Update rentalreturn
- `DELETE /api/v1/rentalreturns/:id` — Delete rentalreturn

#### Vehicle API
- `GET /api/v1/vehicles` — List vehicles
- `POST /api/v1/vehicles` — Create vehicle
- `GET /api/v1/vehicles/:id` — Retrieve vehicle
- `PATCH /api/v1/vehicles/:id` — Update vehicle
- `DELETE /api/v1/vehicles/:id` — Delete vehicle


#### User Management API
- `GET /api/v1/vehiclerentalmanagement-users` — List system users and administrators
- `POST /api/v1/vehiclerentalmanagement-users` — Register a new credentialed user
- `GET /api/v1/vehiclerentalmanagement-users/:id` — Retrieve details for specific user ID

- `POST /api/v1/workflows/vehicle-fleet-catalog` — Execute Vehicle Fleet Catalog
- `POST /api/v1/workflows/customer-reservations` — Execute Customer Reservations
- `POST /api/v1/workflows/rental-return-tracking` — Execute Rental Return Tracking
- `POST /api/v1/workflows/vehicle-inspection` — Execute Vehicle Inspection


## 7. Request Parameters
URL parameters: `page`, `limit`, `sort`, `filter[vehiclefleet_status]`.


## 8. Request Body
JSON payload format enforced via strict validation schemas (Zod) mapping to VehicleFleet, Customer, RentalReturn models.


## 9. Response Structure
Standard envelope: `{ success: true, data: {...}, timestamp: "..." }` returned by vehiclerentalmanagement endpoints.


## 10. HTTP Status Codes
200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 500 Internal Error.


## 11. Error Responses
Error payload format: `{ success: false, error: { code: "INVALID_VEHICLERENTALMANAGEMENT_INPUT", message: "..." } }`.


## 12. Validation Rules
Strict schema type validation on all request parameters and body payloads for VehicleFleet, Customer, RentalReturn, Vehicle.


## 13. Pagination
Cursor-based or offset pagination for VehicleFleet record lists with default limit of 20 items.


## 14. Filtering & Sorting
Filtering via `filter[status]` and sorting via `sort=-created_at` across VehicleFleet tables.


## 15. Rate Limiting
Max 100 requests per minute per IP address for vehiclerentalmanagement.


## 16. Versioning
API endpoints versioned via URL path prefix (`/v1`).


## 17. Security Considerations
CORS header validation, rate limiting, and sanitization for low risk profile protecting VehicleFleet, Customer, RentalReturn data.


## 18. External API Integrations
External API service endpoints for VehicleFleet.