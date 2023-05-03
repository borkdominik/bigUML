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
import * as childProcess from 'child_process';

export namespace java {
    export function installedVersion(): Promise<string | undefined> {
        return new Promise<string>((resolve, reject) => {
            const spawn = childProcess.spawn('java', ['-version'], { timeout: 5 * 1000 });
            let allData = '';
            spawn.on('error', err => reject(err));

            spawn.stderr.on('data', data => {
                allData += data;
            });

            spawn.on('close', () => {
                const javaVersion = allData.match('"(\\d+\\.\\d+).*"');
                if (javaVersion) {
                    resolve(javaVersion[0].replace('"', ''));
                } else {
                    reject(undefined);
                }
            });
        });
    }

    export async function installedMajorVersion(): Promise<string | undefined> {
        const version = await installedVersion();

        return version?.split('.')[0];
    }
}
