# Agent Instructions for Adulting.Exe

## Project Overview

Adulting.Exe is a Next.js household management app using TypeScript, Prisma ORM with PostgreSQL, Tailwind CSS, shadcn/ui, and next-intl for i18n (locales: `de`, `en`).

## Database & Prisma Rules

### MANDATORY: Create Migrations for Schema Changes

When adding, modifying, or removing models/fields in `prisma/schema.prisma`, you **MUST** create a Prisma migration:

```bash
npx prisma migrate dev --name <descriptive-name>
```

**Migration naming convention:** Use lowercase kebab-case describing the change, e.g.:
- `add-insurance-model`
- `add-notes-to-appliance`
- `rename-status-field`
- `add-notification-preferences`

### Never use `db push` for schema changes

`prisma db push` is for development prototyping only. All schema changes that will be committed must go through `prisma migrate dev` to generate a proper migration file in `prisma/migrations/`.

### After schema changes

1. Run `npx prisma migrate dev --name <name>` to create the migration
2. Run `npx prisma generate` to regenerate the Prisma Client
3. Update `prisma/seed.ts` if new models need seed data
4. Update `lib/data.ts` and `lib/actions.ts` if new data access or server actions are needed

## Routing & i18n

- All pages live under `app/[locale]/` — never create pages directly under `app/`
- Use `import { Link } from "@/lib/navigation"` instead of `next/link`
- Use `useTranslations("Namespace")` from `next-intl` for all user-facing strings
- Add translations to both `messages/en.json` and `messages/de.json`

## Component Conventions

- UI primitives are in `components/ui/` (shadcn/ui)
- Feature components go in `components/<feature>/` (e.g., `components/insurance/`)
- Use TypeScript for all files
- Keep components small and focused

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm db:generate` | Regenerate Prisma Client |
| `pnpm db:push` | Push schema (dev prototyping only) |
| `pnpm db:seed` | Seed database with sample data |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:reset` | Reset DB and re-seed |
