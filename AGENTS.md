# AGENTS.md — Agent Guidelines for Adulting.exe

Welcome, AI Agent! This document contains essential instructions, conventions, architecture guidelines, and workflows for working on the **Adulting.exe** codebase.

These instructions are generic and compatible with all modern AI agents and assistants, including **Antigravity**, **GitHub Copilot**, **Cursor**, **Claude Code**, **Windsurf**, and others.

---

## 1. Project Overview

**Adulting.exe** is an open-source home management dashboard built to bring order to household administration. It centralizes warranties, appliances, service providers, utility consumption, recurring maintenance tasks, waste disposal schedules, lending tracking, identity documents, health/illness logging, garage/vehicle management, meal planning, and home improvement wishlists.

- **Primary Language:** TypeScript (strict mode)
- **Framework:** Next.js (App Router, Turbopack)
- **UI & Styling:** React, Tailwind CSS, shadcn/ui (Radix UI primitives), Lucide Icons
- **Database & ORM:** PostgreSQL, Prisma ORM
- **Internationalization (i18n):** `next-intl` (German `de` [default], English `en`)
- **Package Manager:** `pnpm`
- **Release Management:** Semantic Release with Conventional Commits

---

## 2. Directory Structure & Key Paths

```text
├── app/
│   ├── [locale]/             # All localized UI pages and layouts (de, en)
│   │   ├── layout.tsx        # Root localized layout (NextIntlClientProvider, ThemeProvider, Sidebar)
│   │   ├── page.tsx          # Main dashboard
│   │   ├── contracts/        # Contract management
│   │   ├── documents/        # Identity document tracker
│   │   ├── garage/           # Vehicle tracking, maintenance, fuel & tolls
│   │   ├── illnesses/        # Household illness & sick day tracking
│   │   ├── lending/          # Lend-O-Meter (borrowed/lent items)
│   │   ├── library/          # Knowledge base & manuals
│   │   ├── maintenance/      # Recurring household tasks & reminders
│   │   ├── meals/            # Meal planning & recipes
│   │   ├── pets/             # Pet profiles, vet visits, vaccinations
│   │   ├── services/         # Service providers & invoice history
│   │   ├── settings/         # App settings, person management, waste types
│   │   ├── utilities/        # Utility meter readings & consumption charts
│   │   ├── vault/            # Appliances & warranty tracking
│   │   ├── waste/            # Waste collection calendar
│   │   └── wishlist/         # Home improvement project wishlist
│   ├── api/                  # API routes (upload, tax-export, version)
│   └── globals.css           # Global Tailwind CSS styles and theme variables
├── components/
│   ├── ui/                   # shadcn/ui atomic primitives (button, dialog, input, etc.)
│   ├── <feature>/            # Feature-specific components (e.g. vault, services, pets)
│   ├── app-sidebar.tsx       # Main navigation sidebar
│   ├── dashboard-layout.tsx  # Layout wrapper for dashboard views
│   └── theme-provider.tsx    # next-themes wrapper
├── hooks/                    # Custom React hooks (e.g. use-mobile, use-toast)
├── lib/
│   ├── actions.ts            # Server Actions ("use server") for mutations
│   ├── data.ts               # Domain TypeScript interfaces and data helpers
│   ├── navigation.ts         # next-intl localized navigation (Link, useRouter, etc.)
│   ├── prisma.ts             # Prisma client singleton instance
│   └── utils.ts              # Utility functions (cn helper for Tailwind)
├── messages/
│   ├── de.json               # German translations (default locale)
│   └── en.json               # English translations
├── prisma/
│   ├── migrations/           # Version-controlled SQL migrations
│   ├── schema.prisma         # Prisma schema definition
│   └── seed.ts               # Development and test seed script
├── public/                   # Static assets (favicons, icons, placeholder images)
├── scripts/                  # Maintenance and synchronization scripts
└── docker-compose.yml        # Local PostgreSQL and pgAdmin containers
```

---

## 3. Mandatory Development Rules

### 3.1 Database & Prisma (CRITICAL)

1. **Always Use Migrations for Schema Changes:**
   When adding, modifying, or removing models or fields in `prisma/schema.prisma`, you **MUST** create a Prisma migration:
   ```bash
   npx prisma migrate dev --name <descriptive-kebab-name>
   ```
   *Examples:*
   - `npx prisma migrate dev --name add-insurance-model`
   - `npx prisma migrate dev --name add-notes-to-appliance`
   - `npx prisma migrate dev --name rename-status-field`

