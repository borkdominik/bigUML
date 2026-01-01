/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { injectable } from 'inversify';
import { AbstractPopupFactory } from '../../../common/provider/abstract-popup-factory.js';
import { GPackageClassNode } from '../model/elements/class.graph-extension.js';

@injectable()
export class PackageDiagramPopupFactory extends AbstractPopupFactory<GPackageClassNode> {
    protected readonly nodeCtor = GPackageClassNode;
}
