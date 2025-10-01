import * as vscode from 'vscode';

export interface EnvWatcherConfig {
    enabled: boolean;
    setupCompleted: boolean;
    autoCreateFiles: boolean;
    filesToWatch: string[];
    patterns: string[];
    envFile: string;
    exampleFile: string;
    examplePlaceholder: string;
    includeFilePaths: boolean;
    excludePatterns: string[];
}

export class ConfigManager {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly SECTION = 'envWatcher';

    static getConfig(): EnvWatcherConfig {
        const config = vscode.workspace.getConfiguration(this.SECTION);

        return {
            enabled: config.get<boolean>('enabled', false),
            setupCompleted: config.get<boolean>('setupCompleted', false),
            autoCreateFiles: config.get<boolean>('autoCreateFiles', false),
            filesToWatch: config.get<string[]>('filesToWatch', [
                '**/*.ts',
                '**/*.js',
                '**/*.tsx',
                '**/*.jsx'
            ]),
            patterns: config.get<string[]>('patterns', [
                'process\\.env\\.(\\w+)',
                'import\\.meta\\.env\\.(\\w+)'
            ]),
            envFile: config.get<string>('envFile', '.env'),
            exampleFile: config.get<string>('exampleFile', '.env.example'),
            examplePlaceholder: config.get<string>('examplePlaceholder', ''),
            includeFilePaths: config.get<boolean>('includeFilePaths', false),
            excludePatterns: config.get<string[]>('excludePatterns', [
                '**/node_modules/**',
                '**/dist/**',
                '**/out/**',
                '**/.git/**',
                '**/.*/**',
                '.*/**',
                '_*/**'
            ])
        };
    }

    static onConfigChange(callback: () => void): vscode.Disposable {
        return vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration(this.SECTION)) {
                callback();
            }
        });
    }

    static async setEnabled(enabled: boolean): Promise<void> {
        const config = vscode.workspace.getConfiguration(this.SECTION);
        await config.update('enabled', enabled, vscode.ConfigurationTarget.Workspace);
    }

    static isSetupCompleted(): boolean {
        const config = vscode.workspace.getConfiguration(this.SECTION);
        return config.get<boolean>('setupCompleted', false);
    }
}
