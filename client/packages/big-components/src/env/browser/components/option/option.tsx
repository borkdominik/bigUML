/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VscodeOption } from '@vscode-elements/react-elements';
import type { ComponentProps } from 'react';

export type BOptionProps = ComponentProps<typeof VscodeOption>;

export function BOption(props: BOptionProps) {
    return <VscodeOption {...props} />;
}
