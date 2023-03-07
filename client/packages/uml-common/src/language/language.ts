/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/

export enum UmlDiagramType {
    NONE = '',
    CLASS = 'CLASS',
    COMMUNICATION = 'COMMUNICATION'
}

export namespace UmlDiagramType {
    export const all: UmlDiagramType[] = [UmlDiagramType.CLASS, UmlDiagramType.COMMUNICATION];

    export function parseString(diagramType: string): UmlDiagramType {
        switch (diagramType.toLowerCase()) {
            case 'class':
                return UmlDiagramType.CLASS;
            case 'communication':
                return UmlDiagramType.COMMUNICATION;
        }
        return UmlDiagramType.NONE;
    }
}
