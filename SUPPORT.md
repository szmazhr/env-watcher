# Support

Thank you for using the Environment Variable Watcher extension! This document provides information on how to get help and support.

## 📖 Documentation

Before seeking support, please check the following resources:

- **[README.md](README.md)** - Comprehensive documentation with examples and configuration guide
- **[CHANGELOG.md](CHANGELOG.md)** - History of changes and new features
- **[GitHub Repository](https://github.com/szmazhr/env-watcher)** - Source code and latest updates

## 🐛 Reporting Issues

If you encounter a bug or unexpected behavior:

### Before Reporting
1. **Check existing issues**: Search [GitHub Issues](https://github.com/szmazhr/env-watcher/issues) to see if your problem has already been reported
2. **Update to the latest version**: Make sure you're using the most recent release
3. **Review documentation**: Ensure the issue isn't addressed in the README or CHANGELOG

### How to Report
Create a new issue on [GitHub Issues](https://github.com/szmazhr/env-watcher/issues/new) with:

**Title**: Clear, concise description of the problem

**Include**:
- Extension version (check in VS Code Extensions panel)
- VS Code version (Help → About)
- Operating System (Windows/macOS/Linux)
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots or error messages (if applicable)
- Relevant configuration from `.vscode/settings.json`

**Example**:
```markdown
## Description
Extension fails to detect variables in TypeScript files

## Environment
- Extension Version: 0.1.0
- VS Code Version: 1.85.0
- OS: Ubuntu 22.04

## Steps to Reproduce
1. Run setup wizard
2. Configure pattern: `process\.env\.(\w+)`
3. Create file with `const key = process.env.API_KEY`
4. Run scan workspace

## Expected
Should detect API_KEY variable

## Actual
No variables detected

## Configuration
```json
{
  "envWatcher.filesToWatch": ["**/*.ts"],
  "envWatcher.patterns": ["process\\.env\\.(\\w+)"]
}
```
```

## 💡 Feature Requests

Have an idea for a new feature or improvement?

1. Check [GitHub Issues](https://github.com/szmazhr/env-watcher/issues) for similar requests
2. Create a new feature request with:
   - Clear description of the feature
   - Use case or problem it solves
   - Expected behavior
   - Examples (if applicable)

## ❓ Questions

For general questions about using the extension:

1. **Check the [README.md](README.md)** - Most questions are answered there
2. **Search [GitHub Issues](https://github.com/szmazhr/env-watcher/issues)** - Someone may have asked the same question
3. **Create a discussion** on [GitHub Discussions](https://github.com/szmazhr/env-watcher/discussions) (if available)
4. **Open an issue** labeled as `question` on [GitHub Issues](https://github.com/szmazhr/env-watcher/issues/new)

## 🤝 Contributing

Interested in contributing to the project?

- **Bug Fixes**: Submit a pull request with a clear description of the fix
- **Features**: Open an issue first to discuss the feature before implementing
- **Documentation**: Improvements to README, CHANGELOG, or code comments are always welcome

See [CONTRIBUTING.md](CONTRIBUTING.md) (if available) or check the repository for contribution guidelines.

## 📧 Contact

- **GitHub**: [@szmazhr](https://github.com/szmazhr)
- **Website**: [shahzar.in](https://shahzar.in)
- **Repository**: [github.com/szmazhr/env-watcher](https://github.com/szmazhr/env-watcher)

## ⚡ Quick Help

### Extension not working?
1. Check if setup wizard was completed: Run "Env Watcher: Run Setup Wizard"
2. Verify extension is enabled: Check status bar for 👁️ icon
3. Check configuration: Open `.vscode/settings.json` and verify `envWatcher.*` settings
4. Review exclude patterns: Make sure your files aren't being excluded

### Variables not detected?
1. Verify file patterns match your files
2. Check regex patterns are correct (use capturing group)
3. Ensure files aren't in excluded directories
4. Try running "Env Watcher: Scan Workspace" manually

### Files not being created?
1. Check `envWatcher.autoCreateFiles` setting
2. If manual mode, run "Env Watcher: Update .env Files" command
3. Verify workspace has write permissions
4. Check for errors in VS Code's Output panel

## 🙏 Acknowledgments

This extension was built with assistance from [Claude Code](https://claude.com/claude-code).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Last Updated**: October 2025
