/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { AbstractLayoutConfigurator, type LayoutOptions } from '@eclipse-glsp/layout-elk';
import { type GGraph } from '@eclipse-glsp/server';
import { injectable } from 'inversify';

@injectable()
export class LayeredLayoutConfigurator extends AbstractLayoutConfigurator {
    protected override graphOptions(_graph: GGraph): LayoutOptions | undefined {
        return {
            'elk.algorithm': 'layered'
        };
    }
}
