/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 * Copyright (c) 2023 CrossBreeze (https://github.com/crossmodel/crossmodel-core/)
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { Command } from '@eclipse-glsp/server';
import type { DiagramModelState } from '../model/diagram-model-state.js';

/** A command that applies a JSON patch to the semantic model, with undo and redo handled by the model service. */
export class ModelPatchCommand implements Command {
    constructor(
        protected state: DiagramModelState,
        protected modelPatch?: string
    ) {}
    async undo(): Promise<void> {
        await this.state.undo();
    }
    async redo(): Promise<void> {
        await this.state.redo();
    }
    canUndo(): boolean {
        return true;
    }

    async execute(): Promise<void> {
        if (this.modelPatch) {
            await this.state.sendModelPatch(this.modelPatch);
        }
    }
}
