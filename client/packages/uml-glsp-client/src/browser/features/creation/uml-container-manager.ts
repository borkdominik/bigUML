/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
    type ContainerElement,
    ContainerManager,
    CSS_GHOST_ELEMENT,
    findChildrenAtPosition,
    type GModelElement,
    InsertIndicator,
    isContainable,
    type Point
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class UMLContainerManager extends ContainerManager {
    override findContainer(location: Point, ctx: GModelElement, _evt?: MouseEvent): ContainerElement | undefined {
        const childrenAtPosition = findChildrenAtPosition(ctx.root, location).filter(child => !(child instanceof InsertIndicator));
        let elements: GModelElement[] = [];

        if (childrenAtPosition.length === 0) {
            elements = [ctx.root];
        } else {
            elements = childrenAtPosition.reverse();
        }

        return elements.find(element => isContainable(element) && !element.cssClasses?.includes(CSS_GHOST_ELEMENT)) as
            | ContainerElement
            | undefined;
    }
}
