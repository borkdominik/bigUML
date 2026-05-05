/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

/**
 * Wrapper for a VSCodeCommand that can be registered through Dependency Injection.
 * Use {@link TYPES.Command} to register.
 */
export interface VSCodeCommand {
    id: string;
    execute(...args: any[]): any;
}
