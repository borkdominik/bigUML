/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { GLabel, GNode, GNodeBuilder } from '@eclipse-glsp/server';
import { ModelTypes } from '../model-types.js';

export class GEnumerationLiteralNode extends GNode {
    name: string = 'UNDEFINED ENUMERATION LITERAL NAME';
    static override builder(): GEnumerationLiteralNodeBuilder {
        return new GEnumerationLiteralNodeBuilder(GEnumerationLiteralNode)
            .type(ModelTypes.ENUMERATION_LITERAL)
            .layout('hbox')
            .addLayoutOption('resizeContainer', 'true');
    }
}

export class GEnumerationLiteralNodeBuilder<T extends GEnumerationLiteralNode = GEnumerationLiteralNode> extends GNodeBuilder<T> {
    name(name: string): this {
        this.proxy.name = name;
        return this;
    }

    override build(): T {
        return super.build();
    }

    nameBuilder() {
        return GLabel.builder()
            .type(ModelTypes.LABEL_NAME)
            .id(this.proxy.id + '_name_label')
            .text(this.proxy.name)
            .addArg('highlight', true);
    }
}
