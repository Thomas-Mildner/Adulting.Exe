# [1.0.0-rc.2](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.0.0-rc.1...v1.0.0-rc.2) (2026-09-04)


### Bug Fixes

* **changelog:** cleaning up repo urls ([ffcae3b](https://github.com/Thomas-Mildner/Adulting.Exe/commit/ffcae3b6d361b0dd071c7d7f0b2d7ee7cd3bc0e2))
* **i18n:** correct german translation for garage module title in settings ([d81f7ef](https://github.com/Thomas-Mildner/Adulting.Exe/commit/d81f7ef3b3ea4c6cda693e2775fcf4ee46a48be0))
* **package:** add missing commas in package.json for proper JSON formatting ([c75c0da](https://github.com/Thomas-Mildner/Adulting.Exe/commit/c75c0dad647b0b4e252ab89c35064bbde473c042))
* **scripts:** read commit message from correct branch in sync script ([034908b](https://github.com/Thomas-Mildner/Adulting.Exe/commit/034908b44fa04d1a6bf0d83cc75da254109c50c0))
* **sync:** correct public branch naming in sync script ([b28a88f](https://github.com/Thomas-Mildner/Adulting.Exe/commit/b28a88f415b8e261e54cd12ec60a29fc6d71784f))
* **sync:** correct public branch naming in sync script ([c0ed265](https://github.com/Thomas-Mildner/Adulting.Exe/commit/c0ed2659cc8950e79f7ecfcac6dfda16a9736922))
* upgrade Next.js to 16.3.1 and migrate pnpm overrides to workspace configuration ([20a9d46](https://github.com/Thomas-Mildner/Adulting.Exe/commit/20a9d46b9f1edd5e2752eee59df87bd00c7ac086))
* upgrade Node.js to 24 and @types/node to 24.13.3, ([ece2a7b](https://github.com/Thomas-Mildner/Adulting.Exe/commit/ece2a7bcfc7d45bd053bf628dd4ad3b6bf6e392f))
* use latest private commit message for public sync ([a95c066](https://github.com/Thomas-Mildner/Adulting.Exe/commit/a95c0663431df51d04fe63bd2407b0666b2b584f))


### Features

* add Emergency Hub section with essential emergency contacts and documents management ([2f71837](https://github.com/Thomas-Mildner/Adulting.Exe/commit/2f718376d4891e9bf5377dd4dc0f7d369e8074c6))
* add initial agent and Copilot instructions, and establish guidelines in AGENTS.md ([dc7a535](https://github.com/Thomas-Mildner/Adulting.Exe/commit/dc7a535cc03dd75998091646ccc9262f7183483f))
* add meal planning module with integration for 7-meals ([9370998](https://github.com/Thomas-Mildner/Adulting.Exe/commit/9370998bd731dd62c7aac8b28ec140c5545607fb))

# 1.0.0-rc.1 (2026-09-04)


### Bug Fixes

* add Car Pit feature card to documentation ([a4e71a1](https://github.com/Thomas-Mildner/Adulting.Exe/commit/a4e71a188ebd072d6d00cdc78070eea2f064547d))
* add cleanup handlers and improve documentation ([0f0c8b7](https://github.com/Thomas-Mildner/Adulting.Exe/commit/0f0c8b736cdcda56d6518097aead83e18847a883))
* Add comparison text for utility costs in English and German localization ([88ac92c](https://github.com/Thomas-Mildner/Adulting.Exe/commit/88ac92cc7f03d420b6d4cf24dffc2f9ec43a4bf6))
* add garage module with management features to settings ([d602bbc](https://github.com/Thomas-Mildner/Adulting.Exe/commit/d602bbc2e035e33c4029943853a1bfeba26cf244))
* Add initial database migration and lock file for schema setup ([b993e5a](https://github.com/Thomas-Mildner/Adulting.Exe/commit/b993e5acfcf7102197fe7a3edf57c6f9bf2b6c55))
* Add language toggle to webpage in docs ([819213c](https://github.com/Thomas-Mildner/Adulting.Exe/commit/819213c0718015745a2bf54674a54867959fb776))
* add packages entry to pnpm workspace config ([bdb7805](https://github.com/Thomas-Mildner/Adulting.Exe/commit/bdb780505de27c547281930a0cf2baa89f981360))
* add proper semantic version comparison and error handling ([cc71e37](https://github.com/Thomas-Mildner/Adulting.Exe/commit/cc71e376a6d2e74367e69a7622a37645dbdeaaf4))
* address security review - UUID filenames, magic byte validation, safe path checks ([149e6d2](https://github.com/Thomas-Mildner/Adulting.Exe/commit/149e6d28b0c6cd74d5c72c31a3c241c235abaef9))
* checkout release tag in docker job to sync versions ([4b24832](https://github.com/Thomas-Mildner/Adulting.Exe/commit/4b248328faae4a698b994eb4c63efda544815ad8))
* **ci:** add postgres datasource / add / edit crud operations ([2f1de62](https://github.com/Thomas-Mildner/Adulting.Exe/commit/2f1de62e3d3cc33d13b40697ac069235bb55379c))
* **ci:** changed dockerhub repo ([5285323](https://github.com/Thomas-Mildner/Adulting.Exe/commit/5285323bd3d2f22d53871f5089e7e419414a0178))
* **ci:** initial project commit ([3356eb0](https://github.com/Thomas-Mildner/Adulting.Exe/commit/3356eb01716865793442669362d5d12ce9c91ca6))
* **ci:** Remove '-rc' suffix from version output in beta releases ([a86bda9](https://github.com/Thomas-Mildner/Adulting.Exe/commit/a86bda98935a584cc5f943935b31d911141c498d))
* **ci:** remove packageManager field from package.json ([cd29d88](https://github.com/Thomas-Mildner/Adulting.Exe/commit/cd29d885de5f7fd0d25a6882ea1c4a82f26f97c5))
* conditionally render StatusBanner based on document length ([83eaf02](https://github.com/Thomas-Mildner/Adulting.Exe/commit/83eaf0294b5ceed693368a2d2b17010e12410442))
* correct German spelling and grammar across  components ([ce6fdd7](https://github.com/Thomas-Mildner/Adulting.Exe/commit/ce6fdd7e3b0ea2f2be7dac2c133b8af958214cb8))
* docker job dependency and add versioning docs ([8d772db](https://github.com/Thomas-Mildner/Adulting.Exe/commit/8d772db442d1c7e1728e789c578eb9dd83b967ed))
* **docker:** enable corepack and prepare pnpm in Dockerfile ([fc0aa9d](https://github.com/Thomas-Mildner/Adulting.Exe/commit/fc0aa9de00dbdeb3203b10b22d6f813cab27b36a))
* **docker:** improved dockerfile size ([0357a4f](https://github.com/Thomas-Mildner/Adulting.Exe/commit/0357a4f1643dd6004c1a2a61c54a4c03358c945c))
* Enhance Dockerfile and docker-compose.yml with entrypoint script and health checks for PostgreSQL service ([1aa0412](https://github.com/Thomas-Mildner/Adulting.Exe/commit/1aa0412de883a0529a9647d01175f1cf533c7545))
* Fixed Database Schema while startup and add agents.md file ([2bf6b44](https://github.com/Thomas-Mildner/Adulting.Exe/commit/2bf6b444b245237a582190b3093faf76ffa8f934))
* internationalize all user-facing strings in documents components ([dfbb234](https://github.com/Thomas-Mildner/Adulting.Exe/commit/dfbb23478d5cff24e4a870f38ce16f2166127f3f))
* Persist credentials during checkout in the build-and-deploy workflow ([e10f809](https://github.com/Thomas-Mildner/Adulting.Exe/commit/e10f8091ccfe93c34579581dfac612ecf2f1a83b))
* pin pnpm version to 9.15.9 to prevent lockfile compatibility issues ([4ae5664](https://github.com/Thomas-Mildner/Adulting.Exe/commit/4ae56641244b385c58f53b65d07265120231e73c))
* **release:** add check for new release detection in semantic release step ([ef8bc82](https://github.com/Thomas-Mildner/Adulting.Exe/commit/ef8bc82d6df7c8fc3e631dcf317bab61436a7280))
* **release:** add check for new release detection in semantic release step ([d2e79e4](https://github.com/Thomas-Mildner/Adulting.Exe/commit/d2e79e4caf7cdc773a461c684a8936aa2309297d))
* **release:** enhance conditions for semantic release and beta image push ([7b5cacb](https://github.com/Thomas-Mildner/Adulting.Exe/commit/7b5cacb2985e8d66e050a519a27253f659b03208))
* **release:** update release output variables and add version check for semantic release ([613fe96](https://github.com/Thomas-Mildner/Adulting.Exe/commit/613fe96df889bd15bfaca1bab3abb47c994a2424))
* remove required from optional fields in onboarding, fix label translation key ([d6d6066](https://github.com/Thomas-Mildner/Adulting.Exe/commit/d6d6066fe6f580ec2cced88cdcec7f01441290b4))
* Trigger a new release version ([d6c9444](https://github.com/Thomas-Mildner/Adulting.Exe/commit/d6c9444d50a9300096fee39d302cfb829e851f68))
* update Docker job dependencies and version determination logic ([b98379a](https://github.com/Thomas-Mildner/Adulting.Exe/commit/b98379a634f5feac8229bb9dbd651535c2156807))
* update Dockerfile to use lts-alpine node version for consistency ([6652299](https://github.com/Thomas-Mildner/Adulting.Exe/commit/6652299926a780dcb6582d8be7ea61dbe1d4e188))
* update entrypoint script to deploy database migrations instead of pushing schema ([5f09dd8](https://github.com/Thomas-Mildner/Adulting.Exe/commit/5f09dd8df5964268052c2e7d8ed3f7309b1830dd))
* update packages ([cf95d4c](https://github.com/Thomas-Mildner/Adulting.Exe/commit/cf95d4c5c1ee578bafca480d6d5bd29fed2a2fd0))
* update packages to address security vulnerabilities ([f806afb](https://github.com/Thomas-Mildner/Adulting.Exe/commit/f806afb5f456354236b989dcb3455301a28eeeff))
* update tag fetching logic to only consider RC tags ([43e14f0](https://github.com/Thomas-Mildner/Adulting.Exe/commit/43e14f0e71cd06bc2bae719eeafe89d1b7662ca4))
* update translation context for species in PetFormFields ([b6b82f4](https://github.com/Thomas-Mildner/Adulting.Exe/commit/b6b82f4adee2c4308aa63dcb169d2f7a4ae2834b))
* update version handling and add new release notifier ([9a162ff](https://github.com/Thomas-Mildner/Adulting.Exe/commit/9a162ff4774ffc3ef307ea9cb38bd317f744c234))
* use captured previous state for error rollback in ModuleSettings ([1822e7d](https://github.com/Thomas-Mildner/Adulting.Exe/commit/1822e7d6da6a6134f9f85cfee92199c673a7c184))
* use i18n translations for all hardcoded strings in onboarding wizard ([bb853a5](https://github.com/Thomas-Mildner/Adulting.Exe/commit/bb853a51d1522925dabe9def7a519954884b67a6))
* **workflows:** remove version specification for pnpm installation ([78e8f65](https://github.com/Thomas-Mildner/Adulting.Exe/commit/78e8f654632401263e28825aa8313d9b225f4344))


### Features

* add API route to fetch latest GitHub release version ([a8b6f1f](https://github.com/Thomas-Mildner/Adulting.Exe/commit/a8b6f1f368e8fdeefbf57f33e9809dd1ba972309))
* add cost and consumption projection features to UtilityTracker component ([4567a57](https://github.com/Thomas-Mildner/Adulting.Exe/commit/4567a572ef3f0a8d0149ed61a58dfa51700531cc))
* add cost fields to MeterReading model and update related functions ([14573ad](https://github.com/Thomas-Mildner/Adulting.Exe/commit/14573ad06035cb7dda4c705b4ad5307d229dd090))
* add database migration for car models and related entities ([6383bf0](https://github.com/Thomas-Mildner/Adulting.Exe/commit/6383bf0b2735fd10057b07c4a4d443e931c103ce))
* add database schema for Person and IdentityDocument models ([d62631a](https://github.com/Thomas-Mildner/Adulting.Exe/commit/d62631ae7ee6477632ab26303bf32bc03c9b3572))
* add dependabot configuration and update nightly-staging workflow ([7211091](https://github.com/Thomas-Mildner/Adulting.Exe/commit/721109135f6a5f873438af788437169f67554152))
* add dependabot configuration for GitHub Actions and npm updates ([4f75131](https://github.com/Thomas-Mildner/Adulting.Exe/commit/4f75131b36652ff159f207e69863c478be5abe96))
* add document tracking functionality with editing capabilities ([d9353a2](https://github.com/Thomas-Mildner/Adulting.Exe/commit/d9353a29a6999a4cd24e9dcd0523b00053cecda9))
* add documents card to dashboard and expiry notifications ([b2b2be4](https://github.com/Thomas-Mildner/Adulting.Exe/commit/b2b2be4deb96772e332a473933b5e401bc34702d))
* add documents page with UI components and translations ([9f1c8c2](https://github.com/Thomas-Mildner/Adulting.Exe/commit/9f1c8c285e7dff4aa072ddf542945fd68a771584))
* add GitHub authentication support for private repositories ([2a740d4](https://github.com/Thomas-Mildner/Adulting.Exe/commit/2a740d492b07988a5986f053651d231edafc4255))
* add GitHub Pages site (index.html) ([#33](https://github.com/Thomas-Mildner/Adulting.Exe/issues/33)) ([70fb071](https://github.com/Thomas-Mildner/Adulting.Exe/commit/70fb0713ac18040842ddf6c5c26cee866aaba61a))
* add IF NOT EXISTS clause to table creation and foreign key constraints in migration.sql ([b6fd421](https://github.com/Thomas-Mildner/Adulting.Exe/commit/b6fd421c9ffdf7014ef7019986f5a40a038e2abb))
* add index.html for home management dashboard ([a82fae3](https://github.com/Thomas-Mildner/Adulting.Exe/commit/a82fae3c9bb8ffe122aebfeaa2750b455a5f5009))
* add initial database migration with multiple tables and relationships ([66ed481](https://github.com/Thomas-Mildner/Adulting.Exe/commit/66ed4816dcdc05d52cfebe25169fdc529c06b21e))
* Add internationalization support with English translations ([aa3d9e7](https://github.com/Thomas-Mildner/Adulting.Exe/commit/aa3d9e74768f418b004cfd6ca4fc78e5cc08d655))
* add lightbox to landing page screenshots ([a76ffdf](https://github.com/Thomas-Mildner/Adulting.Exe/commit/a76ffdf08bc53e4ca5bf0014de4edd4951313e04))
* add module selection - enable/disable sidebar modules in settings ([16474fa](https://github.com/Thomas-Mildner/Adulting.Exe/commit/16474fad56af87a547761753b312c9618532ac08))
* add NotificationCenter component and integrate notifications into DashboardLayout ([16520c4](https://github.com/Thomas-Mildner/Adulting.Exe/commit/16520c44107c771f817ffea5b7dafc3f8bbb9333))
* add onboarding wizard for new household setup ([af4d692](https://github.com/Thomas-Mildner/Adulting.Exe/commit/af4d692eb6cfb7a0f3383ac0359f58d4094cbfee))
* add proper Prisma migration for Person and IdentityDocument models ([a3425b1](https://github.com/Thomas-Mildner/Adulting.Exe/commit/a3425b1f70086e51feaca90d6bae84d9337cd924))
* add QR code functionality and appliance detail page ([b2122da](https://github.com/Thomas-Mildner/Adulting.Exe/commit/b2122da0d3a60286cc7925115e1045ff201dd8eb))
* Add recurring contracts tracking module ([#26](https://github.com/Thomas-Mildner/Adulting.Exe/issues/26)) ([dc72b68](https://github.com/Thomas-Mildner/Adulting.Exe/commit/dc72b68bd6852d9b44e91faf718b5c38c334b90b))
* add semantic-release and version display ([9a5f60a](https://github.com/Thomas-Mildner/Adulting.Exe/commit/9a5f60a0f7fd69ab4a0d579795c874adef1bac0b))
* add staging release workflow with build, release, and Docker image steps ([8d014f6](https://github.com/Thomas-Mildner/Adulting.Exe/commit/8d014f64b6b0d1bf2235ec829a081ef5880de358))
* add Tax Preparation Export – bundle tax-deductible invoices into ZIP ([fcc8c05](https://github.com/Thomas-Mildner/Adulting.Exe/commit/fcc8c0516e6ae3bffbfc2c7b3177003399117500))
* add tutorial wizard for each module shown on first visit ([b0dcbcc](https://github.com/Thomas-Mildner/Adulting.Exe/commit/b0dcbcc44d60454ced02024342c4b0a7470e0660))
* add update available indicator to sidebar and settings ([ab6902c](https://github.com/Thomas-Mildner/Adulting.Exe/commit/ab6902cf8b2d5a687b6bd5fbe22266299344f73c))
* Add waste management with colors and icons ([aa6744c](https://github.com/Thomas-Mildner/Adulting.Exe/commit/aa6744c40aba88ebec900c0cf8efb5e7e8f0a9e2))
* enhance library and wishlist components with create, edit, and delete functionalities ([383becc](https://github.com/Thomas-Mildner/Adulting.Exe/commit/383beccd57eacfa9689bf0fdf2fcad1e2c610d92))
* implement notification center ([d53f3c5](https://github.com/Thomas-Mildner/Adulting.Exe/commit/d53f3c52d1f1c967805f80d7ce24aec403bb7aee))
* implement settings page with heating type configuration and enhance utility tracker with dynamic heating unit display ([cdc55f2](https://github.com/Thomas-Mildner/Adulting.Exe/commit/cdc55f2526af2fee4e20d1f267e7448f0c1484dd))
* implement settings page with heating type configuration and enhance utility tracker with dynamic heating unit display ([c91f108](https://github.com/Thomas-Mildner/Adulting.Exe/commit/c91f1083260fd01d4ab4578fa0b332f7adfde27b))
* Implement theme toggle and support dark mode ([e48d8cd](https://github.com/Thomas-Mildner/Adulting.Exe/commit/e48d8cd86275b43d5c0fc8989950314bd0932970))
* Implement waste management localization and enhance UI with translations ([1de6311](https://github.com/Thomas-Mildner/Adulting.Exe/commit/1de63110288d601c87cda8b076dc6783112247aa))
* refactor version checking logic into useVersionCheck hook ([7e6bdf3](https://github.com/Thomas-Mildner/Adulting.Exe/commit/7e6bdf3c4b02e477a2df378f51e4915c60502007))
* remove WasteTypeSettings from SettingsPage and add ical.js dependency ([6eb345c](https://github.com/Thomas-Mildner/Adulting.Exe/commit/6eb345cc07e53365f473d1b9574fa0f582738e84))
* update database schema and migrations ([84b9a6e](https://github.com/Thomas-Mildner/Adulting.Exe/commit/84b9a6e1029881293ba2040c4992e30b097c7a3a))
* update Dockerfile for standalone output and adjust .dockerignore; fix import path in next-env.d.ts ([1e34424](https://github.com/Thomas-Mildner/Adulting.Exe/commit/1e344246bcebcff452a944b43e6aa1602134726a))
* update Node.js version to 22.14.0 in Dockerfile and build workflow ([4f32b01](https://github.com/Thomas-Mildner/Adulting.Exe/commit/4f32b014c62bd852be76a1ed45d10f15d98f6965))
* **vault:** add file upload and camera capture for vault entries ([f1102eb](https://github.com/Thomas-Mildner/Adulting.Exe/commit/f1102eb7a4f4de04fb9a7c3716fcbc07cc1f12e3))

# [1.8.0-rc.21](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.20...v1.8.0-rc.21) (2026-07-19)


### Bug Fixes

* add Car Pit feature card to documentation ([99d3578](https://github.com/Thomas-Mildner/Adulting.Exe/commit/99d35782878540d96f7f0db86ca8c14cc6ba3137))


### Features

* add dependabot configuration and update nightly-staging workflow ([1bdd67b](https://github.com/Thomas-Mildner/Adulting.Exe/commit/1bdd67b68926acc9800b7399113c2e41245a35c5))
* add dependabot configuration for GitHub Actions and npm updates ([c8a8016](https://github.com/Thomas-Mildner/Adulting.Exe/commit/c8a8016c2a40cfdab38f5af08ad7d7def59c5147))

# [1.8.0-rc.20](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.19...v1.8.0-rc.20) (2026-05-12)


### Bug Fixes

* add garage module with management features to settings ([88e5167](https://github.com/Thomas-Mildner/Adulting.Exe/commit/88e5167dbba7d0b31f167ac368df833137229c6c))
* Add initial database migration and lock file for schema setup ([1b8f3f5](https://github.com/Thomas-Mildner/Adulting.Exe/commit/1b8f3f5b11c229912e6cc68c6f6adca4c848bde7))
* add packages entry to pnpm workspace config ([3cbf4ec](https://github.com/Thomas-Mildner/Adulting.Exe/commit/3cbf4ec1cfeef71b92ac24dd1788b814decce7eb))
* update translation context for species in PetFormFields ([74394ce](https://github.com/Thomas-Mildner/Adulting.Exe/commit/74394ce317c11f7df3a81a97a1bfac7851ad2502))


### Features

* add database migration for car models and related entities ([62e8bf9](https://github.com/Thomas-Mildner/Adulting.Exe/commit/62e8bf9d9961359005860c061cdc295dec12fdfb))
* add IF NOT EXISTS clause to table creation and foreign key constraints in migration.sql ([a04cc45](https://github.com/Thomas-Mildner/Adulting.Exe/commit/a04cc45047050168820a21a7fb38edf465636849))

# [1.8.0-rc.19](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.18...v1.8.0-rc.19) (2026-05-07)


### Features

* add lightbox to landing page screenshots ([d1dd7ba](https://github.com/Thomas-Mildner/Adulting.Exe/commit/d1dd7ba44f9e3052ba5817a47128a3f849d2c23b))

# [1.8.0-rc.18](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.17...v1.8.0-rc.18) (2026-04-28)


### Bug Fixes

* address security review - UUID filenames, magic byte validation, safe path checks ([9bac703](https://github.com/Thomas-Mildner/Adulting.Exe/commit/9bac7032c2fe250e56dd13e3e75713a460614a14))


### Features

* **vault:** add file upload and camera capture for vault entries ([4bf98e6](https://github.com/Thomas-Mildner/Adulting.Exe/commit/4bf98e617e59a5aee4ea2f75257a0f4172db6b88))

# [1.8.0-rc.17](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.16...v1.8.0-rc.17) (2026-04-19)


### Bug Fixes

* **docker:** improved dockerfile size ([b40da2a](https://github.com/Thomas-Mildner/Adulting.Exe/commit/b40da2acc042b9f25f97df5f21c849f559713b1c))

# [1.8.0-rc.16](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.15...v1.8.0-rc.16) (2026-04-18)


### Bug Fixes

* **docker:** enable corepack and prepare pnpm in Dockerfile ([6ac2fc3](https://github.com/Thomas-Mildner/Adulting.Exe/commit/6ac2fc3195378b5fa0701a2b91bcc164ffbb71fd))
* **workflows:** remove version specification for pnpm installation ([9f230d2](https://github.com/Thomas-Mildner/Adulting.Exe/commit/9f230d284b200fa48c71cda4cc463c24b3953db2))

# [1.8.0-rc.15](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.14...v1.8.0-rc.15) (2026-04-18)


### Bug Fixes

* **ci:** remove packageManager field from package.json ([da9373e](https://github.com/Thomas-Mildner/Adulting.Exe/commit/da9373e35c1e4bc4e8e13d4c0910f96d125f8533))
* pin pnpm version to 9.15.9 to prevent lockfile compatibility issues ([c0e3cd3](https://github.com/Thomas-Mildner/Adulting.Exe/commit/c0e3cd3ff7e88d95cee876824cd57d38adb8d4c7))

# [1.8.0-rc.14](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.13...v1.8.0-rc.14) (2026-04-18)


### Features

* update Dockerfile for standalone output and adjust .dockerignore; fix import path in next-env.d.ts ([14048bf](https://github.com/Thomas-Mildner/Adulting.Exe/commit/14048bf4e834c0300676f8c01b107f898abe2a9a))

# [1.8.0-rc.13](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.12...v1.8.0-rc.13) (2026-04-13)


### Features

* add tutorial wizard for each module shown on first visit ([83c2c97](https://github.com/Thomas-Mildner/Adulting.Exe/commit/83c2c97c8cd2001004db9a210f804406876da251))

# [1.8.0-rc.12](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.11...v1.8.0-rc.12) (2026-04-12)


### Bug Fixes

* update tag fetching logic to only consider RC tags ([3f0b9b0](https://github.com/Thomas-Mildner/Adulting.Exe/commit/3f0b9b024da8c5ab345440b7863adcb0fdc6eafd))


### Features

* add Tax Preparation Export – bundle tax-deductible invoices into ZIP ([52f74c2](https://github.com/Thomas-Mildner/Adulting.Exe/commit/52f74c21b3370de8e7c00054f7568cc7a57965d1))

# [1.8.0-rc.11](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.10...v1.8.0-rc.11) (2026-04-12)


### Bug Fixes

* update packages to address security vulnerabilities ([4781a98](https://github.com/Thomas-Mildner/Adulting.Exe/commit/4781a98c5d87e33d29c6833f5e0b40215a9d6e8f))

# [1.8.0-rc.10](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.9...v1.8.0-rc.10) (2026-04-12)


### Bug Fixes

* remove required from optional fields in onboarding, fix label translation key ([9279a99](https://github.com/Thomas-Mildner/Adulting.Exe/commit/9279a9976b81112245b8a9ab6c3b4c7069c7c46f))
* use i18n translations for all hardcoded strings in onboarding wizard ([ee1c5c9](https://github.com/Thomas-Mildner/Adulting.Exe/commit/ee1c5c97ada56a1e5e795ccde367e10581ea3a9c))


### Features

* add onboarding wizard for new household setup ([f96d402](https://github.com/Thomas-Mildner/Adulting.Exe/commit/f96d40277f322eeb7ee365eadb39c36b3ef1544c))

# [1.8.0-rc.9](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.8...v1.8.0-rc.9) (2026-04-12)


### Bug Fixes

* Add language toggle to webpage in docs ([5b6020d](https://github.com/Thomas-Mildner/Adulting.Exe/commit/5b6020d242858fb856ffeeae4a9752e52bdac0d1))
* use captured previous state for error rollback in ModuleSettings ([ebbd3f1](https://github.com/Thomas-Mildner/Adulting.Exe/commit/ebbd3f12281bbbe8d388eb58533107920930e878))


### Features

* add module selection - enable/disable sidebar modules in settings ([5d1a01a](https://github.com/Thomas-Mildner/Adulting.Exe/commit/5d1a01ae457627336ccc4366ef317e6d942f3a57))

# [1.8.0-rc.8](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.7...v1.8.0-rc.8) (2026-02-24)


### Bug Fixes

* Persist credentials during checkout in the build-and-deploy workflow ([515135c](https://github.com/Thomas-Mildner/Adulting.Exe/commit/515135c42194e014e4050be00bd394f9df597602))


### Features

* Add recurring contracts tracking module ([#26](https://github.com/Thomas-Mildner/Adulting.Exe/issues/26)) ([a53b600](https://github.com/Thomas-Mildner/Adulting.Exe/commit/a53b6007f6dbab850d028ddd34ce84b52fc7b391))

# [1.8.0-rc.7](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.6...v1.8.0-rc.7) (2026-02-23)


### Bug Fixes

* **ci:** Remove '-rc' suffix from version output in beta releases ([0de0221](https://github.com/Thomas-Mildner/Adulting.Exe/commit/0de0221cd82bea5b147cd5016aaa62a92f07fdbb))
* update Dockerfile to use lts-alpine node version for consistency ([cf2d781](https://github.com/Thomas-Mildner/Adulting.Exe/commit/cf2d781bedac923d2cf0b58bc3c65dcd557df10f))
* update entrypoint script to deploy database migrations instead of pushing schema ([201c18c](https://github.com/Thomas-Mildner/Adulting.Exe/commit/201c18c23f143ee8a2192d72680eb4d79326719a))


### Features

* add GitHub Pages site (index.html) ([#33](https://github.com/Thomas-Mildner/Adulting.Exe/issues/33)) ([3d070c0](https://github.com/Thomas-Mildner/Adulting.Exe/commit/3d070c09b3a4fba173d3bb83895cb312a1c81908))
* add index.html for home management dashboard ([65f5717](https://github.com/Thomas-Mildner/Adulting.Exe/commit/65f571775eed630735f2e472e27fc871eb556aee))

# [1.8.0-rc.6](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.5...v1.8.0-rc.6) (2026-02-22)


### Bug Fixes

* **release:** add check for new release detection in semantic release step ([c68fc69](https://github.com/Thomas-Mildner/Adulting.Exe/commit/c68fc69ca1551eb226c94c44b7fa40e8752e9f29))

# [1.8.0-rc.5](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.4...v1.8.0-rc.5) (2026-02-22)


### Bug Fixes

* **release:** add check for new release detection in semantic release step ([3ebc2e6](https://github.com/Thomas-Mildner/Adulting.Exe/commit/3ebc2e666d0f15fe2b9acb1a9818830beab71285))

# [1.8.0-rc.4](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.3...v1.8.0-rc.4) (2026-02-22)


### Bug Fixes

* Trigger a new release version ([9709cef](https://github.com/Thomas-Mildner/Adulting.Exe/commit/9709cef4fe37ad58e16f66eaaab4984b0ef48d74))

# [1.8.0-rc.3](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.2...v1.8.0-rc.3) (2026-02-22)


### Bug Fixes

* Fixed Database Schema while startup and add agents.md file ([789cb7d](https://github.com/Thomas-Mildner/Adulting.Exe/commit/789cb7de9715822a555dc5b1d568202eb299de7e))
* **release:** enhance conditions for semantic release and beta image push ([21fe045](https://github.com/Thomas-Mildner/Adulting.Exe/commit/21fe0455047249368396fb3b330a2a9ace288c00))
* **release:** update release output variables and add version check for semantic release ([b089690](https://github.com/Thomas-Mildner/Adulting.Exe/commit/b089690a90df685f9d9f6185e45108700cd54dd4))

# [1.8.0-rc.2](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.8.0-rc.1...v1.8.0-rc.2) (2026-02-22)


### Bug Fixes

* **ci:** changed dockerhub repo ([907910b](https://github.com/Thomas-Mildner/Adulting.Exe/commit/907910b5204eb49770d9bcabfc9b6d1d3fbbcf52))
* conditionally render StatusBanner based on document length ([6bc2efa](https://github.com/Thomas-Mildner/Adulting.Exe/commit/6bc2efa2002f3d9f5424cdc88e2a273c26e34f7d))

# [1.8.0-rc.1](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.7.1...v1.8.0-rc.1) (2026-02-19)


### Bug Fixes

* internationalize all user-facing strings in documents components ([b2a2cf4](https://github.com/Thomas-Mildner/Adulting.Exe/commit/b2a2cf419830753fafa23173458c27dedaa19dc0))


### Features

* add database schema for Person and IdentityDocument models ([ee57e72](https://github.com/Thomas-Mildner/Adulting.Exe/commit/ee57e7263667fb8356af4f9b8154dd242e4f7f96))
* add document tracking functionality with editing capabilities ([d34c6be](https://github.com/Thomas-Mildner/Adulting.Exe/commit/d34c6bee0113758108f565822dd74e6399d7bbbe))
* add documents card to dashboard and expiry notifications ([2c19c22](https://github.com/Thomas-Mildner/Adulting.Exe/commit/2c19c22c514b86cf955445f8ae086af524cd601d))
* add documents page with UI components and translations ([07d4fc4](https://github.com/Thomas-Mildner/Adulting.Exe/commit/07d4fc4282438a83b08e30a0b037f53952dcd3c4))
* add proper Prisma migration for Person and IdentityDocument models ([6e26629](https://github.com/Thomas-Mildner/Adulting.Exe/commit/6e26629e8cf388e2c80cc2566b264a1b1e683922))
* add staging release workflow with build, release, and Docker image steps ([419ff06](https://github.com/Thomas-Mildner/Adulting.Exe/commit/419ff06ab89788b9ac60177bf387fe7f2890837c))

## [1.7.1](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.7.0...v1.7.1) (2026-02-17)


### Bug Fixes

* checkout release tag in docker job to sync versions ([d3cbb57](https://github.com/Thomas-Mildner/Adulting.Exe/commit/d3cbb578e25c526fc3a9900dffe9f2ee0ebdcbc8))

# [1.7.0](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.6.0...v1.7.0) (2026-02-17)


### Features

* add NotificationCenter component and integrate notifications into DashboardLayout ([54c98b3](https://github.com/Thomas-Mildner/Adulting.Exe/commit/54c98b370715f5bd76a269879d80d4f1b468dc37))
* implement notification center ([5eae1ca](https://github.com/Thomas-Mildner/Adulting.Exe/commit/5eae1ca6635656a1b8f038eea484b684e742b7ef))
* refactor version checking logic into useVersionCheck hook ([077695c](https://github.com/Thomas-Mildner/Adulting.Exe/commit/077695cd7acab3957b7458e249e2d4b6a24ec92a))
* update database schema and migrations ([09bde31](https://github.com/Thomas-Mildner/Adulting.Exe/commit/09bde315afd41bd93ba5d8b56d8d6c32eff8b38c))

# [1.6.0](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.5.1...v1.6.0) (2026-02-17)


### Features

* add initial database migration with multiple tables and relationships ([b748d75](https://github.com/Thomas-Mildner/Adulting.Exe/commit/b748d758b6aa23f6153aaf66c5d36b0cef95d743))
* add QR code functionality and appliance detail page ([b1579c2](https://github.com/Thomas-Mildner/Adulting.Exe/commit/b1579c2a8ace97592075e6ae00f7d90a001c4032))
* implement settings page with heating type configuration and enhance utility tracker with dynamic heating unit display ([b440495](https://github.com/Thomas-Mildner/Adulting.Exe/commit/b440495062621b8dc76dfdf116e698405678a560))

## [1.5.1](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.5.0...v1.5.1) (2026-02-17)


### Bug Fixes

* update Docker job dependencies and version determination logic ([3aaebaa](https://github.com/Thomas-Mildner/Adulting.Exe/commit/3aaebaad074339d3e826a427d5a8cec91a4bdfff))

# [1.5.0](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.4.0...v1.5.0) (2026-02-16)


### Features

* add cost and consumption projection features to UtilityTracker component ([cdeb668](https://github.com/Thomas-Mildner/Adulting.Exe/commit/cdeb668b8fe998c01b9b3772118c5bcd50e1ce84))

# [1.4.0](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.3.0...v1.4.0) (2026-02-16)


### Bug Fixes

* add cleanup handlers and improve documentation ([f74ee9d](https://github.com/Thomas-Mildner/Adulting.Exe/commit/f74ee9daba05c2583ecdb408fef772cf62a89806))
* add proper semantic version comparison and error handling ([8876325](https://github.com/Thomas-Mildner/Adulting.Exe/commit/8876325ed9742e1406dcc064f40ce58504b7c393))
* update version handling and add new release notifier ([03f8bfc](https://github.com/Thomas-Mildner/Adulting.Exe/commit/03f8bfccf0751345f59813dab5eb5d9a95e62f94))


### Features

* add API route to fetch latest GitHub release version ([9f6eca1](https://github.com/Thomas-Mildner/Adulting.Exe/commit/9f6eca18a5f93b4eb00114cc10d4e94ec1c0f7e3))
* add GitHub authentication support for private repositories ([a7c73b8](https://github.com/Thomas-Mildner/Adulting.Exe/commit/a7c73b8ef2a79208d66f44273c6a896117e20b04))
* add update available indicator to sidebar and settings ([36a4015](https://github.com/Thomas-Mildner/Adulting.Exe/commit/36a4015ae68cf3c3f8244aaf1eb6e277de808719))

# [1.3.0](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.2.0...v1.3.0) (2026-02-15)


### Bug Fixes

* Add comparison text for utility costs in English and German localization ([2a9f087](https://github.com/Thomas-Mildner/Adulting.Exe/commit/2a9f087fbcb01ea3c91e2bdd63d66faea3a894dd))


### Features

* Add waste management with colors and icons ([1825975](https://github.com/Thomas-Mildner/Adulting.Exe/commit/18259751e33a563eb0345328a46543bd9a77ec43))
* Implement theme toggle and support dark mode ([625db64](https://github.com/Thomas-Mildner/Adulting.Exe/commit/625db64b30f27f05b62db860826d843510e44b0b))

# [1.2.0](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.1.0...v1.2.0) (2026-02-15)


### Features

* Implement waste management localization and enhance UI with translations ([b4a48ea](https://github.com/Thomas-Mildner/Adulting.Exe/commit/b4a48ea1b7baae9f2aed859af0be53bfcd00a78d))

# [1.1.0](https://github.com/Thomas-Mildner/Adulting.Exe/compare/v1.0.0...v1.1.0) (2026-02-14)


### Features

* Add internationalization support with English translations ([95cd536](https://github.com/Thomas-Mildner/Adulting.Exe/commit/95cd5361593d158f831850ee68247fb5ea20ac31))

# 1.0.0 (2026-02-13)


### Bug Fixes

* **ci:** add postgres datasource / add / edit crud operations ([8f47683](https://github.com/Thomas-Mildner/Adulting.Exe/commit/8f47683cf031e67a3797b81824c8acc5df6eeb8f))
* **ci:** initial project commit ([adca443](https://github.com/Thomas-Mildner/Adulting.Exe/commit/adca443dd0f43cdc6704fc36a18b8b23af4398c4))
* correct German spelling and grammar across  components ([8379a5a](https://github.com/Thomas-Mildner/Adulting.Exe/commit/8379a5a60d5b8a69dddef93ffaa5c7a4ae3896b4))
* docker job dependency and add versioning docs ([92b4ce1](https://github.com/Thomas-Mildner/Adulting.Exe/commit/92b4ce1a64ce61a65f2d7f8fa10f3b7bcb31e7e8))
* Enhance Dockerfile and docker-compose.yml with entrypoint script and health checks for PostgreSQL service ([6296029](https://github.com/Thomas-Mildner/Adulting.Exe/commit/6296029690973b170ffaca4022be5dee404a3d44))


### Features

* add cost fields to MeterReading model and update related functions ([bf21e02](https://github.com/Thomas-Mildner/Adulting.Exe/commit/bf21e025932bb896fe0cd5f67cc6f07411c0ebfc))
* add semantic-release and version display ([8ed06cd](https://github.com/Thomas-Mildner/Adulting.Exe/commit/8ed06cd0266c7719526ffaf696118ed56cd251de))
* enhance library and wishlist components with create, edit, and delete functionalities ([75dac43](https://github.com/Thomas-Mildner/Adulting.Exe/commit/75dac43f736663efaea8079d627f4a60f959cfa3))
* implement settings page with heating type configuration and enhance utility tracker with dynamic heating unit display ([1f2ebd9](https://github.com/Thomas-Mildner/Adulting.Exe/commit/1f2ebd91538b864ff7d98398c32a0e820a8d1df1))
* remove WasteTypeSettings from SettingsPage and add ical.js dependency ([4699ae4](https://github.com/Thomas-Mildner/Adulting.Exe/commit/4699ae4f8960b510c51e994f5a2a2997d9884d32))
* update Node.js version to 22.14.0 in Dockerfile and build workflow ([0f22e6a](https://github.com/Thomas-Mildner/Adulting.Exe/commit/0f22e6af646cb41d5fe96423c81435805d5b7167))
