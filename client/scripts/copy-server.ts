/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { copyBackendFile, log } from './copy-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Idea taken from https://github.com/eclipse-emfcloud/coffee-editor/blob/master/client/coffee-servers/scripts/copy-servers.ts

const BACKEND_VERSION = '0.1.0';
const targetDirs = [join(__dirname, '..', 'application', 'vscode', 'server')];

// Backend Java CLI
const path = join(__dirname, '..', '..', 'server', 'app', 'build', 'libs');
const executable = `bigUML-${BACKEND_VERSION}-all.jar`;
const jarPath = join(path, executable);

log('### Start copying server JAR.. ###');
targetDirs.forEach(targetDir => {
    copyBackendFile(jarPath, `${targetDir}`, executable);
});

console.log();
