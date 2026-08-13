# Database Specification

> **DBMS Engine**: PostgreSQL  
> **Database Name**: vehicle_rental_management  
> **Domain Industry**: Vehicle Rental Management Platform  
> **Database Complexity**: relational_fk  

---

## 1. Database Overview
Relational schema design for **Vehicle Rental Management** supporting ACID transactional integrity across 5 domain entity tables, optimized for the rental sector.


## 2. Database Technology
Database Engine: **PostgreSQL** configured specifically for Vehicle Rental Management schema storage with connection pooling.


## 3. Database Architecture
Primary-Replica HA deployment model supporting serverless_edge scalability requirements of Vehicle Rental Management.


## 4. Schema Overview
Relational tables cataloging domain entities for Vehicle Rental Management Platform: `vehiclerentalmanagement_users`, `vehiclefleets`, `customers`, `rentalreturns`, `vehicles`.


## 5. Entity Relationship Diagram
```mermaid
erDiagram
    VEHICLERENTALMANAGEMENT_USERS {
        UUID id PK
        VARCHAR_184_ email
        VARCHAR_276_ password_hash
        VARCHAR_50_ role
    }
    VEHICLEFLEETS {
        UUID id PK
        VARCHAR_100_ code
        VARCHAR_255_ name
        VARCHAR_100_ category
    }
    CUSTOMERS {
        UUID id PK
        UUID user_id FK
        VARCHAR_100_ reference_code
        TIMESTAMP_WITH_TIME_ZONE start_time
    }
    RENTALRETURNS {
        UUID id PK
        UUID parent_id FK
        VARCHAR_100_ action_type
        TEXT details
    }
    VEHICLES {
        UUID id PK
        UUID parent_id FK
        VARCHAR_100_ action_type
        TEXT details
    }
    VEHICLERENTALMANAGEMENT_USERS ||--o{ CUSTOMERS : "Belongs to system user"
    VEHICLERENTALMANAGEMENT_USERS ||--o{ RENTALRETURNS : "Belongs to system user"
    VEHICLERENTALMANAGEMENT_USERS ||--o{ VEHICLES : "Belongs to system user"

```


## 6. Tables
Primary entity tables: `vehiclerentalmanagement_users`, `vehiclefleets`, `customers`, `rentalreturns`, `vehicles`, and system `vehicle_rental_management_audit_logs`.


## 7. Columns & Data Types
**vehiclerentalmanagement_users**: `id` (UUID), `email` (VARCHAR(184)), `password_hash` (VARCHAR(276)), `role` (VARCHAR(50)), `created_at` (TIMESTAMP WITH TIME ZONE)

**vehiclefleets**: `id` (UUID), `code` (VARCHAR(100)), `name` (VARCHAR(255)), `category` (VARCHAR(100)), `status` (VARCHAR(50)), `created_at` (TIMESTAMP WITH TIME ZONE)

**customers**: `id` (UUID), `user_id` (UUID), `reference_code` (VARCHAR(100)), `start_time` (TIMESTAMP WITH TIME ZONE), `end_time` (TIMESTAMP WITH TIME ZONE), `status` (VARCHAR(50))

**rentalreturns**: `id` (UUID), `parent_id` (UUID), `action_type` (VARCHAR(100)), `details` (TEXT), `created_at` (TIMESTAMP WITH TIME ZONE)

**vehicles**: `id` (UUID), `parent_id` (UUID), `action_type` (VARCHAR(100)), `details` (TEXT), `created_at` (TIMESTAMP WITH TIME ZONE)


## 8. Primary Keys
All Vehicle Rental Management domain tables enforce RFC 4122 random UUID primary keys.


## 9. Foreign Keys
`customers.user_id` → `vehiclerentalmanagement_users.id` ON DELETE CASCADE

`rentalreturns.user_id` → `vehiclerentalmanagement_users.id` ON DELETE CASCADE

`vehicles.user_id` → `vehiclerentalmanagement_users.id` ON DELETE CASCADE


## 10. Relationships
**Customer → User**: Belongs to system user (1:N)

**RentalReturn → User**: Belongs to system user (1:N)

**Vehicle → User**: Belongs to system user (1:N)


## 11. Constraints
NOT NULL (email, password_hash, role); UNIQUE (email); NOT NULL (code, name, status); UNIQUE (code); NOT NULL (user_id, reference_code, status); UNIQUE (reference_code); NOT NULL (action_type, created_at); NOT NULL (action_type, created_at)


## 12. Unique Constraints
UNIQUE indexes on natural key identifiers and authentication email addresses in the vehicle_rental_management catalog.


## 13. Indexes
idx_vehiclerentalmanagement_users_email (email), idx_vehiclerentalmanagement_users_role (role), idx_vehiclefleets_code (code), idx_vehiclefleets_status (status), idx_customers_user (user_id), idx_customers_ref (reference_code), idx_rentalreturns_created (created_at), idx_vehicles_created (created_at)


## 14. Database Business Rules
Enforces domain business state transitions across entity lifecycles (pending_activation, active, suspended, archived, available, reserved).


## 15. Authentication Data
User credentials and security tokens managed in `vehiclerentalmanagement_users` with Argon2id hashing.


## 16. Authorization Data
Role-Based Access Control (RBAC) permissions stored in `vehiclerentalmanagement_users.role` attributes.


## 17. Row-Level Security / Access Policies
PostgreSQL Row-Level Security (RLS) policies enabled on `vehiclerentalmanagement_users`, `vehiclefleets`, `customers`, `rentalreturns`, `vehicles` for client-level isolation.


## 18. Data Validation
CHECK constraints enforcing positive boundaries and non-empty strings on Vehicle Rental Management records.


## 19. Migrations
Version-controlled SQL migration scripts executing pre-release schema updates for the vehicle_rental_management schema.


## 20. Seed Data
Initial development seed fixtures for `vehiclerentalmanagement_users`, `vehiclefleets`, `customers`, `rentalreturns`, `vehicles`.


## 21. Transactions & Data Integrity
ACID transactional boundaries with SERIALIZABLE isolation for mutations in Vehicle Rental Management.


## 22. Backup & Recovery
Automated WAL archive snapshots for Vehicle Rental Management with point-in-time recovery (PITR).


## 23. Database Security
Encrypted connections requiring TLS 1.3 and secret key vault integration for Vehicle Rental Management.


## 24. Performance Considerations
Sub-50ms query latency targets using EXPLAIN ANALYZE execution plan auditing on the PostgreSQL engine.


## 25. Data Retention
Soft-delete pattern with 90-day archive retention policies.


## 26. Database Change Log
Audit table logging schema migration versions for Vehicle Rental Management.