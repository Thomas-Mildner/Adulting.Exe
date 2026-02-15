# 🏠 Adulting.exe

**Because your house didn't come with a manual.**

`Adulting.exe` is a high-end home management dashboard designed to organize the mess of receipts, warranties, contractor numbers, and meter readings. Built for people who want to know exactly where the blender’s original box is located *before* the motor starts smoking.

---

## ✨ Features

### 📦 The Box Vault (Inventory & Warranty)
* **Warranty Tracker:** Keep tabs on expiration dates with a visual "Zombie Mode" for items that are now living on the edge (out of warranty).
* **Box Locator:** Stop the basement scavenger hunt. "Where’s the box?" – "Attic, Sector 7, behind the Christmas lights."

### 🛠️ The Hero Directory (Handymen & Service)
* **Contractor Hub:** A searchable directory of plumbers, electricians, and the people who keep your roof from leaking.
* **Service Log:** Track who fixed what, when they did it, and exactly how much it hurt your wallet.
* **Tax-Ready:** Toggle invoices as "Tax-Deductible" to make your next tax return a breeze.

### 📚 The Holy Manuals (Knowledge Base)
* **Markdown Support:** Upload or write your own documentation for home systems (e.g., "How to bleed the radiators without flooding the parquet").
* **Palette Log:** Store hex codes and photos of paint buckets for every room. Never guess between "Eggshell" and "Off-White" again.

### 📉 The Resource Drain (Utility Tracking)
* **Usage Visualization:** Interactive charts for electricity, water, and heating consumption history via Recharts.
* **Meter Logs:** Log your readings and track trends before the dreaded "Annual Adjustment" bill arrives.

### 💰 Future Dreams (Projects & Savings)
* **Project Planner:** From "New Fence" to "Kitchen Remodel." Set budgets and track your savings progress.
* **Lend-O-Meter:** Keep track of which neighbor has had your power drill for the last three months.

---

## 🚀 Tech Stack

* **Framework:** Next.js (App Router, Server Components)
* **Styling:** Tailwind CSS
* **Components:** Shadcn/UI
* **Icons:** Lucide-React
* **Charts:** Recharts
* **Database:** PostgreSQL (via Docker)
* **ORM:** Prisma
* **Deployment:** Vercel / Docker

---

## 🛠️ Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) (recommended) or npm
- [Docker](https://www.docker.com/) & Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/Thomas-Mildner/adulting-exe.git
cd adulting-exe
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the PostgreSQL database

```bash
docker compose up -d
```

This starts a PostgreSQL 16 instance on port **5432** with:
- **User:** `adulting`
- **Password:** `adulting_secret`
- **Database:** `adulting_exe`

### 4. Configure environment

Copy the example env file (or use the one already created):

```bash
cp .env.example .env
```

The default `DATABASE_URL` is:
```
postgresql://adulting:adulting_secret@localhost:5432/adulting_exe?schema=public
```

**Optional:** If the repository is private, add a GitHub token to fetch release information:
```bash
GITHUB_TOKEN=ghp_your_token_here
```
You can create a Personal Access Token at [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens) with `repo` scope.

### 5. Push database schema & seed data

```bash
pnpm db:push     # Create tables from Prisma schema
pnpm db:seed     # Populate with sample data
```

### 6. Run the development server

```bash
pnpm dev
```

### 7. Open the dashboard

Navigate to [http://localhost:3000](http://localhost:3000) to see your home management in action.

---

## 📦 Database Commands

| Command | Description |
|---------|-------------|
| `pnpm db:push` | Push schema changes to the database |
| `pnpm db:seed` | Seed the database with sample data |
| `pnpm db:studio` | Open Prisma Studio (visual DB editor) |
| `pnpm db:generate` | Regenerate Prisma Client |
| `pnpm db:reset` | Reset database and re-seed |
| `docker compose up -d` | Start PostgreSQL |
| `docker compose down` | Stop PostgreSQL |
| `docker compose down -v` | Stop & delete database volume |

---

## 🔄 Versioning & Releases

This project uses [semantic-release](https://semantic-release.gitbook.io/) for automated version management and package publishing.

### How it works

1. **Commit Messages:** Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
   - `feat:` - New features (triggers a minor release)
   - `fix:` - Bug fixes (triggers a patch release)
   - `perf:` - Performance improvements (triggers a patch release)
   - `refactor:` - Code refactoring (triggers a patch release)
   - `BREAKING CHANGE:` - Breaking changes (triggers a major release)
   - `docs:`, `chore:`, `style:`, `test:` - No release

2. **Automatic Releases:** When code is pushed to the `main` branch:
   - Semantic-release analyzes commits since the last release
   - Determines the next version number
   - Updates `package.json` and `pnpm-lock.yaml`
   - Generates a changelog in `CHANGELOG.md`
   - Creates a GitHub release with release notes
   - Tags Docker images with the semantic version

3. **Version Display:** The current version is displayed in the app sidebar (read from `package.json` at build time).

### Example Commits

```bash
git commit -m "feat: add new maintenance reminder feature"
# This will trigger a minor version bump (e.g., 1.0.0 → 1.1.0)

git commit -m "fix: resolve issue with warranty expiration dates"
# This will trigger a patch version bump (e.g., 1.1.0 → 1.1.1)

git commit -m "feat!: redesign dashboard layout

BREAKING CHANGE: Dashboard layout has been completely redesigned"
# This will trigger a major version bump (e.g., 1.1.1 → 2.0.0)
```

---

## 📝 Roadmap
- [ ] QR Code Generator for moving boxes.
- [ ] Automatic PDF Export for Home Insurance audits.
- [ ] Smart Meter API integrations.

---

## 🛡️ License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Current Status:** *The house is still standing (as of today).*
