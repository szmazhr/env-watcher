import * as vscode from 'vscode';
import * as path from 'path';

export interface EnvVariableLocation {
    variable: string;
    files: string[];
}

export class EnvVariableParser {
    private patterns: RegExp[];
    private workspaceRoot: string;

    constructor(patternStrings: string[], workspaceRoot: string = '') {
        this.patterns = patternStrings.map(p => new RegExp(p, 'g'));
        this.workspaceRoot = workspaceRoot;
    }

    /**
     * Extract environment variable names from file content
     * @param content File content to parse
     * @returns Set of unique environment variable names
     */
    extractEnvVariables(content: string): Set<string> {
        const envVars = new Set<string>();

        for (const pattern of this.patterns) {
            // Reset the regex state
            pattern.lastIndex = 0;

            let match;
            while ((match = pattern.exec(content)) !== null) {
                // The first capturing group should contain the variable name
                if (match[1]) {
                    envVars.add(match[1]);
                }
            }
        }

        return envVars;
    }

    /**
     * Parse a single file and extract environment variables
     * @param uri File URI to parse
     * @returns Set of unique environment variable names
     */
    async parseFile(uri: vscode.Uri): Promise<Set<string>> {
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            return this.extractEnvVariables(document.getText());
        } catch (error) {
            console.error(`Error parsing file ${uri.fsPath}:`, error);
            return new Set();
        }
    }

    /**
     * Parse multiple files and aggregate all environment variables
     * @param uris Array of file URIs to parse
     * @returns Set of all unique environment variable names
     */
    async parseFiles(uris: vscode.Uri[]): Promise<Set<string>> {
        const allEnvVars = new Set<string>();

        await Promise.all(
            uris.map(async uri => {
                const envVars = await this.parseFile(uri);
                envVars.forEach(v => allEnvVars.add(v));
            })
        );

        return allEnvVars;
    }

    /**
     * Parse multiple files and track which files use which variables
     * @param uris Array of file URIs to parse
     * @returns Map of variable names to file paths
     */
    async parseFilesWithLocations(uris: vscode.Uri[]): Promise<Map<string, string[]>> {
        const varLocations = new Map<string, string[]>();

        await Promise.all(
            uris.map(async uri => {
                const envVars = await this.parseFile(uri);
                const relativePath = this.workspaceRoot
                    ? path.relative(this.workspaceRoot, uri.fsPath)
                    : uri.fsPath;

                envVars.forEach(varName => {
                    if (!varLocations.has(varName)) {
                        varLocations.set(varName, []);
                    }
                    const files = varLocations.get(varName)!;
                    if (!files.includes(relativePath)) {
                        files.push(relativePath);
                    }
                });
            })
        );

        return varLocations;
    }

    /**
     * Update the regex patterns
     * @param patternStrings New pattern strings
     */
    updatePatterns(patternStrings: string[]): void {
        this.patterns = patternStrings.map(p => new RegExp(p, 'g'));
    }
}
