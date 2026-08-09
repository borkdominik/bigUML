/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { injectable } from 'inversify';
import { UML_BAR_ANCHOR_KIND } from '../../../features/routing/uml-bar-anchor.js';
import { UML_DIAMOND_TIP_ANCHOR_KIND } from '../../../features/routing/uml-diamond-tip-anchor.js';
import { NamedElement } from '../index.js';
import { DiamondNodeView } from '../../views/diamond-node.view.js';
import { ForkJoinNodeView } from '../../views/fork-join-node.view.js';
import { DeepHistoryNodeView, ShallowHistoryNodeView } from '../../views/history-node.view.js';
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

export class GDeepHistoryNode extends NamedElement {}

@injectable()
export class GDeepHistoryNodeView extends DeepHistoryNodeView {}

export class GShallowHistoryNode extends NamedElement {}

@injectable()
export class GShallowHistoryNodeView extends ShallowHistoryNodeView {}
