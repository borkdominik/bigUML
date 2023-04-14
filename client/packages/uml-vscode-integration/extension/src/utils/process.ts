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

// Modified version of the tree-kill package: https://github.com/pkrumins/node-tree-kill

import * as childProcess from 'child_process';

export async function kill(pid: number, signal: string): Promise<void> {
    const tree: any = {};
    const pidsToProcess: any = {};
    tree[pid] = [];
    pidsToProcess[pid] = 1;

    let resolve: ((value: void) => void) | undefined = undefined;

    const promise = new Promise<void>(res => {
        resolve = res;
    });

    switch (process.platform) {
        case 'win32':
            childProcess.execSync(`taskkill /F /T /PID ${pid}`);
            break;
        case 'darwin':
            buildProcessTree(
                pid,
                tree,
                pidsToProcess,
                (parentPid: any) => childProcess.spawn('pgrep', ['-P', parentPid]),
                () => {
                    killAll(tree, signal);
                    resolve?.();
                }
            );
            break;
        // case 'sunos':
        //     buildProcessTreeSunOS(pid, tree, pidsToProcess, function () {
        //         killAll(tree, signal, callback);
        //     });
        //     break;
        default: // Linux
            buildProcessTree(
                pid,
                tree,
                pidsToProcess,
                (parentPid: string) => childProcess.spawn('ps', ['-o', 'pid', '--no-headers', '--ppid', parentPid]),
                () => {
                    killAll(tree, signal);
                    resolve?.();
                }
            );
            break;
    }

    return promise;
}

function killAll(tree: any, signal: any): void {
    const killed: any = {};
    // eslint-disable-next-line no-useless-catch
    try {
        Object.keys(tree).forEach(pid => {
            tree[pid].forEach((pidpid: any) => {
                if (!killed[pidpid]) {
                    killPid(pidpid, signal);
                    killed[pidpid] = 1;
                }
            });
            if (!killed[pid]) {
                killPid(pid, signal);
                killed[pid] = 1;
            }
        });
    } catch (err) {
        throw err;
    }
}

function killPid(pid: any, signal: any): void {
    try {
        process.kill(parseInt(pid, 10), signal);
    } catch (err: any) {
        if (err.code !== 'ESRCH') {
            throw err;
        }
    }
}

function buildProcessTree(parentPid: any, tree: any, pidsToProcess: any, spawnChildProcessesList: any, cb: any): void {
    const ps = spawnChildProcessesList(parentPid);
    let allData: any = '';
    ps.stdout.on('data', (data: any) => {
        data = data.toString('ascii');
        allData += data;
    });

    const onClose = (code: any): void => {
        delete pidsToProcess[parentPid];

        if (code !== 0) {
            // no more parent processes
            if (Object.keys(pidsToProcess).length === 0) {
                cb();
            }
            return;
        }

        allData.match(/\d+/g).forEach((pid: any) => {
            pid = parseInt(pid, 10);
            tree[parentPid].push(pid);
            tree[pid] = [];
            pidsToProcess[pid] = 1;
            buildProcessTree(pid, tree, pidsToProcess, spawnChildProcessesList, cb);
        });
    };

    ps.on('close', onClose);
}
