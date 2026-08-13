import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildDesignIR(project: ProjectModel): DocumentIR {
  const builder = new DocumentIRBuilder('DESIGN', `Design System & UX Specification`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Visual Vibe', project.designVibe)
    .setMetadata('Design Complexity', project.signals.designComplexity);

  const sections = [
    { id: 'design-overview', title: '1. Design Overview', text: `Visual system for **${project.projectName}** customized for ${project.domain.domainName}.` },
    { id: 'design-principles', title: '2. Design Principles', text: 'Clarity, Speed, Accessibility, Visual Hierarchy.' },
    { id: 'visual-direction', title: '3. Visual Direction', text: `Modern UI direction using ${project.designVibe} aesthetics.` },
    { id: 'color-system', title: '4. Color System', text: 'Primary, Secondary, Background, Border, and Accent colors defined in CSS variables.' },
    { id: 'typography', title: '5. Typography', text: 'Font family: Inter / Geist Sans for UI body, JetBrains Mono for monospaced data fields.' },
    { id: 'spacing-system', title: '6. Spacing System', text: 'Tailwind 4px baseline scale: 1 (4px), 2 (8px), 4 (16px), 6 (24px), 8 (32px).' },
    { id: 'border-radius', title: '7. Border Radius', text: 'Rounded tokens: sm (4px), md (6px), lg (8px), xl (12px), full (9999px).' },
    { id: 'elevation-shadows', title: '8. Elevation & Shadows', text: 'Elevated card surfaces use 1px border highlights and subtle dark drop shadows.' },
    { id: 'layout-grid', title: '9. Layout & Grid', text: '12-column responsive fluid container grid with 24px column gutters.' },
    { id: 'responsive-design', title: '10. Responsive Design', text: 'Mobile-first layout adaptation supporting touch gestures and desktop hotkeys.' },
    { id: 'breakpoints', title: '11. Breakpoints', text: 'sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px.' },
    { id: 'components', title: '12. Components', text: 'Buttons, Cards, Inputs, Modals, Tables, Badges, Tabs, Skeletons.' },
    { id: 'component-variants', title: '13. Component Variants', text: 'Default, Primary, Secondary, Outline, Ghost, Destructive variants.' },
    { id: 'component-states', title: '14. Component States', text: 'Default, Hover, Active, Focus-Visible, Disabled, Loading.' },
    { id: 'pages-screens', title: '15. Pages & Screens', text: `Screens for ${project.domain.coreWorkflows.join(', ')}.` },
    { id: 'navigation', title: '16. Navigation', text: 'Persistent sidebar navigation with breadcrumb header trails.' },
    { id: 'user-flows', title: '17. User Flows', text: `Interactive steps for executing ${project.domain.coreWorkflows[0] || 'primary tasks'}.` },
    { id: 'interaction-behavior', title: '18. Interaction & Behavior', text: 'Sub-16ms touch reactivity and optimistic UI update feedback.' },
    { id: 'forms-ux', title: '19. Forms & Validation UX', text: 'Inline Zod schema validation with dynamic error badges.' },
    { id: 'loading-states', title: '20. Loading States', text: 'Animated skeleton pulse bars matching content layout geometry.' },
    { id: 'empty-states', title: '21. Empty States', text: 'Clean illustration callout prompting first user creation action.' },
    { id: 'error-states', title: '22. Error States', text: 'Banner notifications with clear retry actions and error trace IDs.' },
    { id: 'success-feedback', title: '23. Success Feedback', text: 'Toast notifications confirming state changes with auto-dismiss.' },
    { id: 'animation-motion', title: '24. Animation & Motion', text: '150ms ease-out transitions for smooth panel drawers and modals.' },
    { id: 'ux-rules', title: '25. UX Rules', text: 'Never hide active loading indicators. Always confirm destructive operations.' },
    { id: 'accessibility', title: '26. Accessibility', text: 'WCAG 2.1 AA compliance, visible focus rings, ARIA landmarks.' },
    { id: 'iconography', title: '27. Iconography', text: 'Lucide-React SVG icon library with consistent 1.5px stroke weight.' },
    { id: 'imagery-assets', title: '28. Imagery & Assets', text: 'Vector SVG illustrations and WebP optimized static image assets.' },
    { id: 'design-tokens', title: '29. Design Tokens', text: 'Design token key-value definitions exported to Tailwind CSS variables.' },
    { id: 'design-decisions', title: '30. Design Decisions & Rationale', text: 'Monospaced numbers selected for financial and data table precision.' },
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
