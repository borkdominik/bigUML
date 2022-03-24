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
import { SChildElement } from "@eclipse-glsp/client";
import {
    boundsFeature,
    Connectable,
    connectableFeature,
    deletableFeature,
    DiamondNode,
    EditableLabel,
    editLabelFeature,
    editFeature,
    fadeFeature,
    hoverFeedbackFeature,
    isEditableLabel,
    layoutableChildFeature,
    layoutContainerFeature,
    Nameable,
    nameFeature,
    popupFeature,
    RectangularNode,
    selectFeature,
    SEdge,
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

// CLASS
export class IconClass extends Icon {
    iconImageName = "Class.svg";
}

// ACTIVITY
export class IconActivity extends Icon {
    iconImageName = "Activity.svg";
}

export class IconAction extends Icon {
    iconImageName = "OpaqueAction.gif";
}

// USECASE
export class IconUseCase extends Icon {
    iconImageName = "UseCase.gif";
}

export class IconActor extends Icon {
    iconImageName = "Actor.gif";
}

export class IconPackage extends Icon {
    iconImageName = "Package.gif";
}

// STATE MACHINE
export class IconState extends Icon {
    iconImageName = "State.svg";
}

export class IconStateMachine extends Icon {
    // TODO: set StateMachine.svg
    iconImageName = "Class.svg";
}

// DEPLOYMENT
export class IconArtifact extends Icon {
    iconImageName = "Artifact.svg";
}

export class IconDevice extends Icon {
    iconImageName = "Device.svg";
}

export class IconExecutionEnvironment extends Icon {
    iconImageName = "ExecutionEnvironment.svg";
}

export class IconDeploymentNode extends Icon {
    iconImageName = "DeploymentNode.svg";
}

export class IconDeploymentSpecification extends Icon {
    iconImageName = "DeploymentSpecification.svg";
}

// OBJECT
export class IconObject extends Icon {
    iconImageName = "Object.svg";
}

export class ControlNode extends DiamondNode {
    size = {
        width: 32,
        height: 32
    };
    strokeWidth = 1;
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

export class ConnectionPoint extends SLabel implements Connectable {
    canConnect(routable: SRoutableElement, role: "source" | "target"): boolean {
        return true;
        // TODO: If neccessary return false under some conditions
    }
    selected = false;
    hoverFeedback = false;
    opacity = 1;
}
