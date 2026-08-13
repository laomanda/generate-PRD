# System Architecture

> **Target System**: Vehicle Rental Management  
> **Database Engine**: PostgreSQL  
> **Auth Complexity**: basic  

---

## 1. Architecture Overview
System architectural blueprint for **Vehicle Rental Management** supporting Vehicle Rental Management Platform operations.


## 2. Architecture Style
Decoupled Client-Server Architecture for Vehicle Rental Management.


## 3. System Components
React Client, Express API Server, PostgreSQL Database Engine.

```mermaid
flowchart TD
    Client[Client Browser (Vehicle Admin)]
    API[Vehicle Rental Management Express API Server]
    Controllers[VehicleFleet Controllers & Services]
    DB[(Database: PostgreSQL)]
    
    Client -- REST Requests --> API
    API -- Dispatches to --> Controllers
    Controllers -- Queries (vehiclerentalmanagement_users, vehiclefleets, customers) --> DB
  
```


## 4. Application Layers
Presentation layer, Application layer, Core domain logic layer managing VehicleFleet, Customer, RentalReturn, Vehicle, Data access layer.


## 5. Frontend Architecture
React SPA (Single Page Application) for Vehicle Rental Management with client-side routing.


## 6. Backend Architecture
Express.js Node server providing REST API controllers for the rental domain.


## 7. Database Architecture
Relational PostgreSQL schema hosting core tables: vehiclerentalmanagement_users, vehiclefleets, customers, rentalreturns, vehicles with connection pooling.


## 8. API Architecture
API interface mapping request/response schema validation and routing for VehicleFleet controllers.


## 9. Authentication Architecture
Standard session cookie management for Vehicle Rental Management.


## 10. Authorization Architecture
Role-based access checks (basic) enforcing permissions across roles: Vehicle Admin, Fleet Manager, Customer / Renter for VehicleFleet, Customer, RentalReturn entities.


## 11. Data Flow
Browser -> React Context -> Axios HTTP -> Express API -> Service Layer -> PostgreSQL.


## 12. User Request Flow
User Action (Vehicle Admin) -> Validation -> Express.js Node server providing REST API controllers for the rental domain. -> VehicleFleet DB Query -> Client Response.


## 13. External Integrations
External API integrations serving VehicleFleet data sources.


## 14. Dependency Boundaries
Core VehicleFleet domain logic decoupled from UI rendering framework in the vehicle-rental-management codebase.


## 15. Security Boundaries
Strict CORS policies, Rate limiting, and Input Validation enforcing protection over VehicleFleet, Customer, RentalReturn records for low risk profile.


## 16. Folder / Module Structure
Directory layout under `vehicle-rental-management/` organized by domain modules: vehiclefleet, customer, rentalreturn, vehicle.


## 17. State Management Architecture
Global Zustand store dispatching state updates for VehicleFleet client cache.


## 18. Error Handling Strategy
Global Error Boundaries & structured JSON error payloads generated during VehicleFleet mutation failures.


## 19. Logging & Observability
Structured JSON application logging tracking Vehicle Fleet Catalog and Customer Reservations and Rental Return Tracking and Vehicle Inspection execution.


## 20. Caching Strategy
Edge caching for static assets, memory cache for VehicleFleet lookup keys.


## 21. Performance Considerations
Optimized query indexing on vehiclerentalmanagement_users, vehiclefleets, customers tables for serverless_edge throughput.


## 22. Scalability Considerations
Horizontal auto-scaling for Vehicle Rental Management backend services under serverless_edge workloads.


## 23. Reliability Considerations
Circuit breaker pattern and automated database retry policies for VehicleFleet mutations.


## 24. Architectural Decisions
Decoupled architecture selected to isolate VehicleFleet domain rules from UI presentation.


## 25. Trade-offs
Decoupled architecture increases initial setup complexity but enables independent scaling of VehicleFleet micro-services.


## 26. Known Architectural Constraints
Relational constraints and transaction latency bounds on VehicleFleet state transitions.