import * as vscode from 'vscode';
import { EnvVariableParser } from './parser';
import { EnvFileManager } from './envManager';
import { ConfigManager, EnvWatcherConfig } from './config';

export class EnvWatcher {
    private fileWatcher: vscode.FileSystemWatcher | undefined;
    private parser: EnvVariableParser;
    private envManager: EnvFileManager;
    private config: EnvWatcherConfig;
    private statusBarItem: vscode.StatusBarItem;
    private discoveredVars: Set<string> = new Set();
    private debounceTimer: NodeJS.Timeout | undefined;

    constructor(
        private context: vscode.ExtensionContext,
        private workspaceRoot: string
    ) {
        this.config = ConfigManager.getConfig();
        this.parser = new EnvVariableParser(this.config.patterns, this.workspaceRoot);
        this.envManager = new EnvFileManager(this.workspaceRoot);

        // Create status bar item
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.command = 'envWatcher.scanWorkspace';
        this.updateStatusBar();
        this.statusBarItem.show();

        context.subscriptions.push(this.statusBarItem);
    }

    /**
     * Start watching files
     */
    async start(): Promise<void> {
        if (!this.config.enabled) {
            return;
        }

        // Create file watcher
        const patterns = this.config.filesToWatch.join(',');
        const pattern = patterns.includes(',')
            ? `{${patterns}}`
            : patterns;

        this.fileWatcher = vscode.workspace.createFileSystemWatcher(
            new vscode.RelativePattern(this.workspaceRoot, pattern)
        );

        // Watch for file changes
        this.fileWatcher.onDidChange(uri => this.onFileChange(uri));
        this.fileWatcher.onDidCreate(uri => this.onFileChange(uri));
        this.fileWatcher.onDidDelete(uri => this.onFileDelete(uri));

        this.context.subscriptions.push(this.fileWatcher);

        // Initial scan
        await this.scanWorkspace();
    }

    /**
     * Stop watching files
     */
    stop(): void {
        this.fileWatcher?.dispose();
        this.fileWatcher = undefined;
    }

    /**
     * Handle file change event
     */
    private onFileChange(uri: vscode.Uri): void {
        // Check if file should be excluded
        if (this.shouldExclude(uri.fsPath)) {
            return;
        }

        // Debounce to avoid multiple scans in quick succession
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            this.scanWorkspace();
        }, 500);
    }

    /**
     * Handle file delete event
     */
    private onFileDelete(_uri: vscode.Uri): void {
        // Re-scan workspace when files are deleted
        this.scanWorkspace();
    }

    /**
     * Check if file path should be excluded
     */
    private shouldExclude(filePath: string): boolean {
        return this.config.excludePatterns.some(pattern => {
            const regex = new RegExp(
                pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*')
            );
            return regex.test(filePath);
        });
    }

    /**
     * Scan entire workspace for environment variables
     */
    async scanWorkspace(skipUpdate: boolean = false): Promise<void> {
        if (!this.config.enabled) {
            return;
        }

        try {
            // Find all files matching patterns
            const files: vscode.Uri[] = [];

            for (const pattern of this.config.filesToWatch) {
                const foundFiles = await vscode.workspace.findFiles(
                    pattern,
                    `{${this.config.excludePatterns.join(',')}}`
                );
                files.push(...foundFiles);
            }

            // Parse all files
            this.discoveredVars = await this.parser.parseFiles(files);

            // Only update files if autoCreateFiles is enabled or skipUpdate is false
            if (!skipUpdate && this.config.autoCreateFiles && this.discoveredVars.size > 0) {
                // Get file locations if needed
                const varLocations = this.config.includeFilePaths
                    ? await this.parser.parseFilesWithLocations(files)
                    : undefined;

                const result = await this.envManager.updateBothFiles(
                    this.config.envFile,
                    this.config.exampleFile,
                    this.discoveredVars,
                    this.config.examplePlaceholder,
                    varLocations
                );

                if (result.envAdded > 0) {
                    vscode.window.showInformationMessage(
                        `Env Watcher: Added ${result.envAdded} new variable(s) to ${this.config.envFile}`
                    );
                }
            }

            this.updateStatusBar();
        } catch (error) {
            console.error('Error scanning workspace:', error);
            vscode.window.showErrorMessage(
                `Env Watcher: Error scanning workspace - ${error}`
            );
        }
    }

    /**
     * Manually update .env files with discovered variables
     */
    async updateEnvFiles(): Promise<void> {
        if (this.discoveredVars.size === 0) {
            vscode.window.showInformationMessage(
                'Env Watcher: No environment variables discovered. Run a scan first.'
            );
            return;
        }

        try {
            // Get file locations if needed
            let varLocations: Map<string, string[]> | undefined;
            if (this.config.includeFilePaths) {
                const files: vscode.Uri[] = [];
                for (const pattern of this.config.filesToWatch) {
                    const foundFiles = await vscode.workspace.findFiles(
                        pattern,
                        `{${this.config.excludePatterns.join(',')}}`
                    );
                    files.push(...foundFiles);
                }
                varLocations = await this.parser.parseFilesWithLocations(files);
            }

            const result = await this.envManager.updateBothFiles(
                this.config.envFile,
                this.config.exampleFile,
                this.discoveredVars,
                this.config.examplePlaceholder,
                varLocations
            );

            vscode.window.showInformationMessage(
                `Env Watcher: Updated .env files\n` +
                `- Added ${result.envAdded} new variable(s) to ${this.config.envFile}\n` +
                `- Updated ${this.config.exampleFile} with ${result.exampleTotal} variable(s)`
            );
        } catch (error) {
            console.error('Error updating env files:', error);
            vscode.window.showErrorMessage(
                `Env Watcher: Error updating .env files - ${error}`
            );
        }
    }

    /**
     * Update status bar item
     */
    private updateStatusBar(): void {
        const count = this.discoveredVars.size;
        const icon = this.config.enabled ? '$(eye)' : '$(eye-closed)';
        this.statusBarItem.text = `${icon} Env: ${count}`;
        this.statusBarItem.tooltip = this.config.enabled
            ? `${count} environment variable(s) detected. Click to rescan.`
            : 'Env Watcher is disabled';
    }

    /**
     * Update configuration
     */
    updateConfig(): void {
        const wasEnabled = this.config.enabled;
        this.config = ConfigManager.getConfig();

        // Update parser patterns
        this.parser.updatePatterns(this.config.patterns);

        // Restart watcher if enabled state changed
        if (wasEnabled !== this.config.enabled) {
            if (this.config.enabled) {
                this.start();
            } else {
                this.stop();
            }
        }

        this.updateStatusBar();
    }

    /**
     * Get discovered variables
     */
    getDiscoveredVariables(): Set<string> {
        return new Set(this.discoveredVars);
    }
}
