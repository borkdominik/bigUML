/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { SEdge, SModelRoot } from '@eclipse-glsp/client';
import { SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { injectable } from 'inversify';

@injectable()
export class UmlSelectionService extends SelectionService {
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
