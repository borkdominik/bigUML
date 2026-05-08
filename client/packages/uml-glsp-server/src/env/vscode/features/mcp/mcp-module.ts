/********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
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

import { bindAsService } from '@eclipse-glsp/server';
import {
    CreateEdgesMcpToolHandler,
    CreateNodesMcpToolHandler,
    ElementTypesMcpResourceHandler,
    McpModelSerializer,
    McpToolHandler,
    ModifyEdgesMcpToolHandler,
    ModifyNodesMcpToolHandler
} from '@eclipse-glsp/server-mcp';
import { ContainerModule } from 'inversify';
import { UmlCreateEdgesMcpToolHandler } from './create-edges-handler.js';
import { CreateMembersMcpToolHandler } from './create-members-handler.js';
import { UmlCreateNodesMcpToolHandler } from './create-nodes-handler.js';
import { UmlElementTypesMcpResourceHandler } from './element-types-handler.js';
import { UmlMcpModelSerializer } from './mcp-model-serializer.js';
import { UmlModifyEdgesMcpToolHandler } from './modify-edges-handler.js';
import { ModifyMembersMcpToolHandler } from './modify-members-handler.js';
import { UmlModifyNodesMcpToolHandler } from './modify-nodes-handler.js';

export function configureUmlMcpModule(): ContainerModule {
    return new ContainerModule((bind, _unbind, _isBound, rebind) => {
        rebind(McpModelSerializer).to(UmlMcpModelSerializer).inSingletonScope();
        rebind(ElementTypesMcpResourceHandler).to(UmlElementTypesMcpResourceHandler).inSingletonScope();
        rebind(CreateNodesMcpToolHandler).to(UmlCreateNodesMcpToolHandler).inSingletonScope();
        rebind(ModifyNodesMcpToolHandler).to(UmlModifyNodesMcpToolHandler).inSingletonScope();
        rebind(CreateEdgesMcpToolHandler).to(UmlCreateEdgesMcpToolHandler).inSingletonScope();
        rebind(ModifyEdgesMcpToolHandler).to(UmlModifyEdgesMcpToolHandler).inSingletonScope();

        // Theoretically, the `elkLayoutModule` is registered, but it doesn't seem to work for bigUML.
        // -> Error: No constructor is configured in DiagramConfiguration for type uml-label:name
        // However, this is not an issue with the MCP integration.
        // bindAsService(bind, McpToolHandler, RequestLayoutMcpToolHandler);

        bindAsService(bind, McpToolHandler, CreateMembersMcpToolHandler);
        bindAsService(bind, McpToolHandler, ModifyMembersMcpToolHandler);
    });
}
