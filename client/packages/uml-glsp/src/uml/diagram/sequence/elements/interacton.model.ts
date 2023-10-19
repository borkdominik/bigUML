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

import { SModelElement } from '@eclipse-glsp/client';
import { NamedElement } from '../../../elements';

export const sequence = Symbol('sequence');

export function isSequence(element: SModelElement): element is SModelElement {
    return element.hasFeature(sequence);
}
export class InteractionElement extends NamedElement {
    static override readonly DEFAULT_FEATURES = [...super.DEFAULT_FEATURES, sequence];
}
