/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import prettier from 'prettier';

export async function format(content: string): Promise<string> {
    try {
        const config = await prettier.resolveConfig(process.cwd());
        return await prettier.format(content, {
            ...config,
            parser: 'typescript'
        });
    } catch {
        console.warn('Prettier formatting failed. Writing raw output.');
        return content;
    }
}
