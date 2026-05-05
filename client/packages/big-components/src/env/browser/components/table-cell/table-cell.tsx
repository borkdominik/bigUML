/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VscodeTableCell } from '@vscode-elements/react-elements';
import type { ComponentProps } from 'react';

export type BTableCellProps = ComponentProps<typeof VscodeTableCell>;

export function BTableCell(props: BTableCellProps) {
    return <VscodeTableCell {...props} />;
}
