/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VscodeToolbarContainer } from '@vscode-elements/react-elements';
import type { ComponentProps } from 'react';

export type BToolbarContainerProps = ComponentProps<typeof VscodeToolbarContainer>;

export function BToolbarContainer(props: BToolbarContainerProps) {
    return <VscodeToolbarContainer {...props} />;
}
