/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VscodeContextMenuItem } from '@vscode-elements/react-elements';
import type { ComponentProps } from 'react';

export type BContextMenuItemProps = ComponentProps<typeof VscodeContextMenuItem>;

export function BContextMenuItem(props: BContextMenuItemProps) {
    return <VscodeContextMenuItem {...props} />;
}
