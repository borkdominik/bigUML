/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
// Taken from https://github.com/eclipse-emfcloud/coffee-editor/blob/master/client/coffee-servers/scripts/copy-utils.ts

import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { exit } from 'process';

export function log(logMsg: string): void {
    const now = new Date(Date.now());
    console.log(now.toISOString() + ' | ' + logMsg);
}

export function logError(logMsg: string): void {
    const now = new Date(Date.now());
    console.error(now.toISOString() + ' | ' + logMsg);
}

function prepareTargetDir(targetPath: string): void {
    // Check if target directory exists, create otherwise
    if (existsSync(targetPath)) {
        log('Target directory exists!');
    } else {
        try {
            log('Creating target directory...');
            mkdirSync(targetPath, { recursive: true });
            log(`Target directory '${targetPath}' was created successfully!`);
        } catch (err) {
            if (err instanceof Error) {
                logError(err.message);
            }
        }
    }
}

function checkSourcePath(sourcePath: string): void {
    if (!existsSync(sourcePath)) {
        logError(`Error: Source path '${sourcePath}' does not exist!`);
        exit(1);
    }
    log('Source directory exists!');
}

export function copyBackendFile(sourcePath: string, targetPath: string, targetName: string): void {
    // Check source file
    checkSourcePath(sourcePath);
    // Check and prepare target directory
    prepareTargetDir(targetPath);
    // Start copying
    const destinationPath = join(targetPath, targetName);
    copyFileSync(sourcePath, destinationPath);
    log(`\n\tCopying\n\t - from ${sourcePath}\n\t - to ${destinationPath}\n\twas successful!`);
}
