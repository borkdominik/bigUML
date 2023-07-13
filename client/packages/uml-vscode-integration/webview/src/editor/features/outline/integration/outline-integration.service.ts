/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { OutlineService, OutlineTreeNode } from '@borkdominik-biguml/uml-glsp/lib/features/outline';
import { injectable } from 'inversify';

@injectable()
export class OutlineIntegrationService extends OutlineService {
    updateOutline(outlineNodes: OutlineTreeNode[]): void {
        console.log('[OutlineIntegrationService]', outlineNodes);
    }
}
