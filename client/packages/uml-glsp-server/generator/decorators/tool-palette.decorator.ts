/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

export interface ToolPaletteItemOptions {
    id?: string;
    section: string;
    label: string;
    icon: string;
}

export function toolPaletteItem(_options: ToolPaletteItemOptions): ClassDecorator {
    return (() => {}) as ClassDecorator;
}
