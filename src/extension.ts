import * as vscode from 'vscode';
import { EnvWatcher } from './watcher';
import { ConfigManager } from './config';
import { SetupWizard } from './setupWizard';

let watcher: EnvWatcher | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Environment Variable Watcher extension is now active');

    // Get workspace root
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showWarningMessage(
            'Env Watcher: No workspace folder found. Extension will not activate.'
        );
        return;
    }

    const workspaceRoot = workspaceFolders[0].uri.fsPath;

    // Initialize watcher
    watcher = new EnvWatcher(context, workspaceRoot);

    // Check if setup has been completed
    const setupCompleted = ConfigManager.isSetupCompleted();

    if (!setupCompleted) {
        // Show setup prompt on first activation
        vscode.window.showInformationMessage(
            'Env Watcher: Setup required. Would you like to configure the extension for this workspace?',
            'Run Setup',
            'Later'
        ).then(selection => {
            if (selection === 'Run Setup') {
                vscode.commands.executeCommand('envWatcher.setup');
            }
        });
    } else {
        // Start watcher if setup is completed
        watcher.start();
    }

    // Register setup command
    context.subscriptions.push(
        vscode.commands.registerCommand('envWatcher.setup', async () => {
            const wizard = new SetupWizard();
            const config = await wizard.run();

            if (config) {
                await wizard.saveConfig(config);
                vscode.window.showInformationMessage(
                    'Env Watcher: Setup completed! Extension is now enabled.'
                );

                // Restart watcher with new configuration
                if (watcher) {
                    watcher.stop();
                    watcher.updateConfig();
                    await watcher.start();
                }
            }
        })
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('envWatcher.scanWorkspace', async () => {
            if (!ConfigManager.isSetupCompleted()) {
                vscode.window.showWarningMessage(
                    'Env Watcher: Please run setup first.',
                    'Run Setup'
                ).then(selection => {
                    if (selection === 'Run Setup') {
                        vscode.commands.executeCommand('envWatcher.setup');
                    }
                });
                return;
            }

            if (watcher) {
                vscode.window.showInformationMessage('Env Watcher: Scanning workspace...');
                await watcher.scanWorkspace(true); // Skip auto-update

                const vars = watcher.getDiscoveredVariables();
                if (vars.size > 0) {
                    vscode.window.showInformationMessage(
                        `Env Watcher: Found ${vars.size} environment variable(s)`
                    );
                } else {
                    vscode.window.showInformationMessage(
                        'Env Watcher: No environment variables found'
                    );
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('envWatcher.updateEnvFiles', async () => {
            if (!ConfigManager.isSetupCompleted()) {
                vscode.window.showWarningMessage(
                    'Env Watcher: Please run setup first.',
                    'Run Setup'
                ).then(selection => {
                    if (selection === 'Run Setup') {
                        vscode.commands.executeCommand('envWatcher.setup');
                    }
                });
                return;
            }

            if (watcher) {
                await watcher.updateEnvFiles();
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('envWatcher.enable', async () => {
            if (!ConfigManager.isSetupCompleted()) {
                vscode.window.showWarningMessage(
                    'Env Watcher: Please run setup first.',
                    'Run Setup'
                ).then(selection => {
                    if (selection === 'Run Setup') {
                        vscode.commands.executeCommand('envWatcher.setup');
                    }
                });
                return;
            }

            await ConfigManager.setEnabled(true);
            if (watcher) {
                await watcher.start();
            }
            vscode.window.showInformationMessage('Env Watcher: Enabled');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('envWatcher.disable', async () => {
            await ConfigManager.setEnabled(false);
            if (watcher) {
                watcher.stop();
            }
            vscode.window.showInformationMessage('Env Watcher: Disabled');
        })
    );

    // Listen for configuration changes
    context.subscriptions.push(
        ConfigManager.onConfigChange(() => {
            if (watcher) {
                watcher.updateConfig();
            }
        })
    );
}

export function deactivate() {
    if (watcher) {
        watcher.stop();
    }
    console.log('Environment Variable Watcher extension is now deactivated');
}
