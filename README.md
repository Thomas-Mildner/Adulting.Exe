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

### 🐾 Pet Management Hub
* **Pet Profiles:** Track all your pets with name, species, breed, color, and date of birth
* **Microchip Numbers:** Store chip IDs for quick identification in emergencies
* **Pet-Sitter Instructions:** Document dietary needs and current medications for easy handoffs
* **Vet Record Tracking:** Log every veterinary visit with date, treatment, cost, and next appointment
* **Vaccination Schedule:** Track all vaccinations with due dates — overdues flagged automatically
* **Batch Number Logging:** Record vaccine batch numbers for full traceability

### 🪪 Identity Guard (Document Tracker)
* **Multi-Person Tracking:** Monitor identity documents for yourself, spouse, children, and other household members
* **Document Management:** Track IDs, Passports, Driver's Licenses, Visas, and custom documents
* **Expiry Monitoring:** Visual status badges showing document validity
  - 🟢 **Model Citizen:** Valid (>6 months until expiry)
  - 🟡 **Bureaucratic Anxiety:** Expiring soon (<6 months)
  - 🔴 **International Fugitive:** Expired documents
* **Smart Reminders:** Automated notifications at 6, 3, and 1 month before expiry
* **Physical Location Tracker:** Document where each physical document is stored
* **Emergency Guide:** One-click access to lost/stolen document procedures and emergency contacts
* **Countdown Timers:** Real-time expiry countdown for each document
* **Dashboard Integration:** Critical document status at a glance
* **Date Validation:** Prevents future issue dates and ensures logical date ranges

### 🤒 Illness Tracker
* **Per-Person Illness History:** Track every illness separately for each family member using the shared household person list
* **Start & End Dates:** Capture when an illness began, when it ended, and keep optional notes
* **Yearly Sick-Day Summary:** Count how many unique days each family member was sick in a given year
* **GitHub-Style Activity View:** Visualize sick days in a yearly heatmap grouped by person

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


### ⚙️ Settings & Customization
* **Multi-Language Support:** Switch between multiple languages
* **Theme Toggle:** Dark and light mode support
* **Household Configuration:** Set heating type, manage waste categories
* **Data Management:** Control your household data and preferences

### 🏡 Dashboard Overview
* **House Health Status:** Visual indicators for overall household status
* **Quick Stats Cards:** At-a-glance metrics for appliances, maintenance, and expenses
* **Quick Access Tiles:** Jump directly to waste calendar, maintenance, warranties, energy, and lending
* **Responsive Design:** Optimized for desktop and mobile devices
* **Global Search:** Find anything across all modules quickly

---

## 📸 Screenshots

All screenshots were taken using the seeded demo data (`pnpm db:seed`).

### 🏡 Dashboard
![Dashboard](docs/images/01-dashboard.png)

### 📦 Vault (Appliance & Warranty Management)
![Vault](docs/images/02-vault.png)

### 🛠️ Service Team
![Service Team](docs/images/03-services.png)

### 🪪 Identity Guard
![Identity Guard](docs/images/04-identity-guard.png)

### 🤒 Illness Tracker
![Illness Tracker](docs/images/11-illness-tracker.png)

### 🔧 Maintenance
![Maintenance](docs/images/05-maintenance.png)

### 📉 Utilities
![Utilities](docs/images/06-utilities.png)

### 🎯 Wishlist
![Wishlist](docs/images/07-wishlist.png)

### 💸 Lending (Lend-O-Meter)
![Lending](docs/images/08-lending.png)

### 📚 Library
![Library](docs/images/09-library.png)

### ⚙️ Settings
![Settings](docs/images/10-settings.png)

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

### Database Commands

| Command                  | Description                           |
| ------------------------ | ------------------------------------- |
| `pnpm db:push`           | Push schema changes to the database   |
| `pnpm db:seed`           | Seed the database with sample data    |
| `pnpm db:studio`         | Open Prisma Studio (visual DB editor) |
| `pnpm db:generate`       | Regenerate Prisma Client              |
| `pnpm db:reset`          | Reset database and re-seed            |
| `docker compose up -d`   | Start PostgreSQL                      |
| `docker compose down`    | Stop PostgreSQL                       |
| `docker compose down -v` | Stop & delete database volume         |

### Available Scripts

| Script       | Description                         |
| ------------ | ----------------------------------- |
| `pnpm dev`   | Start development server with Turbo |
| `pnpm build` | Build for production                |
| `pnpm start` | Start production server             |


---

## 🚢 Deployment

### Docker Compose (Recommended)

