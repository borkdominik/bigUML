/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 * Copyright (c) 2023 CrossBreeze (https://github.com/crossmodel/crossmodel-core/)
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type Command, type DefaultModelState } from '@eclipse-glsp/server';

interface ModelState extends DefaultModelState {
    sendModelPatch(string: any): any;
    redo(): any;
    undo(): any;
}

/**
 * A custom recording command that tracks updates during exection through a textual semantic state.
 * Tracking updates ensures that we have proper undo/redo support
 */
export class ModelPatchCommand implements Command {
    constructor(
        protected state: ModelState,
        protected modelPatch?: string
    ) {}
    async undo(): Promise<void> {
        await this.state.undo();
    }
    async redo(): Promise<void> {
        await this.state.redo();
    }
    canUndo?(): boolean {
        return true;
    }

    async execute(): Promise<void> {
        if (this.modelPatch) {
            await this.state.sendModelPatch(this.modelPatch);
        }
    }
}
