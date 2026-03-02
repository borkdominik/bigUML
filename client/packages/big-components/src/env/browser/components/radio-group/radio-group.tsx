/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VscodeRadioGroup } from '@vscode-elements/react-elements';
import type { ComponentProps } from 'react';

export type BRadioGroupProps = ComponentProps<typeof VscodeRadioGroup>;

export function BRadioGroup(props: BRadioGroupProps) {
    return <VscodeRadioGroup {...props} />;
}
