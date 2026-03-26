/********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
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

import { DefaultTypes, type GModelElement } from '@eclipse-glsp/server';
import { CreateNodesMcpToolHandler } from '@eclipse-glsp/server-mcp';
import { injectable } from 'inversify';
import { CommonModelTypes } from '../../../common/index.js';

@injectable()
export class UmlCreateNodesMcpToolHandler extends CreateNodesMcpToolHandler {
    override getCorrespondingLabelId(element: GModelElement): string | undefined {
        // First, try to find a direct label child -> e.g., enumeration literals
        const directLabel = element.children.find(child => child.type === CommonModelTypes.LABEL_NAME)?.id;
        if (directLabel) {
            return directLabel;
        }

        // Otherwise, first check whether the element uses a header -> this applies to most class-like elements
        const compHeaderLabel = element.children
            .find(child => child.type === DefaultTypes.COMPARTMENT_HEADER)
            ?.children.find(child => child.type === CommonModelTypes.LABEL_NAME)?.id;
        if (compHeaderLabel) {
            return compHeaderLabel;
        }

        return undefined;
    }
}
