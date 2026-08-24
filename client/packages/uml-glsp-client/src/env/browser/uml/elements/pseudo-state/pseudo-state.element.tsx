/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ELLIPTIC_ANCHOR_KIND } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { UML_BAR_ANCHOR_KIND } from '../../../features/routing/uml-bar-anchor.js';
import { UML_DIAMOND_TIP_ANCHOR_KIND } from '../../../features/routing/uml-diamond-tip-anchor.js';
import { NamedElement } from '../index.js';
import { DiamondNodeView } from '../../views/diamond-node.view.js';
import { ForkJoinNodeView } from '../../views/fork-join-node.view.js';
import { DeepHistoryNodeView, ShallowHistoryNodeView } from '../../views/history-node.view.js';
import { EntryPointNodeView, ExitPointNodeView, TerminateNodeView } from '../../views/pseudostate-mark-node.view.js';
import { InitialNodeView } from './initial_node_view.js';

export class GInitialStateNode extends NamedElement {}

@injectable()
export class GInitialStateNodeView extends InitialNodeView {}

export class GChoiceNode extends NamedElement {
    /**
     * A choice takes its transitions on the four points of the diamond and nowhere else - see
     * `UmlDiamondTipAnchor`. `NamedElement` inherits a rectangular anchor, which puts them anywhere on
     * the bounding box, and even the stock diamond anchor only gets them as far as the sloped sides.
     */
    override get anchorKind(): string {
        return UML_DIAMOND_TIP_ANCHOR_KIND;
    }
}

@injectable()
export class GChoiceNodeView extends DiamondNodeView {}

/**
 * A fork and a join anchor their transitions to the bar the same way, so both take the same anchor -
 * see `UmlBarAnchor` for why the stock rectangular one does not do for a bar.
 */
export class GStateForkNode extends NamedElement {
    override get anchorKind(): string {
        return UML_BAR_ANCHOR_KIND;
    }
}

@injectable()
export class GStateForkNodeView extends ForkJoinNodeView {}

export class GStateJoinNode extends NamedElement {
    override get anchorKind(): string {
        return UML_BAR_ANCHOR_KIND;
    }
}

@injectable()
export class GStateJoinNodeView extends ForkJoinNodeView {}

/**
 * The pseudostates drawn as a small circle: the two histories and the exit point.
 *
 * All three anchor on the circle rather than on the box it is drawn in. `NamedElement` inherits a
 * rectangular anchor, which puts a transition on the side of the bounding square - up to a fifth of the
 * circle's width clear of the shape where the transition arrives on a diagonal, and further still on a
 * node whose stored size is not square (see `GPseudostateMarkNodeElement`).
 */
export abstract class GCircularPseudostateNode extends NamedElement {
    override get anchorKind(): string {
        return ELLIPTIC_ANCHOR_KIND;
    }
}

export class GDeepHistoryNode extends GCircularPseudostateNode {}

@injectable()
export class GDeepHistoryNodeView extends DeepHistoryNodeView {}

export class GShallowHistoryNode extends GCircularPseudostateNode {}

@injectable()
export class GShallowHistoryNodeView extends ShallowHistoryNodeView {}

export class GExitPointNode extends GCircularPseudostateNode {}

@injectable()
export class GExitPointNodeView extends ExitPointNodeView {}

export class GEntryPointNode extends GCircularPseudostateNode {}

@injectable()
export class GEntryPointNodeView extends EntryPointNodeView {}

/**
 * Where the machine stops. Anchored on its bounding square rather than as a circle: the mark is a cross
 * whose arms run to the corners of that square, so the square is the shape - a transition arriving from
 * the side meets it where the ink is, and one arriving on a diagonal meets the arm it runs along.
 */
export class GTerminateNode extends NamedElement {}

@injectable()
export class GTerminateNodeView extends TerminateNodeView {}
