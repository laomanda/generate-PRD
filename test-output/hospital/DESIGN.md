# Design System & UX Specification

> **Target System**: CareFlow Hospital Suite  
> **Visual Vibe**: Modern IDE Dark (Zinc & Indigo)  
> **Design Complexity**: moderate  

---

## 1. Design Overview
Visual design system for **CareFlow Hospital Suite** supporting CareFlow Hospital Suite Platform operations.


## 2. Design Principles
Interface Clarity, Patient Data Legibility, Task Efficiency, Operational Speed.


## 3. Visual Direction
Modern UI design direction utilizing Clinical Clean (Calm Teal #0D9488, Soft Slate #0F172A, Pure White #FFFFFF) guidelines tailored specifically for CareFlow Hospital Suite.


## 4. Color System
Color palette tokens: Clinical Clean (Calm Teal #0D9488, Soft Slate #0F172A, Pure White #FFFFFF) defined in CSS variables matching Modern IDE Dark (Zinc & Indigo) aesthetics for CareFlow Hospital Suite.


## 5. Typography
Typography tokens: Inter / Geist Sans for CareFlow Hospital Suite UI body text, JetBrains Mono for Patient code identifiers.


## 6. Spacing System
Tailwind baseline scale (4px/8px) configured for data-dense Patient grid tables and forms.


## 7. Border Radius
Rounded corner tokens customized for CareFlow Admin views: sm (4px) for Patient tags, md (6px) for Doctor inputs, lg (8px) for modal containers.


## 8. Elevation & Shadows
Elevation surfaces layered specifically for Patient list items and Doctor drawer dialogs.


## 9. Layout & Grid
12-column responsive fluid layout grid with 20px gutters customized for CareFlow Hospital Suite.


## 10. Responsive Design
Fluid responsive viewports scaling across mobile, tablet, and desktop displays for CareFlow Admin, Clinical Provider, Patient.


## 11. Breakpoints
Responsive layout breakpoints tuned for CareFlow Admin viewports: Mobile (sm: 640px), Tablet (md: 768px), Desktop Workspace (lg: 1024px, xl: 1280px).


## 12. Components
Dedicated component suite for CareFlow Hospital Suite: PatientCard, PatientTable, PatientFormModal, DoctorCard, DoctorTable, DoctorFormModal, AppointmentsCard, AppointmentsTable, AppointmentsFormModal, MedicalRecordsCard, MedicalRecordsTable, MedicalRecordsFormModal, PrescriptionsCard, PrescriptionsTable, PrescriptionsFormModal.


## 13. Component Variants
Status badges and button variants for Patient, Doctor, Appointments lifecycle states.


## 14. Component States
Interactive UI states (Default, Hover, Active, Focus-Visible, Disabled, Loading) for CareFlow Admin and Clinical Provider and Patient actions.


## 15. Pages & Screens
Primary application views: Patient Registration Screen, Doctor Management Screen, Appointments Screen, Medical Records Screen, Prescriptions Screen.


## 16. Navigation
Navigation sidebar mapping core domain workspaces: Patient Management, Doctor Management, Appointments Management, MedicalRecords Management, Prescriptions Management.


## 17. User Flows
Step-by-step UI task flow for executing Patient Registration.


## 18. Interaction & Behavior
Optimistic UI state updates for Patient mutations with sub-16ms touch responsiveness.


## 19. Forms & Validation UX
Strict Zod schema form validation with inline error messages for Patient, Doctor, Appointments inputs.


## 20. Loading States
Skeleton shimmer loading placeholders geometry-matched to Patient data tables.


## 21. Empty States
Empty state callout encouraging CareFlow Admin users to register their first Patient.


## 22. Error States
Toast notifications and alert banners for CareFlow Hospital Suite operational failure events.


## 23. Success Feedback
Auto-dismissing success toasts confirming Patient creation and state updates.


## 24. Animation & Motion
150ms ease-out transitions for Doctor detail drawers and modal dialogs.


## 25. UX Rules
Never hide active loading indicators. Always require confirm modal for destructive Patient state changes.


## 26. Accessibility
WCAG 2.1 AA accessibility compliance for CareFlow Admin, Clinical Provider, Patient viewports.


## 27. Iconography
Lucide-React icon set customized for Patient actions and CareFlow Admin, Clinical Provider, Patient workflows.


## 28. Imagery & Assets
Optimized WebP graphics and vector icons representing CareFlow Hospital Suite resources.


## 29. Design Tokens
Design token schema exporting Clinical Clean (Calm Teal #0D9488, Soft Slate #0F172A, Pure White #FFFFFF) variables directly to Tailwind CSS.


## 30. Design Decisions & Rationale
High-legibility layout and contrast scale chosen to minimize cognitive friction for CareFlow Admin and Clinical Provider users.