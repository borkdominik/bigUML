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

export class GPackageClassNode extends GNode {
    name: string = 'UNDEFINED CLASS NAME';
    isAbstract: boolean = false;
    isActive: boolean = false;
    visibility: string = 'PUBLIC';
    static override builder(): GPackageClassNodeBuilder {
        return new GPackageClassNodeBuilder(GPackageClassNode).type(ModelTypes.CLASS).layout('vbox').addCssClass('uml-node');
    }
}

export class GPackageClassNodeBuilder<T extends GPackageClassNode = GPackageClassNode> extends GNodeBuilder<T> {
    name(name: string): this {
        this.proxy.name = name;
        return this;
    }
    isAbstract(isAbstract: boolean): this {
        this.proxy.isAbstract = isAbstract;
        return this;
    }
    isActive(isActive: boolean): this {
        this.proxy.isActive = isActive;
        return this;
    }
    visibility(visibility: string): this {
        this.proxy.visibility = visibility;
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
            header.add(
                GLabel.builder()
                    .type(ModelTypes.LABEL_TEXT)
                    .id(this.proxy.id + '_abstract_label')
                    .text('<<abstract>>')
                    .addCssClass('uml-font-italic')
                    .build()
            );
        }
        header.add(labelBuilder.build());
        return header.build();
    }
}
