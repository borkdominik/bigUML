/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { inject, injectable } from '@theia/core/shared/inversify';
import { OutlineViewService } from '@theia/outline-view/lib/browser/outline-view-service';

import { OutlineWidgetFactory, OutlineWidgetSymbolInformationNode } from './outline-widget.widget';

@injectable()
export class OutlineWidgetService extends OutlineViewService {
    override id = 'diagram-outline-view';

    constructor(@inject(OutlineWidgetFactory) protected override factory: OutlineWidgetFactory) {
        super(factory);
    }

    override publish(roots: OutlineWidgetSymbolInformationNode[]): void {
        if (this.widget) {
            this.widget.setOutlineTree(roots);
        }
        this.onDidChangeOutlineEmitter.fire(roots);
    }
}
