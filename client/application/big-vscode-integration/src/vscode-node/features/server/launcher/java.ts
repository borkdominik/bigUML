/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import * as childProcess from 'child_process';

export namespace java {
    export function installedVersion(): Promise<string | undefined> {
        return new Promise<string | undefined>((resolve, _reject) => {
            const spawn = childProcess.spawn('java', ['-version'], { timeout: 5 * 1000 });
            let allData = '';
            spawn.on('error', err => {
                console.error(err);
                resolve(undefined);
            });

            spawn.stderr.on('data', data => {
                allData += data;
            });

            spawn.on('close', () => {
                const javaVersion = allData.match('"(\\d+\\.\\d+).*"');
                if (javaVersion) {
                    resolve(javaVersion[0].replace('"', ''));
                } else {
                    resolve(undefined);
                }
            });
        });
    }

    export async function installedMajorVersion(): Promise<string | undefined> {
        const version = await installedVersion();

        return version?.split('.')[0];
    }
}
