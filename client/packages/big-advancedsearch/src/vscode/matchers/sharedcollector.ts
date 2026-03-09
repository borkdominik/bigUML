/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

export class SharedElementCollector {
    static collectRecursively(element: any, callback: (el: any, parentName?: string) => void, parentName?: string): void {
        if (!element) return;

        callback(element, parentName);

        const nestedKeys = [
            'packagedElement',
            'useCase',
            'ownedUseCase',
            'ownedMember',
            'ownedElement',
            'region',
            'subvertex',
            'transition',
            'node',
            'structuredNode',
            'containedNode',
            'edge',
            'partition',
            'subpartition',
            'group',
            'containedGroup',
            'activity',
            'incoming',
            'outgoing',
            'action'
        ];

        for (const key of nestedKeys) {
            const nested = element[key];
            if (Array.isArray(nested)) {
                for (const child of nested) {
                    SharedElementCollector.collectRecursively(child, callback, element.name ?? parentName);
                }
            }
        }
    }
}
