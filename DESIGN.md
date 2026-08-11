# 🎨 DESIGN SYSTEM & VISUAL GUIDELINES

## 1. Visual Vibe & Aesthetics
* **Theme Concept**: Modern Developer Studio / IDE Aesthetic (VS Code Style).
* **Default Mode**: **Dark Mode First** (Zinc-950 background).
* **Characteristics**: Crisp borders (`zinc-800`), high-density workspace, monospaced code blocks, subtle electric indigo glows.

---

## 2. Color Tokens

| Token Name | Hex / Class | Usage |
| :--- | :--- | :--- |
| `bg-app` | `#09090B` (`zinc-950`) | Latar belakang utama |
| `bg-surface` | `#18181B` (`zinc-900`) | Card, Sidebar, Modal, Workspace panels |
| `bg-element` | `#27272A` (`zinc-800`) | Input fields, active tabs, hover states |
| `border-main` | `#27272A` (`zinc-800`) | Garis batas panel & card |
| `text-primary`| `#FAFAFA` (`zinc-50`) | Heading & teks utama |
| `text-muted`  | `#A1A1AA` (`zinc-400`) | Subtitle & deskripsi |
| `accent-brand`| `#6366F1` (`indigo-500`)| Tombol CTA utama (`Generate`, `Export`) |
| `accent-green`| `#10B981` (`emerald-500`)| Badge "100% Free", "Offline Engine" |

---

## 3. Typography
- **UI & Headings**: `Plus Jakarta Sans` / `Inter` (Clean, legible, SaaS feel).
- **Code & Markdown**: `JetBrains Mono` / `Fira Code` (Monospace for code editor, file tree, & diagrams).

---

## 4. Component Rules

### Buttons
- **Primary CTA**: `bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg px-4 py-2.5 transition-all shadow-lg shadow-indigo-500/20`
- **Secondary**: `bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg px-4 py-2`

### Workspace Panels & Cards
- **Card Container**: `bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl`
- **Active Tab File**: `bg-zinc-800 text-indigo-400 border-b-2 border-indigo-500`