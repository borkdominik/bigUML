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
import {
    boundsFeature,
    deletableFeature,
    EditableLabel,
    fadeFeature,
    hoverFeedbackFeature,
    isEditableLabel,
    layoutContainerFeature,
    moveFeature,
    Nameable,
    nameFeature,
    popupFeature,
    RectangularNode,
    SChildElement,
    selectFeature,
    WithEditableLabel,
    withEditLabelFeature
} from '@eclipse-glsp/client';

import { UmlTypes } from '../src/utils';

// Activity and Deployment
export class PackageNode extends RectangularNode implements Nameable, WithEditableLabel {
    static override readonly DEFAULT_FEATURES = [
        deletableFeature,
        selectFeature,
        boundsFeature,
        moveFeature,
        layoutContainerFeature,
        fadeFeature,
        hoverFeedbackFeature,
        popupFeature,
        nameFeature,
        withEditLabelFeature
    ];

    name = '';

    get editableLabel(): (SChildElement & EditableLabel) | undefined {
        const label = this.children.find(element => element.type === UmlTypes.LABEL_PACKAGE_NAME);
        if (label && isEditableLabel(label)) {
            return label;
        }
        return undefined;
    }
}
