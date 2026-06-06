/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { Language } from '@borkdominik-biguml/uml-language-tooling';

export abstract class Element {}

export abstract class ElementWithSizeAndPosition extends Element {}

export abstract class Node extends ElementWithSizeAndPosition {}

export abstract class Edge extends Element {}

export abstract class Unbounded extends Element {}

export abstract class MetaInfo {
    @Language.reference element: ElementWithSizeAndPosition;
}
export class Size extends MetaInfo {
    height: number;
    width: number;
}
export class Position extends MetaInfo {
    x: number;
    y: number;
}

export type Visibility = 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'PACKAGE';
