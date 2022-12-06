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
import { LabeledNode, SEditableLabel } from "../../model";
import { UmlTypes } from "../../utils";
import {
    IconInteraction,
    IconLifeline,
    InteractionNodeView,
    LifelineNodeView,
    MessageArrowLabelView,
    MessageEdgeView
} from "./views";

export default function createCommunicationModule(): ContainerModule {
    const communicationModule = new ContainerModule(
        (bind, unbind, isBound, rebind) => {
            const context = { bind, unbind, isBound, rebind };
            configureModelElement(
                context,
                UmlTypes.ICON_LIFELINE,
                IconLifeline,
                IconView
            );
            configureModelElement(
                context,
                UmlTypes.ICON_INTERACTION,
                IconInteraction,
                IconView
            );
            configureModelElement(
                context,
                UmlTypes.INTERACTION,
                LabeledNode,
                InteractionNodeView
            );
            configureModelElement(
                context,
                UmlTypes.LIFELINE,
                LabeledNode,
                LifelineNodeView
            );
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
