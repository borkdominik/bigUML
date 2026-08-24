/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { DiamondNode, type GRoutableElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
// eslint-disable-next-line no-restricted-imports
import { ELLIPTIC_ANCHOR_KIND } from 'sprotty';
import { UML_BAR_ANCHOR_KIND } from '../../../features/routing/uml-bar-anchor.js';
import { ActivityFinalNodeView, FlowFinalNodeView, InitialControlNodeView } from '../../views/control-node.view.js';
import { DiamondNodeView } from '../../views/diamond-node.view.js';
import { ForkJoinNodeView } from '../../views/fork-join-node.view.js';
import { RoundedNodeView } from '../../views/rounded-node.view.js';
import { NamedElement, NamedElementView } from '../named-element/index.js';
import { AcceptEventActionView } from './actions/accept_event_action_view.js';
import { SendSignalActionView } from './actions/send_signal_action_view.js';

/** A control flow runs to the edge of the circle rather than to the box around it. */
class GCircularControlNode extends NamedElement {
    override get anchorKind(): string {
        return ELLIPTIC_ANCHOR_KIND;
    }
}

/**
 * The action's box takes a flow anywhere on it, not only on its dots.
 *
 * Sprotty refuses an edge to any node that carries ports, on the reading that a shape with ports offers
 * them as its only ends. An action's dots are not that: they mark the two points a flow can be pinned
 * to, one among the ways of drawing the same flow, so the box has to keep answering a flow dropped
 * anywhere on it. The dots go on working either way - they are ports of their own, and a flow dropped on
 * one lands on the port rather than on the box beneath it, which is what records the pin.
 */
export class GOpaqueActionNode extends NamedElement {
    override canConnect(_routable: GRoutableElement, _role: 'source' | 'target'): boolean {
        return true;
    }
}

/**
 * The rounded box UML draws for an action - the same shape as a state, drawn by the same view. Its name
 * and the pins on its boundary are its children, so both come through `renderChildren`.
 */
@injectable()
export class GOpaqueActionNodeView extends RoundedNodeView {}

export class GAcceptEventActionNode extends NamedElement {}

@injectable()
export class GAcceptEventActionNodeView extends AcceptEventActionView {}

export class GSendSignalActionNode extends NamedElement {}

@injectable()
export class GSendSignalActionNodeView extends SendSignalActionView {}

export class GActivityFinalNode extends GCircularControlNode {}

@injectable()
export class GActivityFinalNodeView extends ActivityFinalNodeView {}

export class GInitialActivityNode extends GCircularControlNode {}

@injectable()
export class GInitialActivityNodeView extends InitialControlNodeView {}

export class GDecisionNode extends DiamondNode {}

@injectable()
export class GDecisionNodeView extends DiamondNodeView {}

export class GMergeNode extends DiamondNode {}

@injectable()
export class GMergeNodeView extends DiamondNodeView {}

/**
 * The activity fork and join are the same bar as the state machine pseudostates, drawn by the same
 * view, so their control flows anchor to it the same way - see `UmlBarAnchor`.
 */
export class GForkNode extends NamedElement {
    override get anchorKind(): string {
        return UML_BAR_ANCHOR_KIND;
    }
}

@injectable()
export class GForkNodeView extends ForkJoinNodeView {}

export class GJoinNode extends NamedElement {
    override get anchorKind(): string {
        return UML_BAR_ANCHOR_KIND;
    }
}

@injectable()
export class GJoinNodeView extends ForkJoinNodeView {}

export class GFlowFinalNode extends GCircularControlNode {}

@injectable()
export class GFlowFinalNodeView extends FlowFinalNodeView {}

export class GCentralBufferNode extends NamedElement {}

@injectable()
export class GCentralBufferNodeView extends NamedElementView {}

export class GActivityParameterNode extends NamedElement {}

@injectable()
export class GActivityParameterNodeView extends NamedElementView {}
