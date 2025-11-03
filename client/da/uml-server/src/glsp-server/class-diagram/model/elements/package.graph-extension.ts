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

export class GPackageNode extends GNode {
    name: string = 'UNDEFINED CLASS NAME';
    uri: string = 'UNDEFINED URI';
    visibility: string = 'PUBLIC';
    static override builder(): GPackageNodeBuilder {
        return new GPackageNodeBuilder(GPackageNode)
            .type(ModelTypes.PACKAGE)
            .layout('vbox')
            .addCssClass('uml-node')
            .addCssClass('uml-package-node');
    }
}

export class GPackageNodeBuilder<T extends GPackageNode = GPackageNode> extends GNodeBuilder<T> {
    name(name: string): this {
        this.proxy.name = name;
        return this;
    }
    uri(uri: string): this {
        this.proxy.uri = uri;
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
        header.add(
            GLabel.builder()
                .type(ModelTypes.LABEL_TEXT)
                .id(this.proxy.id + '_package_label')
                .text('<<package>>')
                .build()
        );

        header.add(labelBuilder.build());
        return header.build();
    }
}
