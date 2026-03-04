/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { positionToPoint, sizeToDimension } from '@borkdominik-biguml/uml-model-server';
import { isPosition, isSize } from '@borkdominik-biguml/uml-model-server/grammar';
import { type GModelElement, type GModelElementSchema, DefaultGModelSerializer } from '@eclipse-glsp/server';
import { injectable } from 'inversify';

@injectable()
export class DiagramGModelSerializer extends DefaultGModelSerializer {
    override createSchema(element: GModelElement): GModelElementSchema {
        const schema: Record<string, any> = {};

        for (const key in element) {
            if (!this.isReserved(element, key)) {
                const value: any = (element as any)[key];

                if (typeof value === 'function') {
                    continue;
                }

                if (isPosition(value)) {
                    schema[key] = positionToPoint(value);
                } else if (isSize(value)) {
                    schema[key] = sizeToDimension(value);
                } else {
                    schema[key] = value;
                }
            }
        }

        schema['children'] = (element.children ?? []).map(child => this.createSchema(child));

        return schema as GModelElementSchema;
    }
}
