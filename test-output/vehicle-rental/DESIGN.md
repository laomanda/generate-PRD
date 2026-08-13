# Design System & UX Specification

> **Target System**: Vehicle Rental Management  
> **Visual Vibe**: Modern IDE Dark (Zinc & Indigo)  
> **Design Complexity**: moderate  

---

## 1. Design Overview
Visual design system for **Vehicle Rental Management** supporting Vehicle Rental Management Platform operations.


## 2. Design Principles
Interface Clarity, VehicleFleet Data Legibility, Task Efficiency, Operational Speed.


## 3. Visual Direction
Modern UI design direction utilizing Industrial Fleet (Steel Blue #1E3A8A, Safety Amber #F59E0B, Dark Metal #111827) guidelines tailored specifically for Vehicle Rental Management.


## 4. Color System
Color palette tokens: Industrial Fleet (Steel Blue #1E3A8A, Safety Amber #F59E0B, Dark Metal #111827) defined in CSS variables matching Modern IDE Dark (Zinc & Indigo) aesthetics for Vehicle Rental Management.


## 5. Typography
Typography tokens: Inter / Geist Sans for Vehicle Rental Management UI body text, JetBrains Mono for VehicleFleet code identifiers.


## 6. Spacing System
Tailwind baseline scale (4px/8px) configured for data-dense VehicleFleet grid tables and forms.


## 7. Border Radius
Rounded corner tokens customized for Vehicle Admin views: sm (4px) for VehicleFleet tags, md (6px) for Customer inputs, lg (8px) for modal containers.


## 8. Elevation & Shadows
Elevation surfaces layered specifically for VehicleFleet list items and Customer drawer dialogs.


## 9. Layout & Grid
12-column responsive fluid layout grid with 20px gutters customized for Vehicle Rental Management.


## 10. Responsive Design
Fluid responsive viewports scaling across mobile, tablet, and desktop displays for Vehicle Admin, Fleet Manager, Customer / Renter.


## 11. Breakpoints
Responsive layout breakpoints tuned for Vehicle Admin viewports: Mobile (sm: 640px), Tablet (md: 768px), Desktop Workspace (lg: 1024px, xl: 1280px).


## 12. Components
Dedicated component suite for Vehicle Rental Management: VehicleFleetCard, VehicleFleetTable, VehicleFleetFormModal, CustomerCard, CustomerTable, CustomerFormModal, RentalReturnCard, RentalReturnTable, RentalReturnFormModal, VehicleCard, VehicleTable, VehicleFormModal.


## 13. Component Variants
Status badges and button variants for VehicleFleet, Customer, RentalReturn lifecycle states.


## 14. Component States
Interactive UI states (Default, Hover, Active, Focus-Visible, Disabled, Loading) for Vehicle Admin and Fleet Manager and Customer / Renter actions.


## 15. Pages & Screens
Primary application views: Vehicle Fleet Catalog Screen, Customer Reservations Screen, Rental Return Tracking Screen, Vehicle Inspection Screen.


## 16. Navigation
Navigation sidebar mapping core domain workspaces: VehicleFleet Management, Customer Management, RentalReturn Management, Vehicle Management.


## 17. User Flows
Step-by-step UI task flow for executing Vehicle Fleet Catalog.


## 18. Interaction & Behavior
Optimistic UI state updates for VehicleFleet mutations with sub-16ms touch responsiveness.


## 19. Forms & Validation UX
Strict Zod schema form validation with inline error messages for VehicleFleet, Customer, RentalReturn inputs.


## 20. Loading States
Skeleton shimmer loading placeholders geometry-matched to VehicleFleet data tables.


## 21. Empty States
Empty state callout encouraging Vehicle Admin users to register their first VehicleFleet.


## 22. Error States
Toast notifications and alert banners for Vehicle Rental Management operational failure events.


## 23. Success Feedback
Auto-dismissing success toasts confirming VehicleFleet creation and state updates.


## 24. Animation & Motion
150ms ease-out transitions for Customer detail drawers and modal dialogs.


## 25. UX Rules
Never hide active loading indicators. Always require confirm modal for destructive VehicleFleet state changes.


## 26. Accessibility
WCAG 2.1 AA accessibility compliance for Vehicle Admin, Fleet Manager, Customer / Renter viewports.


## 27. Iconography
Lucide-React icon set customized for VehicleFleet actions and Vehicle Admin, Fleet Manager, Customer / Renter workflows.


## 28. Imagery & Assets
Optimized WebP graphics and vector icons representing Vehicle Rental Management resources.


## 29. Design Tokens
Design token schema exporting Industrial Fleet (Steel Blue #1E3A8A, Safety Amber #F59E0B, Dark Metal #111827) variables directly to Tailwind CSS.


## 30. Design Decisions & Rationale
High-legibility layout and contrast scale chosen to minimize cognitive friction for Vehicle Admin and Fleet Manager users.