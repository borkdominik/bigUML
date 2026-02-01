/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { DefaultTypes, GCompartment, GLabel, GNode, GNodeBuilder } from '@eclipse-glsp/server';
import { ModelTypes } from '../model-types.js';

export class GClassNode extends GNode {
    name: string = 'UNDEFINED CLASS NAME';
    isAbstract: boolean = false;
    properties: GCompartment[] = [];
    static override builder(): GClassNodeBuilder {
        return new GClassNodeBuilder(GClassNode).type(ModelTypes.CLASS).layout('vbox').addCssClass('uml-node');
    }
}

export class GClassNodeBuilder<T extends GClassNode = GClassNode> extends GNodeBuilder<T> {
    name(name: string): this {
        this.proxy.name = name;
        return this;
    }
    isAbstract(isAbstract: boolean): this {
        this.proxy.isAbstract = isAbstract;
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
        if (this.proxy.isAbstract) {
            header.add(GLabel.builder().type(ModelTypes.LABEL_TEXT).text('<<abstract>>').build());
            labelBuilder.addCssClass('uml-font-italic');
        }
        header.add(labelBuilder.build());
        return header.build();
    }
}
