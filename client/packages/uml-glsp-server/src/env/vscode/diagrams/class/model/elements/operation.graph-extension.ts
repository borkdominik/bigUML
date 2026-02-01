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
import { ModelTypes } from '../model-types.js';

export class GOperationNode extends GNode {
    name: string = 'UNDEFINED PROPERTY NAME';
    returnType: string = 'UNDEFINED';
    visibility: string = 'PUBLIC';
    parameterList: Array<{ key: string; type: string }> = [];
    static override builder(): GOperationNodeBuilder {
        return new GOperationNodeBuilder(GOperationNode).type(ModelTypes.OPERATION);
    }
}

export class GOperationNodeBuilder<T extends GOperationNode = GOperationNode> extends GNodeBuilder<T> {
    name(name: string): this {
        this.proxy.name = name;
        return this;
    }
    returnType(returnType: string): this {
        this.proxy.returnType = returnType;
        return this;
    }
    visibility(visibility: string): this {
        this.proxy.visibility = visibility;
        return this;
    }
    parameterList(parameterList: Array<{ key: string; type: string }>): this {
        this.proxy.parameterList = parameterList;
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
            .id(this.proxy.id + '_count_context_' + 4)
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
        const builder = GCompartment.builder().type(DefaultTypes.COMPARTMENT).layout('hbox').addLayoutOptions(layoutOptions);
        // const detailBuilder = GCompartment.builder().type(DefaultTypes.COMPARTMENT).layout('hbox');
        // builder.add(detailBuilder.build());
        return builder.build();
    }

    visibilityBuilder() {
        return GLabel.builder()
            .type(ModelTypes.LABEL_TEXT)
            .id(this.proxy.id + '_count_context_' + 5)
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

    paramList() {
        return this.proxy.parameterList.map(param => param.key + ':' + param.type).join(', ');
    }

    nameBuilder() {
        return GLabel.builder()
            .type(ModelTypes.LABEL_NAME)
            .id(this.proxy.id + '_name_label')
            .text(this.proxy.name + '(' + this.paramList() + ')')
            .addArg('highlight', true);
    }
}
