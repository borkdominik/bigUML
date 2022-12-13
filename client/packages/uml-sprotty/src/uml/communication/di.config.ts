/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import "@eclipse-glsp/client/css/glsp-sprotty.css";
import "balloon-css/balloon.min.css";
import "sprotty/css/edit-label.css";

import { configureModelElement, SEdge } from "@eclipse-glsp/client/lib";
import { ContainerModule } from "inversify";

import { IconView } from "../../common/common";
import { SEditableLabel } from "../../model";
import { UmlTypes } from "../../utils";
import { NamedElement } from "../shared/named-element.model";
import { NamedElementView } from "../shared/named-element.view";
import { IconInteraction } from "./elements/interaction";
import { IconLifeline } from "./elements/lifeline";
import { MessageArrowLabelView, MessageEdgeView } from "./elements/message";

export default function createCommunicationModule(): ContainerModule {
    const communicationModule = new ContainerModule(
        (bind, unbind, isBound, rebind) => {
            const context = { bind, unbind, isBound, rebind };

            // Interaction
            configureModelElement(
                context,
                UmlTypes.ICON_INTERACTION,
                IconInteraction,
                IconView
            );
            configureModelElement(
                context,
                UmlTypes.INTERACTION,
                NamedElement,
                NamedElementView
            );

            // Lifeline
            configureModelElement(
                context,
                UmlTypes.ICON_LIFELINE,
                IconLifeline,
                IconView
            );
            configureModelElement(
                context,
                UmlTypes.LIFELINE,
                NamedElement,
                NamedElementView
            );

            // Message
            configureModelElement(
                context,
                UmlTypes.MESSAGE,
                SEdge,
                MessageEdgeView
            );
            configureModelElement(
                context,
                UmlTypes.MESSAGE_LABEL_ARROW_EDGE_NAME,
                SEditableLabel,
                MessageArrowLabelView
            );
        }
    );

    return communicationModule;
}
