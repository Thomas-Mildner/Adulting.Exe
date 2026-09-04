# GitHub Copilot Instructions for Adulting.exe

This repository is **Adulting.exe**, a Next.js 16 home management dashboard built with React 19, TypeScript, Tailwind CSS, shadcn/ui, Prisma ORM (PostgreSQL), and `next-intl`.

For full architecture details, please consult [AGENTS.md](../AGENTS.md).

---

## Key Development Rules

### 1. Database & Prisma
- **Never use `prisma db push` for committed changes.**
- Every schema change in `prisma/schema.prisma` requires a migration:
  ```bash
  npx prisma migrate dev --name <descriptive-name>
  ```
- Always regenerate the Prisma Client after schema changes: `pnpm db:generate`.
- Keep `prisma/seed.ts`, `lib/data.ts`, and `lib/actions.ts` in sync with schema updates.

### 2. Internationalization (next-intl) & Navigation
- All UI routes must be under `app/[locale]/`.
- **Never import `next/link` or `next/navigation` directly.**
  Always use:
  ```typescript
  import { Link, redirect, usePathname, useRouter } from "@/lib/navigation";
  ```
- All user-facing strings must be localized.
- Always add translation keys to **both** `messages/de.json` (German, default) and `messages/en.json` (English).

### 3. Component Architecture & UI
- Primitive components belong in `components/ui/` (shadcn/ui based on Radix).
- Domain/feature components belong in `components/<feature>/` (e.g., `components/vault/`).
- Default to React Server Components (RSC). Only add `"use client"` when state, hooks, or event listeners are required.
- Use `cn()` from `@/lib/utils` for merging Tailwind CSS classes.
- Use `lucide-react` for icons and `sonner` for toast notifications.

### 4. Server Actions & Mutations
- Place data mutations in `lib/actions.ts` marked with `"use server"`.
- Use the singleton `prisma` client from `@/lib/prisma`.
- Call `revalidatePath(...)` after mutations.
- Return structured responses: `{ success: boolean, data?: ..., error?: string }`.

### 5. Git Commit Convention
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.) to support Semantic Release.

