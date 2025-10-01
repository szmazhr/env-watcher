import * as vscode from 'vscode';

export interface SetupConfig {
    filesToWatch: string[];
    patterns: string[];
    envFile: string;
    exampleFile: string;
    examplePlaceholder: string;
    autoCreateFiles: boolean;
    includeFilePaths: boolean;
}

export class SetupWizard {
    async run(): Promise<SetupConfig | undefined> {
        // Step 1: Welcome
        const proceed = await vscode.window.showInformationMessage(
            'Welcome to Env Watcher Setup! This wizard will help you configure the extension for this workspace.',
            'Continue',
            'Cancel'
        );

        if (proceed !== 'Continue') {
            return undefined;
        }

        // Step 2: Files to watch
        const filesToWatchInput = await vscode.window.showInputBox({
            prompt: 'Enter file patterns to watch (comma-separated)',
            placeHolder: '**/*.ts, **/*.js, **/*.tsx, **/*.jsx',
            value: '**/*.ts, **/*.js, **/*.tsx, **/*.jsx',
            validateInput: (value) => {
                return value.trim() ? null : 'Please enter at least one file pattern';
            }
        });

        if (!filesToWatchInput) {
            return undefined;
        }

        const filesToWatch = filesToWatchInput
            .split(',')
            .map(p => p.trim())
            .filter(p => p);

        // Step 3: Patterns to match
        const patternsInput = await vscode.window.showInputBox({
            prompt: 'Enter regex patterns to match environment variables (comma-separated)',
            placeHolder: 'process\\.env\\.(\\w+), import\\.meta\\.env\\.(\\w+)',
            value: 'process\\.env\\.(\\w+), import\\.meta\\.env\\.(\\w+)',
            validateInput: (value) => {
                if (!value.trim()) {
                    return 'Please enter at least one pattern';
                }
                // Validate regex patterns
                const patterns = value.split(',').map(p => p.trim());
                for (const pattern of patterns) {
                    try {
                        new RegExp(pattern);
                    } catch (e) {
                        return `Invalid regex pattern: ${pattern}`;
                    }
                }
                return null;
            }
        });

        if (!patternsInput) {
            return undefined;
        }

        const patterns = patternsInput
            .split(',')
            .map(p => p.trim())
            .filter(p => p);

        // Step 4: .env file name
        const envFile = await vscode.window.showInputBox({
            prompt: 'Enter the name/path for your .env file',
            placeHolder: '.env',
            value: '.env',
            validateInput: (value) => {
                return value.trim() ? null : 'Please enter a file name';
            }
        });

        if (!envFile) {
            return undefined;
        }

        // Step 5: .env.example file name
        const exampleFile = await vscode.window.showInputBox({
            prompt: 'Enter the name/path for your .env.example file',
            placeHolder: '.env.example',
            value: '.env.example',
            validateInput: (value) => {
                return value.trim() ? null : 'Please enter a file name';
            }
        });

        if (!exampleFile) {
            return undefined;
        }

        // Step 6: Placeholder for .env.example
        const examplePlaceholder = await vscode.window.showInputBox({
            prompt: 'Enter a placeholder value for .env.example (leave empty for no value)',
            placeHolder: 'your-value-here',
            value: ''
        });

        if (examplePlaceholder === undefined) {
            return undefined;
        }

        // Step 7: Auto-create files option
        const autoCreate = await vscode.window.showQuickPick(
            [
                {
                    label: 'Manual',
                    description: 'Only create/update files when explicitly requested',
                    value: false
                },
                {
                    label: 'Automatic',
                    description: 'Automatically create/update .env files when variables are detected',
                    value: true
                }
            ],
            {
                placeHolder: 'How should .env files be created/updated?'
            }
        );

        if (!autoCreate) {
            return undefined;
        }

        // Step 8: Include file paths option
        const includeFilePaths = await vscode.window.showQuickPick(
            [
                {
                    label: 'No',
                    description: 'Just show variable names',
                    value: false
                },
                {
                    label: 'Yes',
                    description: 'Add comments showing where each variable is used',
                    value: true
                }
            ],
            {
                placeHolder: 'Include file path comments in .env files?'
            }
        );

        if (!includeFilePaths) {
            return undefined;
        }

        // Summary and confirmation
        const summary = `
Configuration Summary:
- Files to watch: ${filesToWatch.join(', ')}
- Patterns: ${patterns.join(', ')}
- .env file: ${envFile}
- .env.example file: ${exampleFile}
- Placeholder: ${examplePlaceholder || '(empty)'}
- Auto-create files: ${autoCreate.value ? 'Yes' : 'No'}
- Include file paths: ${includeFilePaths.value ? 'Yes' : 'No'}
        `.trim();

        const confirm = await vscode.window.showInformationMessage(
            summary,
            { modal: true },
            'Save Configuration',
            'Cancel'
        );

        if (confirm !== 'Save Configuration') {
            return undefined;
        }

        return {
            filesToWatch,
            patterns,
            envFile,
            exampleFile,
            examplePlaceholder,
            autoCreateFiles: autoCreate.value,
            includeFilePaths: includeFilePaths.value
        };
    }

    async saveConfig(config: SetupConfig): Promise<void> {
        const workspaceConfig = vscode.workspace.getConfiguration('envWatcher');

        await Promise.all([
            workspaceConfig.update('filesToWatch', config.filesToWatch, vscode.ConfigurationTarget.Workspace),
            workspaceConfig.update('patterns', config.patterns, vscode.ConfigurationTarget.Workspace),
            workspaceConfig.update('envFile', config.envFile, vscode.ConfigurationTarget.Workspace),
            workspaceConfig.update('exampleFile', config.exampleFile, vscode.ConfigurationTarget.Workspace),
            workspaceConfig.update('examplePlaceholder', config.examplePlaceholder, vscode.ConfigurationTarget.Workspace),
            workspaceConfig.update('autoCreateFiles', config.autoCreateFiles, vscode.ConfigurationTarget.Workspace),
            workspaceConfig.update('includeFilePaths', config.includeFilePaths, vscode.ConfigurationTarget.Workspace),
            workspaceConfig.update('setupCompleted', true, vscode.ConfigurationTarget.Workspace),
            workspaceConfig.update('enabled', true, vscode.ConfigurationTarget.Workspace)
        ]);
    }
}
