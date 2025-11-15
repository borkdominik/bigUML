/*********************************************************************************
* Copyright (c) 2023 borkdominik and others.
*
* This program and the accompanying materials are made available under the
* terms of the MIT License which is available at https://opensource.org/licenses/MIT.
*
* SPDX-License-Identifier: MIT
*********************************************************************************/
import { AbstractLayoutConfigurator, LayoutOptions } from '@eclipse-glsp/layout-elk';
import { GGraph } from '@eclipse-glsp/server';
import { injectable } from 'inversify';

@injectable()
export class BigUmlLayoutConfigurator extends AbstractLayoutConfigurator {
    protected override graphOptions(graph: GGraph): LayoutOptions | undefined {
        return {
            'elk.algorithm': 'layered'
        };
    }
}
