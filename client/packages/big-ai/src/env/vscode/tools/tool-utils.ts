/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { randomUUID } from 'crypto';
import * as path from 'path';
import * as vscode from 'vscode';

export function createToolResult(message: string): vscode.LanguageModelToolResult {
    return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
}

export function generateId(): string {
    const uuid = randomUUID();
    return `a${uuid.substring(1)}`;
}

export function ref(nodeId: string, refType = 'Node'): { __type: 'Reference'; __refType: string; __value: string } {
    return { __type: 'Reference', __refType: refType, __value: nodeId };
}

export function toParserSafeMultiplicity(value: string): string | undefined {
    const trimmed = value.trim();
    if (trimmed === '*') {
        return trimmed;
    }
    if (/^[a-zA-Z_][\w-]*$/.test(trimmed)) {
        return trimmed;
    }
    switch (trimmed) {
        case '1':
            return 'one';
        case '0..1':
            return 'zeroToOne';
        case '0..*':
            return '*';
        case '1..*':
            return 'oneToMany';
        default:
            return undefined;
    }
}

export function resolveWorkspacePath(filePath: string, options: { requireUmlExtension?: boolean } = {}): vscode.Uri {
    const normalizedPath = validateRequiredString(filePath, 'filePath');
    if (normalizedPath.includes('\0')) {
        throw new Error('Path contains invalid characters.');
    }
    if (path.isAbsolute(normalizedPath) || /^[a-zA-Z]:[\\/]/.test(normalizedPath)) {
        throw new Error(`Path "${filePath}" must be workspace-relative.`);
    }
    if (options.requireUmlExtension && path.extname(normalizedPath).toLowerCase() !== '.uml') {
        throw new Error(`Path "${filePath}" must point to a .uml file.`);
    }

    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
        throw new Error('No workspace folder open.');
    }
    const root = folders[0].uri;
    const rootPath = path.resolve(root.fsPath);
    const resolvedPath = path.resolve(rootPath, normalizedPath);
    if (resolvedPath !== rootPath && !resolvedPath.startsWith(rootPath + path.sep)) {
        throw new Error(`Path "${filePath}" escapes the workspace root.`);
    }
    return vscode.Uri.file(resolvedPath);
}

/**
 * Normalizes a user-supplied name into a parser-safe identifier (grammar terminal LANGIUM_ID: /[\w_\*-]+/,
 * i.e. no spaces or punctuation). Multi-word input is joined into camelCase; already-safe names pass through
 * unchanged. Without this, a name like "date of birth" serializes as `"date of birth"`, which the UML grammar
 * cannot parse back (it reads "date" as the full string and then fails on the next word).
 */
export function toParserSafeName(value: string): string {
    const trimmed = value.trim();
    if (/^[\w*-]+$/.test(trimmed)) {
        return trimmed;
    }
    const words = trimmed.split(/[^\w]+/).filter(Boolean);
    if (words.length === 0) {
        throw new Error(`"${value}" does not contain any valid identifier characters.`);
    }
    return words.map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))).join('');
}

export function validateRequiredString(value: unknown, fieldName: string): string {
    if (typeof value !== 'string') {
        throw new Error(`${fieldName} must be a string.`);
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
        throw new Error(`${fieldName} must not be empty.`);
    }
    return trimmed;
}

export function validateUmlDiagramFile(value: unknown): void {
    if (!isRecord(value) || !isRecord(value.diagram)) {
        throw new Error('Invalid UML file: missing diagram object.');
    }
    if (value.diagram.diagramType !== 'CLASS') {
        throw new Error('Invalid UML file: only CLASS diagrams are supported.');
    }
    if (!Array.isArray(value.diagram.entities)) {
        throw new Error('Invalid UML file: diagram.entities must be an array.');
    }
    if (!Array.isArray(value.diagram.relations)) {
        throw new Error('Invalid UML file: diagram.relations must be an array.');
    }
    if (!Array.isArray(value.metaInfos)) {
        throw new Error('Invalid UML file: metaInfos must be an array.');
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
