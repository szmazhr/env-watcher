# Changelog

All notable changes to the "env-watcher" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-10-01

### Added
- 🧙 Interactive setup wizard for per-project configuration
- 📝 Manual and automatic .env file update modes
- 🛡️ Smart .env file management that never overrides existing values
- 📍 Optional file path comments showing where each variable is used
- 🔧 Configurable file patterns and regex for variable detection
- 📂 Support for custom env file names and locations
- 🚫 Automatic exclusion of common build/framework directories (.next, _next, node_modules, etc.)
- 🚫 Automatic exclusion of all dot-prefixed files and folders (including nested ones)
- 📊 Status bar indicator showing count of discovered variables
- 🔒 Disabled by default for opt-in workflow
- 💬 Clear user feedback with informative messages
- 📖 Comprehensive README with examples and usage instructions

### Features
- **Setup Wizard**: 7-step interactive configuration process
  - Files to watch configuration
  - Regex pattern customization
  - .env and .env.example file path settings
  - Placeholder value configuration
  - Auto-create vs manual mode selection
  - File path comments option

- **Commands**:
  - `Env Watcher: Run Setup Wizard` - Configure or reconfigure the extension
  - `Env Watcher: Scan Workspace` - Scan for environment variables
  - `Env Watcher: Update .env Files` - Manually update .env files
  - `Env Watcher: Enable` - Enable the watcher
  - `Env Watcher: Disable` - Disable the watcher

- **Configuration Options**:
  - `envWatcher.enabled` - Enable/disable the extension
  - `envWatcher.setupCompleted` - Setup wizard completion status
  - `envWatcher.autoCreateFiles` - Automatic file creation mode
  - `envWatcher.includeFilePaths` - Show file paths in comments
  - `envWatcher.filesToWatch` - File patterns to monitor
  - `envWatcher.patterns` - Regex patterns for variable detection
  - `envWatcher.envFile` - Path to .env file
  - `envWatcher.exampleFile` - Path to .env.example file
  - `envWatcher.examplePlaceholder` - Placeholder for .env.example
  - `envWatcher.excludePatterns` - Patterns to exclude from watching

### Technical Details
- Built with TypeScript
- Requires VS Code 1.80.0 or higher
- Workspace-specific configuration
- Real-time file watching with debouncing
- Efficient pattern matching with regex
- Smart file merging algorithm

### License
- MIT License

---

## [Unreleased]

### Planned Features
- Support for multiple .env file sets per project
- Environment variable validation
- Conflict detection between files
- Import/export configuration profiles
- VS Code Marketplace publication

---

**Note**: This is the initial public release of the extension.

[0.1.0]: https://github.com/szmazhr/env-watcher/releases/tag/v0.1.0
[Unreleased]: https://github.com/szmazhr/env-watcher/compare/v0.1.0...HEAD
