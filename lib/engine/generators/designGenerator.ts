import { ProjectConfig } from '../types';
import { DESIGN_VIBE_SPECS } from '../dictionaries/designVibeSpecs';

export function generateDesignSystem(config: ProjectConfig): string {
  const { projectName, designVibe } = config;
  const vibeName = designVibe || 'Modern IDE Dark (Zinc & Indigo)';
  const vibe = DESIGN_VIBE_SPECS[vibeName] || DESIGN_VIBE_SPECS['Modern IDE Dark (Zinc & Indigo)'];
  const appName = projectName || 'DevContext App';

  return `# 🎨 DESIGN SYSTEM & VISUAL GUIDELINES

> **Single Source of Truth UI/UX Visual Directive**  
> **Target Product**: **${appName}**  
> **Theme Concept**: **${vibe.name}**  
> **Core Direction**: *${vibe.direction}*

---

## 1. Design Overview ⭐
- **Design Direction**: ${vibe.direction}
- **Vibe Concept**: ${vibe.concept}
- **Primary Typography**: UI font \`${vibe.fontFamily.ui}\`, Code font \`${vibe.fontFamily.code}\`.
- **Target Audience**: Developers, Tech Leads, and Modern Web Product Users who demand clean visual density and zero layout shift.

---

## 2. Design Principles
1. **High Contrast & Clarity**: Text and UI elements must meet WCAG AA contrast standards (>4.5:1 ratio).
2. **Zero Unnecessary Flourish**: Every border, shadow, and color accent serves a structural purpose.
3. **Monospaced Precision**: Code snippets, identifiers, file paths, and metrics use monospaced fonts for exact visual alignment.
4. **Deterministic UI Feedback**: All interactive buttons, forms, and modals provide instant visual state feedback (Hover, Active, Loading, Focus).

---

## 3. Design System ⭐

### 3.1 Color Token Matrix
| Token Name | Hex Code | Tailwind Utility Class | Usage |
| :--- | :--- | :--- | :--- |
${vibe.colors.map(c => `| \`${c.name}\` | \`${c.hex}\` | \`${c.tailwind}\` | ${c.usage} |`).join('\n')}

### 3.2 Typography Scale
- **UI Font Stack**: \`${vibe.fontFamily.ui}\`
- **Code Font Stack**: \`${vibe.fontFamily.code}\`
- **Headings**:
  - **H1 (Hero / Page Title)**: \`text-3xl sm:text-5xl font-mono font-extrabold tracking-tight\`
  - **H2 (Section Header)**: \`text-2xl sm:text-3xl font-mono font-bold\`
  - **H3 (Card / Subsection)**: \`text-sm sm:text-base font-mono font-bold uppercase tracking-wider\`
- **Body & Subtitles**:
  - **Body Normal**: \`text-sm font-sans text-zinc-300\`
  - **Muted Subtitle**: \`text-xs font-sans text-zinc-400\`
  - **Inline Code / Badges**: \`font-mono text-xs text-indigo-400 bg-zinc-950 px-1.5 py-0.5 rounded\`

### 3.3 Spacing Scale
| Name | Pixel Value | Tailwind Utility Class |
| :--- | :--- | :--- |
${vibe.spacingScale.map(s => `| \`${s.name}\` | \`${s.px}\` | \`${s.tailwind}\` |`).join('\n')}

### 3.4 Border Radius Scale
| Name | Pixel Value | Tailwind Utility Class |
| :--- | :--- | :--- |
${vibe.borderRadius.map(r => `| \`${r.name}\` | \`${r.px}\` | \`${r.tailwind}\` |`).join('\n')}

---

