/********************************************************************************
 * Copyright (c) 2020-2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { inject, injectable, named } from "@theia/core/shared/inversify";
import { ContributionProvider } from "@theia/core/lib/common/contribution-provider";
import { TreeDecorator } from "@theia/core/lib/browser/tree/tree-decorator";
import { OutlineDecoratorService } from "@theia/outline-view/lib/browser/outline-decorator-service";

/**
 * Symbol for all decorators that would like to contribute into the outline.
 */
export const DiagramOutlineTreeDecorator = Symbol("DiagramOutlineTreeDecorator");

/**
 * Decorator service for the outline.
 */
@injectable()
export class DiagramOutlineViewWidgetDecoratorService extends OutlineDecoratorService {

    constructor(@inject(ContributionProvider) @named(DiagramOutlineTreeDecorator) protected readonly contributions: ContributionProvider<TreeDecorator>) {
        super(contributions);
    }

}
