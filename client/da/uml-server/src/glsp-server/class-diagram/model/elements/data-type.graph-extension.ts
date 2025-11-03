/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { DefaultTypes, GCompartment, GLabel, GNode, GNodeBuilder } from '@eclipse-glsp/server';
import { ModelTypes } from '../../common/util/model-types.js';

export class GDataTypeNode extends GNode {
    name: string = 'UNDEFINED DataType NAME';
    static override builder(): GDataTypeNodeBuilder {
        return new GDataTypeNodeBuilder(GDataTypeNode).type(ModelTypes.DATA_TYPE).layout('vbox').addCssClass('uml-node');
    }
}

export class GDataTypeNodeBuilder<T extends GDataTypeNode = GDataTypeNode> extends GNodeBuilder<T> {
    name(name: string): this {
        this.proxy.name = name;
        return this;
    }

    override build(): T {
        return super.build();
    }

    createCompartmentHeader() {
        const header = GCompartment.builder()
            .type(DefaultTypes.COMPARTMENT_HEADER)
            .id(this.proxy.id + '_comp_header')
            .layout('vbox')
            .addLayoutOption('hAlign', 'center');
        const annotationBuilder = GLabel.builder()
            .type(ModelTypes.LABEL_TEXT)
            .id(this.proxy.id + '_annotation_label')
            .text('<<DataType>>');
        const labelBuilder = GLabel.builder()
            .type(ModelTypes.LABEL_NAME)
            .id(this.proxy.id + '_name_label')
            .text(this.proxy.name)
            .addArg('highlight', true)
            .addCssClass('uml-font-bold');

        header.add(annotationBuilder.build());
        header.add(labelBuilder.build());
        return header.build();
    }
}
