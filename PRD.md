# 📋 PRODUCT REQUIREMENT DOCUMENT (PRD)

## 1. Executive Summary & Problem Statement
* **Project Name**: DevContext Engine
* **Type**: Open-Source / Free SaaS Developer Tool
* **Core Value**: 100% Client-Side, Zero-API-Key Architecture Blueprint & AI Rules Generator.
* **Problem**: AI Coding Agents (Cursor, Windsurf, Copilot) sering menghasilkan kode yang asal-asalan (*hallucinate*) karena developer tidak memberikan konteks arsitektur, skema database, dan aturan koding yang jelas. Generator yang ada saat ini berbayar, lambat, dan bergantung pada API key LLM.
* **Solution**: DevContext Engine merakit 8 file dokumentasi arsitektur `.md` standar industri secara instan (<0.01s) langsung di browser pengguna tanpa biaya server.

---

## 2. Target User Personas
* **Junior & Intermediate Developers**: Membutuhkan panduan arsitektur rapi sebelum membangun project.
* **AI-First Developers**: Pengguna Cursor, Windsurf, atau Claude Code yang butuh file `.cursorrules` & `MEGA_PROMPT.txt` instan.
* **Tech Leads / Freelancers**: Butuh perancangan PRD & skema database cepat untuk klien.

---

## 3. Feature Matrix (MVP Scope)

### 🚀 Module 1: Full Suite Generator (`/`)
- **Dual Input Mode**:
  - **Freestyle Prompt**: Textarea ide kasar + Tombol `✨ Smart Polish` (Enhancer lokal berbasis rule-engine).
  - **Guided Wizard**: Step-by-step form (App Type, Tech Stack, Features, DB Engine, Design Vibe).
- **Context Loader**: Dropzone untuk upload `package.json` atau `schema.sql` (auto-detect stack).

### 📐 Module 2: Standalone Micro-Tools (`/tools/...`)
- **🗄️ Database Schema Tool**: Generator khusus `DATABASE.md` + Diagram Mermaid ERD.
- **🎨 Design System Tool**: Generator khusus `DESIGN_SYSTEM.md` + Tailwind CSS tokens.

### 💻 Module 3: Interactive Workspace Dashboard (`/workspace`)
- **Split-Screen Layout**: File Tree Explorer di kiri, Document Viewer di kanan.
- **View Modes**: `[👁️ Live Preview]`, `[📝 Raw Editor]`, `[📊 Mermaid ERD]`.
- **Export Utilities**: One-click ZIP download (`JSZip`), Copy to Clipboard.

### 💾 Module 4: Project History Manager (`/history`)
- Penyimpanan otomatis daftar blueprint project di `localStorage` browser.

---

## 4. Non-Functional Requirements (NFR)
- **Performance**: Waktu generasi file < 0.01 detik (Pure Client-Side Engine).
- **Privacy & Security**: Zero backend database storage. Ide user 100% aman di browser lokal.
- **Cost Efficiency**: $0 hosting cost (Static export friendly via Vercel/Cloudflare Pages).