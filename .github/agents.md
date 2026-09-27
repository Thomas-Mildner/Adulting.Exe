# Agent Instructions for Adulting.exe

> **Note:** The comprehensive, canonical agent instructions for all AI coding agents (Antigravity, Copilot, Cursor, Claude Code, etc.) are maintained in [AGENTS.md](../AGENTS.md).

---

## Quick Reference

### Tech Stack
Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS, shadcn/ui, Prisma ORM (PostgreSQL), next-intl (`de`, `en`), pnpm.

### 1. Token Efficiency & Agent Best Practices
- **Targeted inspections:** Do not load large files in full; view targeted line ranges.
- **Surgical edits:** Use localized diffs/patches; avoid full-file rewrites.
- **Concise responses:** Focus on key findings and changes; avoid echo-printing code.
- **Verification:** Always verify with `pnpm type-check` (`tsc --noEmit`).

### 2. Prisma & Database
- **MANDATORY:** Always create migrations for schema changes:
  ```bash
  npx prisma migrate dev --name <descriptive-name>
  ```
- **Never use `db push` for committed changes.**
- Run `pnpm db:generate` after modifying `prisma/schema.prisma`.
- Update `prisma/seed.ts`, `lib/data.ts`, and `lib/actions.ts` when schema changes occur.

### 3. Routing & i18n
- All UI pages live under `app/[locale]/` — never directly under `app/`.
- Always use `import { Link, redirect, usePathname, useRouter } from "@/lib/navigation"`.
- Never use `next/link` or `next/navigation` directly.
- Add user-facing translation strings to **both** `messages/de.json` and `messages/en.json`.

### 4. Components & UX
- Primitives in `components/ui/` (shadcn/ui), feature components in `components/<feature>/`.
- Server Components by default; `"use client"` only where needed.
- No `window.location.reload()`; use `router.refresh()` or state updates.
- Styling with Tailwind CSS and `cn()` from `@/lib/utils`.

### 5. Available Commands
- `pnpm dev` — Start development server
- `pnpm type-check` — Strict TypeScript checking (`tsc --noEmit`)
- `pnpm build` — Production build & type-checking
- `pnpm db:generate` — Regenerate Prisma Client
- `pnpm db:seed` — Seed sample data
- `pnpm db:studio` — Prisma Studio
- `pnpm db:reset` — Reset database & reseed
- `docker compose up -d postgres` — Run local PostgreSQL

See [AGENTS.md](../AGENTS.md) for full details.
