/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

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

export function copyBackendFile(sourcePath: string, targetPath: string, jarName: string): void {
    // Check source file
    checkSourcePath(sourcePath);
    // Check and prepare target directory
    prepareTargetDir(targetPath);
    // Start copying
    copyFileSync(sourcePath, join(targetPath, jarName));
    log(`Copy to '${targetPath} was successful!`);
}
