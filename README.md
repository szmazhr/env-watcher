# Environment Variable Watcher

A VS Code extension that watches your code for environment variable usage and helps maintain `.env` and `.env.example` files with a setup wizard-based workflow.

## Features

- 🧙 **Setup Wizard**: Interactive configuration for each project
- 🔍 **Smart Detection**: Scans your codebase for environment variable usage
- 📝 **Safe Updates**: Maintains `.env` without overriding existing values
- 🔧 **Configurable Patterns**: Support for `process.env.*`, `import.meta.env.*`, and custom patterns
- 👁️ **Real-time Watching**: Automatically updates when files change (optional)
- 📊 **Status Bar**: Shows count of discovered environment variables
- 🎯 **Manual Control**: Choose between automatic or manual file updates

## Installation

### From Source

1. Clone this repository
2. Run `npm install`
3. Run `npm run compile`
4. Press `F5` to open a new VS Code window with the extension loaded

### From VSIX Package

1. Install dependencies and compile: `npm install && npm run compile`
2. Package the extension: `npm install -g @vscode/vsce && vsce package`
3. Install via Command Palette: `Extensions: Install from VSIX`
4. Or via command line: `code --install-extension env-watcher-0.0.1.vsix`

## Getting Started

### First Time Setup (Required)

The extension **requires setup** before it can be used. By default, it is disabled and won't watch files or create any files automatically.

1. Open your workspace in VS Code
2. When the extension activates, you'll see a prompt: **"Setup required. Would you like to configure the extension for this workspace?"**
3. Click **"Run Setup"** to start the interactive setup wizard
4. Or manually run: **`Env Watcher: Run Setup Wizard`** from the Command Palette

### Setup Wizard Steps

The wizard will guide you through configuring:

1. **Files to Watch**: Specify glob patterns for files to monitor
   - Example: `**/*.ts, **/*.js, **/*.tsx`
   - Default: `**/*.ts, **/*.js, **/*.tsx, **/*.jsx`

2. **Regex Patterns**: Define how to match environment variables
   - Example: `process\.env\.(\w+), import\.meta\.env\.(\w+)`
   - Must use a capturing group `()` for the variable name
   - Default: `process\.env\.(\w+), import\.meta\.env\.(\w+)`

3. **Env File Name**: Set your `.env` file path
   - Example: `.env`, `config/.env`
   - Default: `.env`

4. **Example File Name**: Set your `.env.example` file path
   - Example: `.env.example`, `config/.env.example`
   - Default: `.env.example`

5. **Placeholder Value**: Optional placeholder for `.env.example`
   - Example: `your-value-here`, `changeme`, or leave empty
   - Default: (empty)

6. **Update Mode**: Choose how files are created/updated
   - **Manual** (Recommended): Only create/update when you explicitly run the update command
   - **Automatic**: Automatically create/update files when variables are detected

7. **Include File Paths**: Add comments showing where variables are used
   - **No**: Just show variable names
   - **Yes**: Add `# Used in: path/to/file.ts` comments above each variable

### Configuration Saved to Workspace

After setup, your workspace `.vscode/settings.json` will contain:

```json
{
  "envWatcher.enabled": true,
  "envWatcher.setupCompleted": true,
  "envWatcher.autoCreateFiles": false,
  "envWatcher.includeFilePaths": false,
  "envWatcher.filesToWatch": ["**/*.ts", "**/*.js"],
  "envWatcher.patterns": ["process\\.env\\.(\\w+)"],
  "envWatcher.envFile": ".env",
  "envWatcher.exampleFile": ".env.example",
  "envWatcher.examplePlaceholder": ""
}
```

## Usage

### Recommended Workflow (Manual Mode)

1. **Scan for Variables**
   - Command: `Env Watcher: Scan Workspace for Environment Variables`
   - Or click the status bar indicator
   - This scans your code but **doesn't create/modify files**

2. **Review Discovered Variables**
   - Check the status bar: `👁️ Env: X` shows count of discovered variables
   - Variables are detected but not yet written to files

3. **Update .env Files**
   - Command: `Env Watcher: Update .env Files`
   - This creates/updates `.env` and `.env.example` with discovered variables
   - Only run when you're ready to update

### Automatic Workflow

If you chose "Automatic" mode during setup:
- Files are automatically created/updated when variables are detected
- Changes happen in real-time as you code
- Can be toggled via `envWatcher.autoCreateFiles` setting

### Commands

All commands are available via Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

- **`Env Watcher: Run Setup Wizard`**: Configure or reconfigure the extension
- **`Env Watcher: Scan Workspace`**: Scan files for environment variables (no file changes)
- **`Env Watcher: Update .env Files`**: Manually update .env files with discovered variables
- **`Env Watcher: Enable`**: Enable the watcher (requires setup first)
- **`Env Watcher: Disable`**: Disable the watcher

### Status Bar

The status bar indicator shows:
- **`👁️ Env: X`**: Enabled, X variables discovered (click to scan)
- **`👁️ Env: X`** (dimmed): Disabled

## Configuration

