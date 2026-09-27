# CLAUDE.md — Claude Code Guidelines for Adulting.exe

> Canonical guidelines are maintained in `AGENTS.md`.

## Project Overview
Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS, shadcn/ui, Prisma 6 (PostgreSQL), next-intl (`de` default, `en`), pnpm.

## Essential Commands
- Dev server: `pnpm dev`
- Type check: `pnpm type-check` (`tsc --noEmit`)
- Build: `pnpm build`
- Prisma generate: `pnpm db:generate`
- Prisma migration: `npx prisma migrate dev --name <migration-name>`
- Seed database: `pnpm db:seed`
- Reset database: `pnpm db:reset`
- Local PostgreSQL: `docker compose up -d postgres`

## AI Agent & Token Efficiency Rules
1. **Targeted Inspections (Save Tokens):**
   - Never dump entire massive files (e.g. `lib/actions.ts` or `components/utilities/utility-tracker.tsx`).
   - Use line ranges or targeted search (`grep -n`) to pinpoint code before viewing.
   - Ignore `.next/`, `node_modules/`, and `.git/`.
2. **Surgical Edits:**
   - Make precise contiguous replacements. Do not rewrite whole files.
3. **Concise Answers:**
   - Keep responses dense and actionable. Avoid re-printing full files in explanations.
4. **Strict Type Checking:**
   - Always run `pnpm type-check`. `ignoreBuildErrors: true` in `next.config.mjs` is strictly forbidden.
5. **No Full Page Reloads:**
   - Never use `window.location.reload()`. Use `router.refresh()` from `@/lib/navigation` or optimistic/local state.
6. **Dynamic Uploads:**
   - Runtime uploads are stored in `public/uploads` and served via `app/uploads/[...path]/route.ts`.

## Critical Architecture Rules
1. **Never use `db push` for commits:** Always create migrations via `npx prisma migrate dev --name <name>`.
2. **Localized routes only:** All pages belong under `app/[locale]/...`.
3. **Localized navigation:** Always import `Link`, `useRouter`, `redirect`, `usePathname` from `@/lib/navigation`, never `next/link`.
4. **Bilingual i18n:** Always update both `messages/de.json` and `messages/en.json`.
5. **Server Actions:** Placed in `lib/actions.ts` with `"use server"` and call `revalidatePath`.
6. **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.).