The easiest way to deploy Adulting.exe is with Docker Compose. Create a `docker-compose.yml` on your server:

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    container_name: adulting-exe-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: adulting
      POSTGRES_PASSWORD: <your-secure-password>
      POSTGRES_DB: adulting_exe
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U adulting -d adulting_exe"]
      interval: 5s
      timeout: 5s
      retries: 10

  app:
    image: thomasmildner/adulting-exe:latest
    container_name: adulting-exe-app
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://adulting:<your-secure-password>@postgres:5432/adulting_exe
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  pgdata:
```

> **Note:** Replace `<your-secure-password>` with a strong password. Make sure the password matches in both `POSTGRES_PASSWORD` and `DATABASE_URL`.

### Available Image Tags

| Tag | Description |
| --- | --- |
| `latest` | Latest stable production release |
| `main-latest` | Latest build from the main branch |
| `1.2.3` | Specific semantic version |
| `beta-latest` | Latest staging/beta build |
| `1.8.0-rc.1` | Release candidate version |

### Start the Stack

```bash
docker compose up -d
```

The app will be available at [http://localhost:3000](http://localhost:3000). On first startup, the database schema is applied automatically via Prisma migrations.

### Updating

Pull the latest image and restart:

```bash
docker compose pull app
docker compose up -d
```


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

This roadmap consolidates all researched features and improvements, organized by category. Items marked with 🔖 have a dedicated tracking issue. Items marked with *(v1)* were present in the original roadmap.

---

### 🆕 New Modules

#### 🚗 Car Workshop *(Garage / "The Money Pit")* 🔖 [#15](https://github.com/Thomas-Mildner/Adulting.Exe/issues/15)
- TÜV / Safety inspection countdown with "Illegal Go-Kart" status badge
- Maintenance & repair log (oil changes, parts replacements)
- Fuel & toll tracker (liters, price, mileage)
- Seasonal tire-change reminders with storage-location note
- First-aid kit expiry tracker
- Digital glovebox for registration documents & insurance policies
- Cost analytics: fuel vs. repairs vs. tolls
- One-click "Resale History" PDF export

#### 🛡️ Insurance Hub *(The Safety Net)* 🔖 [#17](https://github.com/Thomas-Mildner/Adulting.Exe/issues/17)
- Full policy registry (Hausrat, Wohngebäude, Haftpflicht, KFZ, etc.)
- Premium drain calculator — monthly & annual spend overview
- Cancellation-deadline sentinel with visual warnings (3-month lead)
- Claims checklist generator per policy
- Coverage overlap detector to spot double-insured items
- "Emergency Folder" ZIP export with all active policies

#### 🏠 Room Chronicles 🔖 [#27](https://github.com/Thomas-Mildner/Adulting.Exe/issues/27)
- Per-room event timeline (maintenance, aesthetics, incidents)
- Paint / flooring swatch library with color codes
- Quick-log hardware shortcuts (lightbulb, battery replacements)
- Room-specific printable QR codes
- Photo before/after gallery
- "Days since last kitchen incident" humor counter
- Tenant handover PDF export

#### 🌱 Gardening & Landscaping Log 🔖 [#39](https://github.com/Thomas-Mildner/Adulting.Exe/issues/39)
- Planting dates, soil treatments, and fertilizer tracking
- Irrigation schedules and watering reminders
- Seasonal task planning (spring prep, winter protection)
- Plant care history and notes per bed / zone

#### 🏥 Family Health Records 🔖 [#40](https://github.com/Thomas-Mildner/Adulting.Exe/issues/40)
- Blood types, immunization dates, allergy notes per household member
- Local doctor, dentist, and specialist contacts
- Next appointment reminders
- Medication schedule tracking

#### 🐾 Pet Management Hub 🔖 [#41](https://github.com/Thomas-Mildner/Adulting.Exe/issues/41)
- Vaccination schedules, vet records, microchip numbers
- Pet-sitter instruction sheet (dietary needs, medications)
- Annual check-up and flea/tick treatment reminders
- Pet insurance policy link

#### 🚨 Emergency Preparedness Hub *(new)*
- Emergency kit inventory with expiry dates (medicines, food rations, batteries)
- Fire extinguisher and smoke detector inspection tracker
- Household emergency contacts (neighbors, doctor, utilities hotline)
- Evacuation plan storage (PDF upload / notes)
- Power-outage supply checklist

#### 🛒 Shopping List & Household Inventory *(new)*
- Track household consumables (cleaning supplies, toiletries, pantry staples)
- Configurable reorder-point alerts per item
- Auto-generated shopping list when stock runs low
- Price history per item across shopping trips
- Barcode / QR-code scanner for quick item lookup

#### 🏘️ Neighbor & Community Directory *(new)*
- Neighbor contact cards with address, phone, and notes
- HOA / property management contacts
- Local tradespeople directory (emergency plumber, locksmith)
- Shared community notes (parcel deliveries, neighborhood events)

#### 📦 Moving & Relocation Manager *(new)*
- QR-labeled moving-box inventory with searchable contents
- "Find it fast" search across all boxes
- Room-assignment planner for unpacking
- Integration with Box Vault (appliance locations)
- Printable box labels with QR codes

---

### 🔧 Improvements to Existing Modules

#### 📦 Vault Enhancements
- [ ] QR Code Generator for appliances and moving boxes *(v1)*
- [ ] Automatic PDF Export for insurance audits *(v1)*
- [ ] Bulk import via CSV (purchase history spreadsheets)
- [ ] Appliance energy-consumption log per device
- [ ] Repair cost tracker linked to each appliance

#### 📉 Utility Tracker Enhancements
- [ ] Smart Meter API integrations for automated readings *(v1)*
- [ ] Solar panel and battery-storage production tracking
- [ ] Cost-per-day/week breakdown view
- [ ] Annual comparison chart (year-over-year)
- [ ] Carbon footprint estimation based on consumption

#### 🔧 Maintenance Enhancements
- [ ] Seasonal task templates (spring checklist, winterization guide)
- [ ] Maintenance history timeline view
- [ ] Parts and materials cost tracking per task
- [ ] Photo attachment for before/after documentation
- [ ] Contractor assignment (link to service provider from task)

#### 💸 Lending Tracker Enhancements
- [ ] Item categories and tags for easier filtering
- [ ] Automated overdue notification emails/webhooks
- [ ] Borrower reputation history across all loans

#### 🎯 Wishlist Enhancements
- [ ] Price tracking integration (monitor target price online)
- [ ] Voting / approval system for multi-user households
- [ ] Attach contractor quotes directly to a project
- [ ] Gantt-style project timeline view

#### 📚 Knowledge Base Enhancements
- [ ] Full-text search with highlighted excerpts
- [ ] Version history for edited entries
- [ ] AI-assisted summary generation for uploaded manuals

---

### 🎨 UX / UI Improvements

- [ ] **In-App Notification Center** — unified hub for all upcoming reminders (warranties, maintenance, documents, subscriptions) with read/unread management
- [ ] **Advanced Global Search** — cross-module full-text search with result categorization, recent-search history, and keyboard shortcut (`Cmd+K`)
- [ ] **Customizable Dashboard** — drag-and-drop widget arrangement, show/hide individual cards
- [ ] **Module Selection** — enable/disable entire modules from Settings 🔖 [#44](https://github.com/Thomas-Mildner/Adulting.Exe/issues/44)
- [ ] **Compact / Density Mode** — toggle between comfortable and dense table layouts
- [ ] **Onboarding Wizard** — guided setup for new households (add first appliance, set heating type, configure waste categories)
- [ ] **Keyboard Navigation** — full keyboard-shortcut support for power users
- [ ] **Color Theme Customization** — custom accent color, additional preset themes
- [ ] **Print-Friendly Views** — printable reports for each module (warranty list, maintenance log, insurance overview)

---

### ⚙️ Technical & Infrastructure

- [ ] **Authentication System** — local username/password or SSO (OAuth2) to secure self-hosted instances
- [ ] **Multi-User & Role-Based Access** 🔖 [#42](https://github.com/Thomas-Mildner/Adulting.Exe/issues/42) — Viewer / Editor / Admin roles per household
- [ ] **Multi-Household Support** — manage multiple properties from one account *(v1)*
- [ ] **Import / Export (CSV & JSON)** — full data portability for all modules *(v1)*
- [ ] **Progressive Web App (PWA)** — offline support, installable on iOS/Android home screen
- [ ] **External Notifications via Webhook** 🔖 [#43](https://github.com/Thomas-Mildner/Adulting.Exe/issues/43) — push events to Slack, Ntfy, Gotify, Apprise, etc.
- [ ] **RESTful API** — documented public API for integrations with Home Assistant, n8n, Zapier
- [ ] **Tax Preparation Export** 🔖 [#38](https://github.com/Thomas-Mildner/Adulting.Exe/issues/38) — one-click ZIP of all tax-relevant invoices per fiscal year
- [ ] **Database Backup & Restore UI** — schedule automated backups and restore from the Settings page
- [ ] **Audit Log** — change history for all records (who changed what and when)
- [ ] **Additional Language Support** — French, Spanish, Italian; community-contributed translations
- [ ] **Accessibility (WCAG 2.1)** — screen-reader optimization, improved color contrast, full keyboard navigation
- [ ] **Mobile App (iOS/Android)** — native companion app *(v1)*

---

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Current Status:** *The house is still standing (as of today).*
