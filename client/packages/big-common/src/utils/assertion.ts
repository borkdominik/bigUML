/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

export function getDefined<T>(value: T | undefined | null, message?: string): T {
    if (value === undefined || value === null) {
        throw new Error(message ?? 'Value is undefined or null');
    }
    return value;
}
