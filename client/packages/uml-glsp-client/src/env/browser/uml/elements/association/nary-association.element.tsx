/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { injectable } from 'inversify';
import { UML_DIAMOND_TIP_ANCHOR_KIND } from '../../../features/routing/uml-diamond-tip-anchor.js';
import { DiamondNodeView } from '../../views/diamond-node.view.js';
import { NamedElement } from '../index.js';

/**
 * The diamond of an association between more than two classes. Drawn and anchored like a choice: its
 * associations meet it on the four tips - see `GChoiceNode`.
 */
export class GNaryAssociationNode extends NamedElement {
    override get anchorKind(): string {
        return UML_DIAMOND_TIP_ANCHOR_KIND;
    }
}

@injectable()
export class GNaryAssociationNodeView extends DiamondNodeView {}