2. **Never Use `db push` for Committed Changes:**
   `pnpm db:push` is strictly for temporary local prototyping. Any code intended to be merged or committed must have a migration file in `prisma/migrations/`.

3. **Post-Schema-Update Checklist:**
   - Run `pnpm db:generate` to regenerate `@prisma/client`.
   - Update `prisma/seed.ts` if new models or required fields require sample data.
   - Update types in `lib/data.ts`.
   - Update or add Server Actions in `lib/actions.ts`.

### 3.2 Routing & Internationalization (i18n)

1. **Pages Live Under `app/[locale]/`:**
   Never create user-facing pages directly under `app/`. They must live under `app/[locale]/...`.

2. **Always Use `@/lib/navigation`:**
   **NEVER** import `next/link` or `next/navigation` directly for localized navigation.
   ```typescript
   // ✅ CORRECT:
   import { Link, redirect, usePathname, useRouter } from "@/lib/navigation"

   // ❌ WRONG:
   import Link from "next/link"
   import { useRouter } from "next/navigation"
   ```

3. **Dual Translation Maintenance:**
   Every user-facing string must be translated. When adding a new key:
   - Add it to `messages/de.json` (German, default).
   - Add it to `messages/en.json` (English).
   - Use organized namespaces (e.g., `Navigation`, `Common`, `Vault`, `Services`).
   - In Client Components: `const t = useTranslations("Namespace")`
   - In Server Components: `const t = await getTranslations("Namespace")`

### 3.3 Server Actions & Data Mutations

- Data mutations should be handled via Server Actions in `lib/actions.ts` marked with `"use server"`.
- Use the shared `prisma` singleton from `@/lib/prisma`.
- Validate input parameters using `zod` where applicable.
- Call `revalidatePath(...)` after mutations to refresh relevant routes and cached data.
- Return structured responses, for example:
  ```typescript
  return { success: true, data: result }
  // or
  return { success: false, error: "Error message" }
  ```

### 3.4 Components & Styling

- **UI Primitives:** Reusable, unstyled-primitive wrappers live in `components/ui/` (shadcn/ui based on Radix). Do not reinvent primitives when one exists in `components/ui/`.
- **Feature Components:** Group domain components by feature in `components/<feature>/` (e.g., `components/vault/appliance-card.tsx`).
- **Client vs Server Components:** Keep components as Server Components by default. Add `"use client"` only when using hooks (`useState`, `useEffect`, `useTranslations`), event handlers, or browser APIs.
- **Styling:** Use Tailwind CSS classes. Use the `cn()` utility from `@/lib/utils` for conditional class combinations:
  ```typescript
  import { cn } from "@/lib/utils"
  ```
- **Icons:** Use `lucide-react`.
- **Toasts:** Use `sonner` via `toast.success(...)` and `toast.error(...)`.

---

## 4. Useful Commands & Scripts

| Command | Purpose |
| :--- | :--- |
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Run production Next.js build (type-check & compile) |
| `pnpm start` | Start production server |
| `pnpm db:generate` | Regenerate Prisma Client types |
| `pnpm db:seed` | Seed database with sample data (`prisma/seed.ts`) |
| `pnpm db:studio` | Open Prisma Studio UI to inspect data |
| `pnpm db:reset` | Reset database and re-seed (destructive!) |
| `docker compose up -d postgres` | Start local PostgreSQL database container |
| `docker compose up -d` | Start PostgreSQL and pgAdmin containers |

---

## 5. Git Commit & Release Guidelines

This repository uses **Semantic Release** to automate versioning and changelog generation. All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature (triggers a MINOR release)
- `fix:` A bug fix (triggers a PATCH release)
- `docs:` Documentation changes only
- `style:` Formatting, missing semi-colons, no code logic change
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `perf:` Performance improvements
- `test:` Adding or refactoring tests
- `chore:` Changes to build process, tooling, dependencies, or aux files

*Examples:*
- `feat(vault): add serial number field to appliances`
- `fix(waste): resolve date offset issue in calendar view`
- `chore(deps): update prisma to v6.19.3`

---

## 6. General Guidelines for AI Agents

1. **Check Types & Build:** Always ensure that your modifications pass TypeScript type checks and Next.js builds without errors (`pnpm build`).
2. **Preserve Code Integrity:** Retain existing comments, docstrings, and established naming conventions.
3. **No Phantom Routes:** All pages belong inside `app/[locale]/...`.
4. **Localization Completeness:** Never leave string literals directly in JSX if they are visible to users; always add keys to both `messages/de.json` and `messages/en.json`.
5. **Database Discipline:** Never commit raw schema changes without a corresponding migration in `prisma/migrations/`.

