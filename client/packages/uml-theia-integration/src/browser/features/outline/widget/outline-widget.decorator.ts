/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { TreeDecorator } from '@theia/core/lib/browser/tree/tree-decorator';
import { ContributionProvider } from '@theia/core/lib/common/contribution-provider';
import { inject, injectable, named } from '@theia/core/shared/inversify';
import { OutlineDecoratorService } from '@theia/outline-view/lib/browser/outline-decorator-service';

export const OutlineWidgetDecorator = Symbol('OutlineWidgetDecorator');

@injectable()
export class OutlineWidgetDecoratorService extends OutlineDecoratorService {
    constructor(
        @inject(ContributionProvider)
        @named(OutlineWidgetDecorator)
        protected override readonly contributions: ContributionProvider<TreeDecorator>
    ) {
        super(contributions);
    }
}
