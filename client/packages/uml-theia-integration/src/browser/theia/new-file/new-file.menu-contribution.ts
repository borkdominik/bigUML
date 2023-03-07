/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { MenuContribution, MenuModelRegistry } from '@theia/core';
import { CommonMenus } from '@theia/core/lib/browser';
import { NavigatorContextMenu } from '@theia/navigator/lib/browser/navigator-contribution';
import { injectable } from 'inversify';
import { NEW_FILE_COMMAND } from './new-file.command';

@injectable()
export class NewFileMenuContribution implements MenuContribution {
    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.FILE_NEW, {
            commandId: NEW_FILE_COMMAND.id,
            label: NEW_FILE_COMMAND.label,
            icon: NEW_FILE_COMMAND.iconClass,
            order: '0'
        });

        menus.registerMenuAction(NavigatorContextMenu.NAVIGATION, {
            commandId: NEW_FILE_COMMAND.id,
            label: NEW_FILE_COMMAND.label,
            icon: NEW_FILE_COMMAND.iconClass,
            order: '0'
        });
    }
}
