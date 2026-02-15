# 🏠 Adulting.exe

**Because your house didn't come with a manual.**

---

## 📖 Overview

`Adulting.exe` is a comprehensive home management dashboard designed to bring order to the chaos of household administration. Keep track of warranties, appliances, service providers, utility consumption, maintenance tasks, and more – all in one place.

Built for people who want to know exactly where the blender's original box is located *before* the motor starts smoking, and who never want to search through old receipts again when tax season arrives.

**Tech Stack:** Next.js • React • TypeScript • Tailwind CSS • Shadcn/UI • PostgreSQL • Prisma • Docker

---

## ✨ Features

### 📦 Vault (Appliance & Warranty Management)
* **Appliance Inventory:** Catalog all household appliances with purchase dates, prices, brands, and categories
* **Warranty Tracker:** Monitor warranty expiration dates with visual status indicators
  - 🛡️ **Protected:** Under warranty
  - 🔧 **Solo:** Basic protection expired
  - 🧟 **Zombie Mode:** Living dangerously without any warranty
* **Box Locator:** Document where original packaging is stored (e.g., "Attic, Sector 7, behind the Christmas lights")
* **Quick Stats:** Dashboard overview of total appliances and warranty status

### 🛠️ Services & Invoicing
* **Service Provider Directory:** Maintain a searchable database of contractors (plumbers, electricians, handymen, etc.)
* **Contact Management:** Store specialty areas, phone numbers, emails, and ratings for each provider
* **Service History:** Track all service calls with dates, providers, and costs
* **Invoice Storage:** Attach and organize invoice files for every service
* **Tax-Deductible Tracking:** Mark expenses as tax-relevant for easy year-end reporting
* **Provider Ratings:** Rate service quality to remember the good (and avoid the bad)

### 🔧 Maintenance Management
* **Task Tracking:** Create and manage maintenance tasks with due dates
* **Priority Levels:** Categorize tasks as high, medium, or low priority
* **Recurring Tasks:** Set up repeating maintenance reminders (filter changes, inspections, etc.)
* **Completion Tracking:** Mark tasks as done and maintain a service history
* **Dashboard Integration:** See pending tasks at a glance on your home screen

### 📉 Utility Tracker
* **Meter Readings:** Log monthly readings for electricity, water, and heating
* **Cost Tracking:** Record costs for each utility per month
* **Multiple Heating Types:** Support for Gas, Oil, Fernwärme (district heating), Heat Pump, and Pellets
* **Visual Analytics:** Interactive charts showing consumption trends over time
* **Cost Visualization:** Track utility expenses and identify usage patterns

### 🗑️ Waste Calendar
* **Pickup Schedule:** Manage waste collection dates for multiple waste types
* **Customizable Categories:** Restmüll, Bio, Papier, Gelber Sack, and more
* **Color-Coded Display:** Visual waste type identification with custom icons
* **Next Pickup Widget:** Dashboard card showing upcoming waste collection days
* **Custom Waste Types:** Add and configure waste types in settings

### 💸 Lending Tracker (Lend-O-Meter)
* **Item Lending Log:** Track tools and items you've lent to others
* **Borrower Management:** Record who borrowed what and when
* **Return Dates:** Set expected return dates and monitor overdue items
* **Trust Rating:** Rate borrowers' reliability for future reference
* **Dashboard Visualization:** See all currently lent items at a glance

### 🎯 Wishlist & Project Planning
* **Future Projects:** Plan home improvement projects with descriptions and goals
* **Budget Tracking:** Set estimated costs and track current savings progress
* **Urgency Levels:** Prioritize projects from "nice-to-have" to "falling-apart"
* **Project Categories:** Organize renovation, repair, and improvement plans
* **Progress Visualization:** See how close you are to funding each project

### 📚 Knowledge Base
* **Documentation Library:** Centralized storage for manuals, guides, and home documentation
* **Category Organization:** Organize by Heating, Plumbing, Smart Home, Structural, or General
* **Multiple Formats:** Support for PDFs and Markdown documents
* **Searchable Content:** Quickly find the information you need
* **Custom Entries:** Write and save your own how-to guides and notes