### All Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `envWatcher.enabled` | boolean | `false` | Enable/disable the extension |
| `envWatcher.setupCompleted` | boolean | `false` | Whether setup wizard has been completed |
| `envWatcher.autoCreateFiles` | boolean | `false` | Automatically create/update files when variables are detected |
| `envWatcher.includeFilePaths` | boolean | `false` | Include comments showing where each variable is used |
| `envWatcher.filesToWatch` | array | `["**/*.ts", "**/*.js", ...]` | Glob patterns for files to watch |
| `envWatcher.patterns` | array | `["process\\.env\\.(\\w+)", ...]` | Regex patterns to match env variables (use capturing group) |
| `envWatcher.envFile` | string | `".env"` | Path to .env file |
| `envWatcher.exampleFile` | string | `".env.example"` | Path to .env.example file |
| `envWatcher.examplePlaceholder` | string | `""` | Default placeholder value for .env.example |
| `envWatcher.excludePatterns` | array | `["**/node_modules/**", ...]` | Patterns to exclude from watching |

### Manual Configuration

You can also configure manually in `.vscode/settings.json`:

```json
{
  "envWatcher.enabled": true,
  "envWatcher.setupCompleted": true,
  "envWatcher.autoCreateFiles": false,
  "envWatcher.includeFilePaths": false,
  "envWatcher.filesToWatch": [
    "**/*.ts",
    "**/*.js"
  ],
  "envWatcher.patterns": [
    "process\\.env\\.(\\w+)",
    "import\\.meta\\.env\\.(\\w+)"
  ],
  "envWatcher.envFile": ".env",
  "envWatcher.exampleFile": ".env.example",
  "envWatcher.examplePlaceholder": "",
  "envWatcher.excludePatterns": [
    "**/node_modules/**",
    "**/dist/**",
    "**/out/**",
    "**/.git/**",
    ".*/**",
    "_*/**"
  ]
}
```

## Examples

### Custom Pattern for Config Files

If you have a `config.ts` file with this pattern:

```typescript
const apiKey = CONFIG.API_KEY;
const dbUrl = CONFIG.DATABASE_URL;
```

Add this pattern during setup or in settings:

```json
{
  "envWatcher.patterns": [
    "process\\.env\\.(\\w+)",
    "CONFIG\\.(\\w+)"
  ]
}
```

### Watch Specific Files Only

```json
{
  "envWatcher.filesToWatch": [
    "src/config.ts",
    "src/**/*.service.ts"
  ]
}
```

### Custom Placeholder for .env.example

```json
{
  "envWatcher.examplePlaceholder": "your-value-here"
}
```

This generates:
```
# Environment Variables
# Auto-generated by Env Watcher extension

API_KEY=your-value-here
DATABASE_URL=your-value-here
```

## How It Works

1. **File Watching**: Monitors files matching `filesToWatch` patterns (excluding `excludePatterns`)
2. **Pattern Matching**: Extracts variable names using regex patterns
   - Uses the first capturing group `(\w+)` as the variable name
   - Example: `process\.env\.(\w+)` matches `process.env.API_KEY` → extracts `API_KEY`
3. **Smart Merging**:
   - **`.env`**: Only adds new variables, **never modifies existing values**
   - **`.env.example`**: Regenerates with all variables and placeholder values

## File Behavior

### .env File
- **New variables**: Added with empty value (`KEY=`)
- **Existing variables**: **Never modified** (preserves your actual values)
- **File paths** (optional): Shows where each variable is used
- **Example without file paths**:
  ```
  # Before
  API_KEY=secret123

  # After (DB_URL discovered in code)
  API_KEY=secret123
  DB_URL=
  ```

- **Example with file paths** (`includeFilePaths: true`):
  ```
  # Used in: src/config.ts
  API_KEY=secret123

  # Used in: src/database.ts, src/models/user.ts
  DB_URL=

  ```

### .env.example File
- **Always regenerated** with all discovered variables
- **Uses placeholder** from `envWatcher.examplePlaceholder`
- **Sorted alphabetically**
- **Includes header comment**
- **File paths** (optional): Shows where each variable is used
- **Example without file paths**:
  ```
  # Environment Variables
  # Auto-generated by Env Watcher extension

  API_KEY=
  DATABASE_URL=
  PORT=
  ```

- **Example with file paths** (`includeFilePaths: true`):
  ```
  # Environment Variables
  # Auto-generated by Env Watcher extension

  # Used in: src/config.ts
  API_KEY=

  # Used in: src/database.ts, src/models/user.ts
  DATABASE_URL=

  # Used in: src/server.ts
  PORT=

  ```

## Requirements

- VS Code 1.80.0 or higher
- Workspace folder (multi-root workspaces use the first folder)

## Important Notes

- **Setup is required**: Extension won't work until you run the setup wizard
- **Default is disabled**: Extension is disabled by default and won't create files automatically
- **Manual control**: By default, files are only created when you explicitly run the update command
- **Workspace-specific**: Configuration is per workspace, not global
- **No file creation without permission**: In manual mode, the extension only scans and displays counts

## Known Issues

- Only supports first capturing group in regex patterns (first group used as variable name)
- Requires workspace folder to activate
- Multi-root workspaces only use the first folder

## Re-running Setup

You can re-run the setup wizard at any time:
1. Run **`Env Watcher: Run Setup Wizard`** from Command Palette
2. This will reconfigure all settings for the current workspace

## Contributing

Issues and pull requests are welcome at [GitHub repository URL]!

## License

MIT
