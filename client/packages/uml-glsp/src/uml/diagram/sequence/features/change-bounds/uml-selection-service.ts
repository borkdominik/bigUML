/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { SEdge, SModelRoot } from '@eclipse-glsp/client';
import { SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { injectable } from 'inversify';

@injectable()
export class SDSelectionService extends SelectionService {
    override updateSelection(root: Readonly<SModelRoot>, select: string[], deselect: string[]): void {
        if (root === undefined || root.index === undefined || select.length === 0) {
            return super.updateSelection(root, select, deselect);
        } else {
            select.forEach(elementId => {
                const element = root.index.getById(elementId);
                if (element?.type === 'edge:sequence__Message' && element instanceof SEdge) {
                    if (!select.includes(element.sourceId)) {
                        select.push(element.sourceId);
                    }
                    if (!select.includes(element.targetId)) {
                        select.push(element.targetId);
                    }
                }
            });
        }
        return super.updateSelection(root, select, deselect);
    }
}
