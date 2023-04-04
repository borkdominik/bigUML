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

// Model Server
const modelServerPath = join(__dirname, '..', '..', 'server', 'com.eclipsesource.uml.modelserver');
const modelServerLogConfigPath = join(modelServerPath, 'log4j2-embedded.xml');
const modelServerExecutable = `com.eclipsesource.uml.modelserver-${BACKEND_VERSION}-standalone.jar`;
const modelServerJarPath = join(modelServerPath, 'target', modelServerExecutable);

// GLSP Server
const glspServerPath = join(__dirname, '..', '..', 'server', 'com.eclipsesource.uml.glsp');
const glspServerExecutable = `com.eclipsesource.uml.glsp-${BACKEND_VERSION}-glsp.jar`;
const glspServerJarPath = join(glspServerPath, 'target', glspServerExecutable);

log('### Start copying Model Server JAR.. ###');
targetDirs.forEach(targetDir => {
    copyBackendFile(modelServerJarPath, `${targetDir}/modelserver`, modelServerExecutable);
});

console.log();

log('### Start copying Model Server log4j2 config.. ###');
targetDirs.forEach(targetDir => {
    copyBackendFile(modelServerLogConfigPath, `${targetDir}/modelserver`, 'model-server-log4j2-embedded.xml');
});

console.log();

log('### Start copying GLSP Server JAR.. ###');
targetDirs.forEach(targetDir => {
    copyBackendFile(glspServerJarPath, `${targetDir}/glsp`, glspServerExecutable);
});
