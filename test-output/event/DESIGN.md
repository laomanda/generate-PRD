# Design System & UX Specification

> **Target System**: EventVibe Ticket Engine  
> **Visual Vibe**: Modern IDE Dark (Zinc & Indigo)  
> **Design Complexity**: moderate  

---

## 1. Design Overview
Visual design system for **EventVibe Ticket Engine** supporting EventVibe Ticket Engine Platform operations.


## 2. Design Principles
Interface Clarity, Event Data Legibility, Task Efficiency, Operational Speed.


## 3. Visual Direction
Modern UI design direction utilizing High-Energy Neon (Electric Purple #9333EA, Neon Cyan #22D3EE, Midnight Background #0F172A) guidelines tailored specifically for EventVibe Ticket Engine.


## 4. Color System
Color palette tokens: High-Energy Neon (Electric Purple #9333EA, Neon Cyan #22D3EE, Midnight Background #0F172A) defined in CSS variables matching Modern IDE Dark (Zinc & Indigo) aesthetics for EventVibe Ticket Engine.


## 5. Typography
Typography tokens: Inter / Geist Sans for EventVibe Ticket Engine UI body text, JetBrains Mono for Event code identifiers.


## 6. Spacing System
Tailwind baseline scale (4px/8px) configured for data-dense Event grid tables and forms.


## 7. Border Radius
Rounded corner tokens customized for EventVibe Admin views: sm (4px) for Event tags, md (6px) for Ticket inputs, lg (8px) for modal containers.


## 8. Elevation & Shadows
Elevation surfaces layered specifically for Event list items and Ticket drawer dialogs.


## 9. Layout & Grid
12-column responsive fluid layout grid with 20px gutters customized for EventVibe Ticket Engine.


## 10. Responsive Design
Fluid responsive viewports scaling across mobile, tablet, and desktop displays for EventVibe Admin, Event Organizer, Attendee.


## 11. Breakpoints
Responsive layout breakpoints tuned for EventVibe Admin viewports: Mobile (sm: 640px), Tablet (md: 768px), Desktop Workspace (lg: 1024px, xl: 1280px).


## 12. Components
Dedicated component suite for EventVibe Ticket Engine: EventCard, EventTable, EventFormModal, TicketCard, TicketTable, TicketFormModal, AttendeeCard, AttendeeTable, AttendeeFormModal, QrCard, QrTable, QrFormModal.


## 13. Component Variants
Status badges and button variants for Event, Ticket, Attendee lifecycle states.


## 14. Component States
Interactive UI states (Default, Hover, Active, Focus-Visible, Disabled, Loading) for EventVibe Admin and Event Organizer and Attendee actions.


## 15. Pages & Screens
Primary application views: Event Creation Screen, Ticket Sales Screen, Attendee Registration Screen, QR Check-in Screen.


## 16. Navigation
Navigation sidebar mapping core domain workspaces: Event Management, Ticket Management, Attendee Management, Qr Management.


## 17. User Flows
Step-by-step UI task flow for executing Event Creation.


## 18. Interaction & Behavior
Optimistic UI state updates for Event mutations with sub-16ms touch responsiveness.


## 19. Forms & Validation UX
Strict Zod schema form validation with inline error messages for Event, Ticket, Attendee inputs.


## 20. Loading States
Skeleton shimmer loading placeholders geometry-matched to Event data tables.


## 21. Empty States
Empty state callout encouraging EventVibe Admin users to register their first Event.


## 22. Error States
Toast notifications and alert banners for EventVibe Ticket Engine operational failure events.


## 23. Success Feedback
Auto-dismissing success toasts confirming Event creation and state updates.


## 24. Animation & Motion
150ms ease-out transitions for Ticket detail drawers and modal dialogs.


## 25. UX Rules
Never hide active loading indicators. Always require confirm modal for destructive Event state changes.


## 26. Accessibility
WCAG 2.1 AA accessibility compliance for EventVibe Admin, Event Organizer, Attendee viewports.


## 27. Iconography
Lucide-React icon set customized for Event actions and EventVibe Admin, Event Organizer, Attendee workflows.


## 28. Imagery & Assets
Optimized WebP graphics and vector icons representing EventVibe Ticket Engine resources.


## 29. Design Tokens
Design token schema exporting High-Energy Neon (Electric Purple #9333EA, Neon Cyan #22D3EE, Midnight Background #0F172A) variables directly to Tailwind CSS.


## 30. Design Decisions & Rationale
High-legibility layout and contrast scale chosen to minimize cognitive friction for EventVibe Admin and Event Organizer users.