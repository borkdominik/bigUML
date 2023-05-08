/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { injectable } from '@theia/core/shared/inversify';
import { OutlineViewTreeModel } from '@theia/outline-view/lib/browser/outline-view-tree-model';

@injectable()
export class OutlineWidgetTreeModel extends OutlineViewTreeModel {}
