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
