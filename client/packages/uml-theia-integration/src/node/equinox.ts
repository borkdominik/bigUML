/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import * as glob from 'glob';
import * as path from 'path';

export function findEquinoxLauncher(productPath: string): string {
    const jarPaths = glob.sync('**/plugins/org.eclipse.equinox.launcher_*.jar', { cwd: productPath });
    if (jarPaths.length === 0) {
        throw new Error('The eclipse.equinox.launcher is not found. ');
    }
    const jarPath = path.resolve(productPath, jarPaths[0]);
    return jarPath;
}
