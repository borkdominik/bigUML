/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
export function getNodeByPointer(root: any, pointer: string): any {
    // remove the leading '/' and split, taking care to unescape ~0 and ~1
    const segments = pointer
        .replace(/^\/+/, '')
        .split('/')
        .map(s => s.replace(/~1/g, '/').replace(/~0/g, '~'));

    return segments.reduce<any>((obj, seg) => {
        if (obj === undefined) return undefined;
        const key = Array.isArray(obj) ? Number(seg) : seg;
        return obj[key as any];
    }, root);
}
