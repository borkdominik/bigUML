/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ContainerContext } from '@eclipse-glsp/theia-integration';
import { LabelProviderContribution } from '@theia/core/lib/browser/label-provider';
import { LabelProvider } from './label.provider';

export function registerEditorModule(context: ContainerContext): void {
    context.bind(LabelProviderContribution).to(LabelProvider);
}
