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

import { type GLSPMcpServer, ModifyEdgesMcpToolHandler } from '@eclipse-glsp/server-mcp';
import { injectable } from 'inversify';

/**
 * Since neither `ReconnectEdgeOperation` nor `ChangeRoutingPointsOperation` are bound for
 * bigUML, this handler is unnecessary and rather misleads the MCP client.
 * To de-register this tool, an empty handler has to be rebound instead.
 */
@injectable()
export class UmlModifyEdgesMcpToolHandler extends ModifyEdgesMcpToolHandler {
    override registerTool(_server: GLSPMcpServer): void {
        // No implementation
    }
}
