/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import fs from 'node:fs';
import path from 'node:path';
import { format as oxfmt, type FormatConfig } from 'oxfmt';

const FORMATTABLE = /\.(c|m)?(j|t)sx?$/;

let config: FormatConfig | undefined;

/** Reads the nearest `.oxfmtrc.json`, starting from the working directory. */
function loadConfig(): FormatConfig {
    if (config) {
        return config;
    }
    for (let dir = process.cwd(); ; dir = path.dirname(dir)) {
        const file = path.join(dir, '.oxfmtrc.json');
        if (fs.existsSync(file)) {
            // Only the base options apply to generated TypeScript
            const {
                $schema: _schema,
                ignorePatterns: _ignore,
                overrides: _overrides,
                ...options
            } = JSON.parse(fs.readFileSync(file, 'utf8'));
            return (config = options);
        }
        if (path.dirname(dir) === dir) {
            return (config = {});
        }
    }
}

/** Formats generated source with oxfmt, using the repository configuration. Non-JS/TS files are returned as is. */
export async function format(filePath: string, content: string): Promise<string> {
    if (!FORMATTABLE.test(filePath)) {
        return content;
    }
    const result = await oxfmt(filePath, content, loadConfig());
    if (result.errors.length > 0) {
        console.warn(`Formatting ${filePath} failed. Writing raw output.`, result.errors[0]);
        return content;
    }
    return result.code;
}
