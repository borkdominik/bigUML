/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { join } from 'path';
import { copyBackendFile, log } from './copy-utils';

// Idea taken from https://github.com/eclipse-emfcloud/coffee-editor/blob/master/client/coffee-servers/scripts/copy-servers.ts

const BACKEND_VERSION = '0.1.0-SNAPSHOT';
const targetDirs = [join(__dirname, '..', 'packages', 'uml-vscode-integration', 'extension', 'server')];

// Backend Java CLI
const path = join(__dirname, '..', '..', 'server', 'com.borkdominik.big.glsp.uml');
const executable = `com.borkdominik.big.glsp.uml-${BACKEND_VERSION}-glsp.jar`;
const jarPath = join(path, 'target', executable);

log('### Start copying server JAR.. ###');
targetDirs.forEach(targetDir => {
    copyBackendFile(jarPath, `${targetDir}`, executable);
});

console.log();