## 4. Layout & Grid ⭐
- **Desktop Grid (>1024px)**: Max-width \`1280px\` (\`max-w-7xl mx-auto\`), 12-column grid layout, \`32px\` horizontal padding.
- **Tablet Grid (768px - 1024px)**: 2-column grid layout, \`24px\` horizontal padding.
- **Mobile Grid (<768px)**: 1-column stacked layout, \`16px\` horizontal padding.

---

## 5. Responsive Rules ⭐
- **Mobile (<768px)**:
  - Navigation renders as collapsible top header bar or bottom drawer.
  - File tree explorers collapse into a slide-over modal drawer.
- **Tablet (768px - 1024px)**:
  - Sidebar toggles via hamburger icon; workspace editor occupies remaining width.
- **Desktop (>1024px)**:
  - Multi-column IDE layout: Left Sidebar (File Explorer), Center Content Viewer, Right Details Inspector.

---

## 6. Components Specifications ⭐

### 6.1 Buttons
- **Primary CTA**: \`${vibe.buttonStates.primary}\`
- **Secondary**: \`${vibe.buttonStates.secondary}\`
- **Outline**: \`${vibe.buttonStates.outline}\`
- **Danger / Destructive**: \`${vibe.buttonStates.danger}\`

### 6.2 Component Code Snippet (TSX)

\`\`\`tsx
// Reusable Primary Button Component
export function PrimaryButton({ children, onClick, isLoading }: { children: React.ReactNode; onClick?: () => void; isLoading?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="${vibe.buttonStates.primary}"
    >
      {isLoading ? <span className="animate-pulse">Processing...</span> : children}
    </button>
  );
}

// IDE Card Container Component
export function IdeCard({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl text-zinc-100 font-mono">
      {title && <h3 className="text-xs font-bold text-indigo-400 mb-4 uppercase tracking-wider">{title}</h3>}
      {children}
    </div>
  );
}
\`\`\`

---

## 7. Page & Screen Structure
\`\`\`text
App Root Layout/
├── Navigation Bar (Header)
├── Workspace Main Container/
│   ├── Left Panel: File Tree Explorer & Action Tools
│   └── Right Panel: Document Viewer (Preview / Raw / Mermaid ERD)
└── Footer (Status & Security Indicator)
\`\`\`

---

## 8. User Flows ⭐
\`\`\`mermaid
graph LR
    Landing["Landing Page / Mode Switcher"] --> Form["Fill Prompt / Wizard"]
    Form --> Generate["Click Generate Blueprint"]
    Generate --> Workspace["Instant IDE Workspace (<0.01s)"]
    Workspace --> Export["Copy or ZIP Export All Files"]
\`\`\`

---

## 9. Interaction & Behavior ⭐
- **Hover States**: Subtly brightens element backgrounds (\`hover:bg-zinc-800\`) and borders (\`hover:border-indigo-500/50\`).
- **Active Click States**: Button shrinks slightly (\`active:scale-95\`) for tactile user feedback.
- **Loading Indicator**: Pulsing icons or skeleton lines (\`animate-pulse\`) during background operations.

---

## 10. UX Rules
- **Feedback**: Form inputs display instant error messages on validation failure.
- **Confirmation**: Destructive actions (e.g. clearing workspace history) prompt confirmation modals.
- **Empty States**: Views without active files show clear helper illustrations and "Generate" action CTA buttons.

---

## 11. Accessibility (a11y) ⭐
- **Keyboard Focus**: Interactive elements include visible focus rings (\`focus:outline-none focus:border-indigo-500\`).
- **Color Contrast**: All text tokens maintain minimum 4.5:1 contrast against dark background surfaces.
- **Semantic HTML**: Headers use \`<h1>\` through \`<h3>\`, lists use \`<ul>\`/\`<li>\`, buttons use \`<button>\`.

---

## 12. Assets & Iconography
- **Icon Library**: Lucide React (\`lucide-react\`).
- **Default Size**: \`16px\` (\`w-4 h-4\`) or \`20px\` (\`w-5 h-5\`).
- **Icon Color**: Accent Indigo (\`text-indigo-400\`) or Muted Zinc (\`text-zinc-400\`).

---

## 13. Design Tokens & Tailwind Mapping ⭐
| Design Token | Tailwind CSS Class |
| :--- | :--- |
${vibe.tailwindMapping.map(m => `| **${m.token}** | \`${m.class}\` |`).join('\n')}

---

## 14. Design Decisions & Rationale
- **Decision**: Adopt Dark-Mode First (\`#09090B\` / \`zinc-950\`) as default UI theme.
- **Reason**: Reduces eye strain during prolonged development sessions, aligns with VS Code / Web IDE design conventions, and highlights code syntax colors.

---

## 15. Design Changelog
| Date | Version | Summary of Visual Changes |
| :--- | :--- | :--- |
| ${new Date().toISOString().split('T')[0]} | \`v1.0.0\` | Established core ${vibe.name} Design System & Token Matrix |
`;
}
