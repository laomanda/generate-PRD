import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildDesignIR(project: ProjectModel): DocumentIR {
  const builder = new DocumentIRBuilder('DESIGN', `Design System & UX Specification`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Visual Vibe', project.designVibe)
    .setMetadata('Design Complexity', project.signals.designComplexity);

  const isHealth = project.domain.industryType === 'healthcare';
  const isEcom = project.domain.industryType === 'ecommerce';
  const isEvent = project.domain.industryType === 'event';

  const designVibe = project.designVibe || 'Clean and Minimalist';

  const colorSystem = isHealth ? 'Primary: Trust Blue (#0A5C99). Secondary: Clean Teal (#14A098). Background: Clinical White. Accent: Alert Red for emergencies.'
    : isEcom ? 'Primary: High-converting Orange (#FF7B00). Secondary: Charcoal Black (#1C1C1C). Background: Soft White. Accent: Sale Red.'
    : isEvent ? 'Primary: Electric Purple (#8A2BE2). Secondary: Night Sky Black (#0B0C10). Background: Dark Mode Native. Accent: Neon Cyan.'
    : 'Primary, Secondary, Background, Border, and Accent colors defined in CSS variables.';

  const typography = isHealth ? 'Font family: Inter (highly legible) for UI body, Roboto Mono for vitals data fields.'
    : isEcom ? 'Font family: Poppins (friendly, modern) for headings, Inter for product descriptions.'
    : isEvent ? 'Font family: Montserrat (bold, impactful) for events, Geist Sans for details.'
    : 'Font family: Inter / Geist Sans for UI body, JetBrains Mono for monospaced data fields.';

  const uxRules = isHealth ? 'Never hide active loading indicators. Always require double-confirmation for destructive record modifications.'
    : isEcom ? 'Minimize friction to checkout (max 3 clicks). Prominently display trust badges during payment.'
    : isEvent ? 'Real-time countdowns for ticket reservations. High contrast QR codes for outdoor scanning.'
    : 'Never hide active loading indicators. Always confirm destructive operations.';

  const designRationale = isHealth ? 'High-contrast minimalist layout chosen to reduce cognitive load for clinical staff under stress.'
    : isEcom ? 'Vibrant accent colors and large tap targets chosen to maximize mobile conversion rates.'
    : isEvent ? 'Dark mode default chosen to match nightlife aesthetics and save battery during events.'
    : 'Monospaced numbers selected for financial and data table precision.';

  const sections = [
    { id: 'design-overview', title: '1. Design Overview', text: `Visual system for **${project.projectName}** customized for the ${project.domain.industryType} domain.` },
    { id: 'design-principles', title: '2. Design Principles', text: isHealth ? 'Legibility, Safety, Trust, Accessibility.' : isEcom ? 'Conversion, Speed, Delight, Clarity.' : 'Clarity, Speed, Accessibility, Visual Hierarchy.' },
    { id: 'visual-direction', title: '3. Visual Direction', text: `Modern UI direction using ${designVibe} aesthetics.` },
    { id: 'color-system', title: '4. Color System', text: colorSystem },
    { id: 'typography', title: '5. Typography', text: typography },
    { id: 'spacing-system', title: '6. Spacing System', text: 'Tailwind 4px baseline scale: 1 (4px), 2 (8px), 4 (16px), 6 (24px), 8 (32px).' },
    { id: 'border-radius', title: '7. Border Radius', text: isEvent ? 'Rounded tokens: lg (8px), xl (12px), full (9999px) for pill buttons.' : 'Rounded tokens: sm (4px), md (6px), lg (8px).' },
    { id: 'elevation-shadows', title: '8. Elevation & Shadows', text: isHealth ? 'Flat surfaces with subtle 1px border outlines to prevent glare.' : 'Elevated card surfaces use subtle dark drop shadows.' },
    { id: 'layout-grid', title: '9. Layout & Grid', text: '12-column responsive fluid container grid with 24px column gutters.' },
    { id: 'responsive-design', title: '10. Responsive Design', text: 'Mobile-first layout adaptation supporting touch gestures and desktop hotkeys.' },
    { id: 'breakpoints', title: '11. Breakpoints', text: 'sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px.' },
    { id: 'components', title: '12. Components', text: 'Buttons, Cards, Inputs, Modals, Tables, Badges, Tabs, Skeletons.' },
    { id: 'component-variants', title: '13. Component Variants', text: 'Default, Primary, Secondary, Outline, Ghost, Destructive variants.' },
    { id: 'component-states', title: '14. Component States', text: 'Default, Hover, Active, Focus-Visible, Disabled, Loading.' },
    { id: 'pages-screens', title: '15. Pages & Screens', text: `Screens for ${project.domain.coreWorkflows.join(', ')}.` },
    { id: 'navigation', title: '16. Navigation', text: isEcom ? 'Sticky top navigation with mega-menu dropdowns.' : 'Persistent sidebar navigation with breadcrumb header trails.' },
    { id: 'user-flows', title: '17. User Flows', text: `Interactive steps for executing ${project.domain.coreWorkflows[0] || 'primary tasks'}.` },
    { id: 'interaction-behavior', title: '18. Interaction & Behavior', text: 'Sub-16ms touch reactivity and optimistic UI update feedback.' },
    { id: 'forms-ux', title: '19. Forms & Validation UX', text: 'Inline Zod schema validation with dynamic error badges.' },
    { id: 'loading-states', title: '20. Loading States', text: 'Animated skeleton pulse bars matching content layout geometry.' },
    { id: 'empty-states', title: '21. Empty States', text: 'Clean illustration callout prompting first user creation action.' },
    { id: 'error-states', title: '22. Error States', text: 'Banner notifications with clear retry actions and error trace IDs.' },
    { id: 'success-feedback', title: '23. Success Feedback', text: 'Toast notifications confirming state changes with auto-dismiss.' },
    { id: 'animation-motion', title: '24. Animation & Motion', text: isEvent ? 'Spring animations for bouncy, energetic modal entrances.' : '150ms ease-out transitions for smooth panel drawers and modals.' },
    { id: 'ux-rules', title: '25. UX Rules', text: uxRules },
    { id: 'accessibility', title: '26. Accessibility', text: isHealth ? 'WCAG 2.1 AAA compliance for contrast ratios, visible focus rings, ARIA landmarks.' : 'WCAG 2.1 AA compliance, visible focus rings, ARIA landmarks.' },
    { id: 'iconography', title: '27. Iconography', text: 'Lucide-React SVG icon library with consistent 1.5px stroke weight.' },
    { id: 'imagery-assets', title: '28. Imagery & Assets', text: 'Vector SVG illustrations and WebP optimized static image assets.' },
    { id: 'design-tokens', title: '29. Design Tokens', text: 'Design token key-value definitions exported to Tailwind CSS variables.' },
    { id: 'design-decisions', title: '30. Design Decisions & Rationale', text: designRationale },
  ];

  sections.forEach(s => {
    builder.addSection({
      id: s.id,
      title: s.title,
      level: 2,
      nodes: [{ type: 'paragraph', text: s.text }],
    });
  });

  return builder.build();
}

export function generateDesignSystem(project: ProjectModel): string {
  const ir = buildDesignIR(project);
  return renderDocumentIRToMarkdown(ir);
}