### 🎨 Paint & Color Palette Log
* **Color Storage:** Save hex codes and names for every paint color used in your home
* **Photo Documentation:** Attach photos of paint cans and color swatches
* **Room Mapping:** Link colors to specific rooms and surfaces
* **Never Guess Again:** Know exactly which "Eggshell" or "Off-White" you used

### ⚙️ Settings & Customization
* **Multi-Language Support:** Switch between multiple languages
* **Theme Toggle:** Dark and light mode support
* **Household Configuration:** Set heating type, manage waste categories
* **Data Management:** Control your household data and preferences
* **Version Display:** See the current app version in the sidebar

### 🏡 Dashboard Overview
* **House Health Status:** Visual indicators for overall household status
* **Quick Stats Cards:** At-a-glance metrics for appliances, maintenance, and expenses
* **Quick Access Tiles:** Jump directly to waste calendar, maintenance, warranties, energy, and lending
* **Responsive Design:** Optimized for desktop and mobile devices
* **Global Search:** Find anything across all modules quickly

---

## 🚀 Development

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

### Database Commands

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

### Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with Turbo |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

---

## 🤝 Contributing

We welcome contributions to Adulting.Exe! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/Adulting.Exe.git
   cd Adulting.Exe
   ```
3. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Workflow

1. **Make your changes** following the project's coding style
2. **Test your changes** thoroughly:
   ```bash
   pnpm dev        # Test in development mode
   pnpm build      # Verify production build works
   pnpm lint       # Check for linting issues
   ```
3. **Commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add new feature description"
   git commit -m "fix: resolve specific bug"
   git commit -m "docs: update documentation"
   ```
4. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** on GitHub with a clear description of your changes

### Commit Message Guidelines

This project uses [semantic-release](https://semantic-release.gitbook.io/) for automated versioning. Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features (triggers a minor release)
- `fix:` - Bug fixes (triggers a patch release)
- `perf:` - Performance improvements (triggers a patch release)
- `refactor:` - Code refactoring (triggers a patch release)
- `docs:` - Documentation changes (no release)
- `chore:` - Maintenance tasks (no release)
- `style:` - Code style changes (no release)
- `test:` - Test updates (no release)
- `BREAKING CHANGE:` - Breaking changes (triggers a major release)

**Examples:**
```bash
feat: add QR code generation for inventory items
fix: resolve warranty expiration date calculation
docs: update installation instructions
feat!: redesign dashboard layout

BREAKING CHANGE: Dashboard layout has been completely redesigned
```

### Code Style

- Follow the existing code style and conventions
- Use TypeScript for type safety
- Write clear, descriptive variable and function names
- Add comments for complex logic
- Keep components small and focused

### What to Contribute

- 🐛 **Bug fixes** - Help squash bugs and improve stability
- ✨ **New features** - Add functionality from the roadmap or propose your own
- 📚 **Documentation** - Improve guides, add examples, fix typos
- 🎨 **UI/UX improvements** - Enhance the user interface and experience
- 🧪 **Tests** - Add test coverage for existing or new features
- 🌍 **Translations** - Add or improve language translations

### Code Review Process

- All submissions require review before merging
- Maintainers will provide feedback and may request changes
- Once approved, your contribution will be merged and included in the next release
- Contributors will be credited in release notes

### Questions or Issues?

- **Bug reports:** Open an issue with detailed steps to reproduce
- **Feature requests:** Open an issue describing the feature and use case
- **Questions:** Start a discussion in GitHub Discussions

### Versioning & Releases

When code is merged to the `main` branch:
- Semantic-release analyzes commits since the last release
- Automatically determines the next version number
- Updates `package.json` and `pnpm-lock.yaml`
- Generates a changelog in `CHANGELOG.md`
- Creates a GitHub release with release notes
- Tags Docker images with the semantic version

The current version is displayed in the app sidebar.

---

## 📝 Roadmap

Future features and improvements:

- [ ] QR Code Generator for moving boxes and quick inventory access
- [ ] Automatic PDF Export for home insurance audits
- [ ] Smart Meter API integrations for automated utility tracking
- [ ] Notification system for upcoming maintenance and warranty expirations
- [ ] Mobile app (iOS/Android) companion
- [ ] Import/Export functionality for data portability
- [ ] Multi-household support for property managers

---

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Current Status:** *The house is still standing (as of today).*
