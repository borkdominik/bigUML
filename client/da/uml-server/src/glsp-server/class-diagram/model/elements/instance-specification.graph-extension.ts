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

export class GInstanceSpecificationNode extends GNode {
    name: string = 'UNDEFINED CLASS NAME';
    static override builder(): GInstanceSpecificationNodeBuilder {
        return new GInstanceSpecificationNodeBuilder(GInstanceSpecificationNode)
            .type(ModelTypes.INSTANCE_SPECIFICATION)
            .layout('vbox')
            .addCssClass('uml-node');
    }
}

export class GInstanceSpecificationNodeBuilder<T extends GInstanceSpecificationNode = GInstanceSpecificationNode> extends GNodeBuilder<T> {
    name(name: string): this {
        this.proxy.name = name;
        return this;
    }

    override build(): T {
        return super.build();
    }

    public createCompartmentHeader() {
        const header = GCompartment.builder()
            .type(DefaultTypes.COMPARTMENT_HEADER)
            .id(this.proxy.id + '_comp_header')
            .layout('vbox')
            .addLayoutOption('hAlign', 'center');
        const labelBuilder = GLabel.builder()
            .type(DefaultTypes.LABEL + ':name')
            .id(this.proxy.id + '_name_label')
            .text(this.proxy.name)
            .addArg('highlight', true)
            .addCssClass('uml-font-bold');

        header.add(labelBuilder.build());
        return header.build();
    }
}
