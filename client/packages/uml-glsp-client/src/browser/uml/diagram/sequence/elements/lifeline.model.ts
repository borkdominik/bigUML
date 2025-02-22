/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/

import { NamedElement } from '../../../elements/index.js';
import { UML_LIFELINE_ANCHOR_KIND } from '../features/change-bounds/uml-custom-lifeline-anchor.js';
import { sequence } from './interacton.model.js';

export const sequence_lifeline = Symbol('sequence_lifeline');
export class LifelineElement extends NamedElement {
    static override readonly DEFAULT_FEATURES = [...super.DEFAULT_FEATURES, sequence, sequence_lifeline];

    /*
     * Returns the anchorComputer Kind for LifelineElement
     */
    override get anchorKind(): string {
        return UML_LIFELINE_ANCHOR_KIND;
    }

    headerHeight(): number {
        return 40;
    }
}
