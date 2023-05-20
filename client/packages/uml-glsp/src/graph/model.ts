/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    deletableFeature,
    EditableLabel,
    editLabelFeature,
    hoverFeedbackFeature,
    isEditableLabel,
    Nameable,
    nameFeature,
    popupFeature,
    RectangularNode,
    SChildElement,
    selectFeature,
    SLabel,
    WithEditableLabel,
    withEditLabelFeature
} from '@eclipse-glsp/client';

export class LabeledNode extends RectangularNode implements WithEditableLabel, Nameable {
    get editableLabel(): (SChildElement & EditableLabel) | undefined {
        const headerComp = this.children.find(element => element.type === 'comp:header');
        if (headerComp) {
            const label = headerComp.children.find(element => element.type === 'label:heading');
            if (label && isEditableLabel(label)) {
                return label;
            }
        }
        return undefined;
    }

    get name(): string {
        if (this.editableLabel) {
            return this.editableLabel.text;
        }
        return this.id;
    }

    override hasFeature(feature: symbol): boolean {
        return super.hasFeature(feature) || feature === nameFeature || feature === withEditLabelFeature;
    }
}

export class SEditableLabel extends SLabel implements EditableLabel {
    override hasFeature(feature: symbol): boolean {
        return feature === editLabelFeature || super.hasFeature(feature);
    }
}

export class SLabelNode extends SLabel implements EditableLabel {
    hoverFeedback = false;
    imageName: string;

    override hasFeature(feature: symbol): boolean {
        return (
            feature === selectFeature ||
            feature === editLabelFeature ||
            feature === popupFeature ||
            feature === deletableFeature ||
            feature === hoverFeedbackFeature ||
            super.hasFeature(feature)
        );
    }
}
