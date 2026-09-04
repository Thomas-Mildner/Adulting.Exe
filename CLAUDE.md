# CLAUDE.md — Claude Code Guidelines for Adulting.exe

> Canonical guidelines are maintained in `AGENTS.md`.

## Project Overview
Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Prisma 6 (PostgreSQL), next-intl (`de`, `en`), pnpm.

## Essential Commands
- Dev server: `pnpm dev`
- Build & typecheck: `pnpm build`
- Prisma generate: `pnpm db:generate`
- Prisma migration: `npx prisma migrate dev --name <migration-name>`
- Seed database: `pnpm db:seed`
- Reset database: `pnpm db:reset`
- Local PostgreSQL: `docker compose up -d postgres`

## Critical Rules
1. **Never use `db push` for commits:** Always create migrations via `npx prisma migrate dev --name <name>`.
2. **Localized routes only:** All pages belong under `app/[locale]/...`.
3. **Localized navigation:** Always import `Link`, `useRouter`, `redirect`, `usePathname` from `@/lib/navigation`, never `next/link`.
4. **Bilingual i18n:** Always update both `messages/de.json` and `messages/en.json`.
5. **Server Actions:** Placed in `lib/actions.ts` with `"use server"` and call `revalidatePath`.
6. **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.).

