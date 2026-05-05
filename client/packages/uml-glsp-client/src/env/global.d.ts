/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { VNodeData } from 'snabbdom';

declare global {
    namespace svg.JSX {
        // Based on the tag list in github:DefinitelyTyped/DefinitelyTyped:React
        interface IntrinsicElements {
            [elemName: string]: VNodeData;
        }
    }
}
