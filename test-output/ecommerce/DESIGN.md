# Design System & UX Specification

> **Target System**: EcomSphere Storefront  
> **Visual Vibe**: Modern IDE Dark (Zinc & Indigo)  
> **Design Complexity**: moderate  

---

## 1. Design Overview
Visual design system for **EcomSphere Storefront** supporting EcomSphere Storefront Platform operations.


## 2. Design Principles
Interface Clarity, Product Data Legibility, Task Efficiency, Operational Speed.


## 3. Visual Direction
Modern UI design direction utilizing Industrial Fleet (Steel Blue #1E3A8A, Safety Amber #F59E0B, Dark Metal #111827) guidelines tailored specifically for EcomSphere Storefront.


## 4. Color System
Color palette tokens: Industrial Fleet (Steel Blue #1E3A8A, Safety Amber #F59E0B, Dark Metal #111827) defined in CSS variables matching Modern IDE Dark (Zinc & Indigo) aesthetics for EcomSphere Storefront.


## 5. Typography
Typography tokens: Inter / Geist Sans for EcomSphere Storefront UI body text, JetBrains Mono for Product code identifiers.


## 6. Spacing System
Tailwind baseline scale (4px/8px) configured for data-dense Product grid tables and forms.


## 7. Border Radius
Rounded corner tokens customized for EcomSphere Admin views: sm (4px) for Product tags, md (6px) for Inventory inputs, lg (8px) for modal containers.


## 8. Elevation & Shadows
Elevation surfaces layered specifically for Product list items and Inventory drawer dialogs.


## 9. Layout & Grid
12-column responsive fluid layout grid with 20px gutters customized for EcomSphere Storefront.


## 10. Responsive Design
Fluid responsive viewports scaling across mobile, tablet, and desktop displays for EcomSphere Admin, Fleet Manager, Customer / Renter.


## 11. Breakpoints
Responsive layout breakpoints tuned for EcomSphere Admin viewports: Mobile (sm: 640px), Tablet (md: 768px), Desktop Workspace (lg: 1024px, xl: 1280px).


## 12. Components
Dedicated component suite for EcomSphere Storefront: ProductCard, ProductTable, ProductFormModal, InventoryCard, InventoryTable, InventoryFormModal, ShoppingCartCard, ShoppingCartTable, ShoppingCartFormModal, CheckoutCard, CheckoutTable, CheckoutFormModal, ShippingCard, ShippingTable, ShippingFormModal.


## 13. Component Variants
Status badges and button variants for Product, Inventory, ShoppingCart lifecycle states.


## 14. Component States
Interactive UI states (Default, Hover, Active, Focus-Visible, Disabled, Loading) for EcomSphere Admin and Fleet Manager and Customer / Renter actions.


## 15. Pages & Screens
Primary application views: Product Catalog Screen, Inventory Tracking Screen, Shopping Cart Screen, Checkout Screen, Shipping Screen.


## 16. Navigation
Navigation sidebar mapping core domain workspaces: Product Management, Inventory Management, ShoppingCart Management, Checkout Management, Shipping Management.


## 17. User Flows
Step-by-step UI task flow for executing Product Catalog.


## 18. Interaction & Behavior
Optimistic UI state updates for Product mutations with sub-16ms touch responsiveness.


## 19. Forms & Validation UX
Strict Zod schema form validation with inline error messages for Product, Inventory, ShoppingCart inputs.


## 20. Loading States
Skeleton shimmer loading placeholders geometry-matched to Product data tables.


## 21. Empty States
Empty state callout encouraging EcomSphere Admin users to register their first Product.


## 22. Error States
Toast notifications and alert banners for EcomSphere Storefront operational failure events.


## 23. Success Feedback
Auto-dismissing success toasts confirming Product creation and state updates.


## 24. Animation & Motion
150ms ease-out transitions for Inventory detail drawers and modal dialogs.


## 25. UX Rules
Never hide active loading indicators. Always require confirm modal for destructive Product state changes.


## 26. Accessibility
WCAG 2.1 AA accessibility compliance for EcomSphere Admin, Fleet Manager, Customer / Renter viewports.


## 27. Iconography
Lucide-React icon set customized for Product actions and EcomSphere Admin, Fleet Manager, Customer / Renter workflows.


## 28. Imagery & Assets
Optimized WebP graphics and vector icons representing EcomSphere Storefront resources.


## 29. Design Tokens
Design token schema exporting Industrial Fleet (Steel Blue #1E3A8A, Safety Amber #F59E0B, Dark Metal #111827) variables directly to Tailwind CSS.


## 30. Design Decisions & Rationale
High-legibility layout and contrast scale chosen to minimize cognitive friction for EcomSphere Admin and Fleet Manager users.