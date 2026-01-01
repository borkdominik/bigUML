/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { DefaultTypes, GCompartment, GLabel, GNode, GNodeBuilder } from '@eclipse-glsp/server';
import { ModelTypes } from '../../common/util/model-types.js';

export class GPropertyNode extends GNode {
    name: string = 'UNDEFINED PROPERTY NAME';
    propertyType?: string;
    visibility: string = 'PUBLIC';
    multiplicity: string = '1';
    static override builder(): GPropertyNodeBuilder {
        return new GPropertyNodeBuilder(GPropertyNode).type(ModelTypes.PROPERTY);
    }
}

export class GPropertyNodeBuilder<T extends GPropertyNode = GPropertyNode> extends GNodeBuilder<T> {
    name(name: string): this {
        this.proxy.name = name;
        return this;
    }
    propertyType(propertyType: string): this {
        this.proxy.propertyType = propertyType;
        return this;
    }
    visibility(visibility: string): this {
        this.proxy.visibility = visibility;
        return this;
    }
    multiplicity(multiplicity: string): this {
        this.proxy.multiplicity = multiplicity;
        return this;
    }
    override build(): T {
        return super.build();
    }

    leftSide() {
        const options = {
            ['hGap']: 3,
            ['paddingTop']: 0,
            ['paddingBottom']: 0,
            ['paddingLeft']: 0,
            ['paddingRight']: 0,
            ['resizeContainer']: true
        };
        return GCompartment.builder()
            .type(DefaultTypes.COMPARTMENT)
            .id(this.proxy.id + '_count_context_' + 1)
            .layout('hbox')
            .addLayoutOptions(options)
            .add(this.visibilityBuilder().build())
            .add(this.nameBuilder().build())
            .build();
    }
    rightSide() {
        const layoutOptions = {
            ['hGap']: 3,
            ['paddingTop']: 0,
            ['paddingBottom']: 0,
            ['paddingLeft']: 0,
            ['paddingRight']: 0,
            ['resizeContainer']: true
        };
        const builder = GCompartment.builder()
            .type(DefaultTypes.COMPARTMENT)
            .id(this.proxy.id + 'right_side')
            .layout('hbox')
            .addLayoutOptions(layoutOptions);
        const detailBuilder = GCompartment.builder().type(DefaultTypes.COMPARTMENT).layout('hbox').addLayoutOptions(layoutOptions);
        detailBuilder.add(typeBuilder(this.proxy.propertyType!, this.proxy.id).build());
        detailBuilder.add(multiplicityBuilder(this.proxy.multiplicity, this.proxy.id).build());
        if (this.proxy.propertyType) {
            builder.add(GLabel.builder().type(ModelTypes.LABEL_TEXT).text(':').build());
            builder.add(detailBuilder.build());
        }
        return builder.build();
    }

    visibilityBuilder() {
        return GLabel.builder()
            .type(ModelTypes.LABEL_TEXT)
            .id(this.proxy.id + '_count_context_' + 2)
            .text(this.getVisibility());
    }

    getVisibility() {
        switch (this.proxy.visibility) {
            case 'PUBLIC':
                return '+';
            case 'PRIVATE':
                return '-';
            case 'PROTECTED':
                return '#';
            case 'PACKAGE':
                return '~';
            default:
                return '';
        }
    }

    nameBuilder() {
        return GLabel.builder()
            .type(ModelTypes.LABEL_NAME)
            .id(this.proxy.id + '_name_label')
            .text(this.proxy.name)
            .addArg('highlight', true);
    }
}

export function textBuilder(text: string, id: string) {
    return GLabel.builder().type(ModelTypes.LABEL_TEXT).id(id).text(text);
}
export function typeBuilder(text: string, _id: string) {
    return GLabel.builder().type(ModelTypes.LABEL_TEXT).text(text);
}
export function multiplicityBuilder(text = '1', _id: string) {
    if (text === '1') {
        return GLabel.builder();
    }
    return GLabel.builder().type(ModelTypes.LABEL_TEXT).text(text);
}
