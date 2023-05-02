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

import { join } from 'path';
import { copyBackendFile, log } from './copy-utils';

// Idea taken from https://github.com/eclipse-emfcloud/coffee-editor/blob/master/client/coffee-servers/scripts/copy-servers.ts

const BACKEND_VERSION = '0.1.0-SNAPSHOT';
const targetDirs = [join(__dirname, '..', 'packages', 'uml-vscode-integration', 'extension', 'server')];

// Backend Java CLI
const cliPath = join(__dirname, '..', '..', 'server', 'com.eclipsesource.uml.cli');
const cliExecutable = `com.eclipsesource.uml.cli-${BACKEND_VERSION}-standalone.jar`;
const cliJarPath = join(cliPath, 'target', cliExecutable);

log('### Start copying CLI JAR.. ###');
targetDirs.forEach(targetDir => {
    copyBackendFile(cliJarPath, `${targetDir}`, cliExecutable);
});

console.log();

// Model Server

const modelServerPath = join(__dirname, '..', '..', 'server', 'com.eclipsesource.uml.modelserver');
const modelServerLogConfigPath = join(modelServerPath, 'log4j2-embedded.xml');

log('### Start copying Model Server log4j2 config.. ###');
targetDirs.forEach(targetDir => {
    copyBackendFile(modelServerLogConfigPath, `${targetDir}`, 'log4j2-embedded.xml');
});
