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
import { SChildElement, selectFeature } from "@eclipse-glsp/client";
import {
    boundsFeature,
    Connectable,
    connectableFeature,
    Deletable,
    deletableFeature,
    EditableLabel,
    editFeature,
    editLabelFeature,
    fadeFeature,
    Hoverable,
    hoverFeedbackFeature,
    isEditableLabel,
    layoutableChildFeature,
    layoutContainerFeature,
    Nameable,
    nameFeature,
    popupFeature,
    RectangularNode,
    SCompartment,
    SEdge,
    Selectable,
    SLabel,
    SRoutableElement,
    SShapeElement,
    WithEditableLabel,
    withEditLabelFeature
} from "sprotty/lib";

export class LabeledNode extends RectangularNode implements WithEditableLabel, Nameable {

    get editableLabel(): (SChildElement & EditableLabel) | undefined {
        const headerComp = this.children.find(element => element.type === "comp:header");
        if (headerComp) {
            const label = headerComp.children.find(element => element.type === "label:heading");
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

    hasFeature(feature: symbol): boolean {
        return super.hasFeature(feature) || feature === nameFeature || feature === withEditLabelFeature;
    }
}

export class SEditableLabel extends SLabel implements EditableLabel {
    hasFeature(feature: symbol): boolean {
        return feature === editLabelFeature || super.hasFeature(feature);
    }
}

export class Icon extends SShapeElement {
    iconImageName: string;

    hasFeature(feature: symbol): boolean {
        return feature === boundsFeature || feature === layoutContainerFeature || feature === layoutableChildFeature || feature === fadeFeature;
    }
}

export class IconLabelCompartment extends SCompartment implements Selectable, Deletable, Hoverable {
    selected = false;
    hoverFeedback = false;

    hasFeature(feature: symbol): boolean {
        return super.hasFeature(feature) || feature === selectFeature || feature === deletableFeature || feature === hoverFeedbackFeature;
    }
}

export class SLabelNode extends SLabel implements EditableLabel {
    hoverFeedback = false;
    imageName: string;

    hasFeature(feature: symbol): boolean {
        return (feature === selectFeature || feature === editLabelFeature || feature === popupFeature || feature === deletableFeature ||
            feature === hoverFeedbackFeature || super.hasFeature(feature));
    }
}

export class SLabelNodeProperty extends SLabelNode {
    imageName = "Property.svg";
}

export class ConnectableEditableLabel extends SLabel implements EditableLabel, Connectable {
    constructor() {
        super();
        ConnectableEditableLabel.DEFAULT_FEATURES.push(connectableFeature);
    }

    canConnect(routable: SRoutableElement, role: "source" | "target"): boolean {
        return true;
        // TODO: If neccessary return false under some conditions
    }

    hasFeature(feature: symbol): boolean {
        return feature === editLabelFeature || super.hasFeature(feature);
    }
}

export class ConnectableEdge extends SEdge implements Connectable {
    canConnect(routable: SRoutableElement, role: "source" | "target"): boolean {
        return true;
        // TODO: If neccessary return false under some conditions
    }

    static readonly DEFAULT_FEATURES = [editFeature, deletableFeature, selectFeature, fadeFeature,
        hoverFeedbackFeature, connectableFeature];

    selected = false;
    hoverFeedback = true;
    opacity = 1;
}

