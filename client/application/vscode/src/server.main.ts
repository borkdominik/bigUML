/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 * Copyright (c) 2023 CrossBreeze.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import 'reflect-metadata';

import { advancedSearchGlspModule } from '@borkdominik-biguml/big-advancedsearch/glsp-server';
import { outlineModule } from '@borkdominik-biguml/big-outline/glsp-server';
import { propertyPaletteModule } from '@borkdominik-biguml/big-property-palette/glsp-server';
import { startGLSPServer } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { createUmlDiagramServices, startModelServer } from '@borkdominik-biguml/uml-model-server';
import { startLanguageServer } from 'langium';
import { NodeFileSystem } from 'langium/node';
import { createConnection, ProposedFeatures } from 'vscode-languageserver/node.js';

/**
 * This module will be spawned as a separate language server process by the 'extension.ts'.
 * In the extension it is declared as 'server.main'.
 *
 * This module does the following:
 * - Establishing the connection with the language client that is running in the extension
 * - Create a Langium-based language server that fulfills the language server protocol based on that connection
 * - Create a Node-based GLSP server that can access the language server directly and runs on a dedicated port
 * - Create a RPC-based model server that exposes an API to access the Langium AST/semantic model on a dedicated port, e.g., for form-access
 */

// Create a connection to the client
const connection = createConnection(ProposedFeatures.all);

// Inject the shared services and language-specific services
const { shared, UmlDiagram } = createUmlDiagramServices({
    connection,
    ...NodeFileSystem
});

// Start the language server with the shared services
startLanguageServer(shared);

shared.workspace.WorkspaceManager.onWorkspaceInitialized(workspaceFolders => {
    // Start the graphical language server with the shared services
    startGLSPServer({ shared, language: UmlDiagram }, [propertyPaletteModule, outlineModule, advancedSearchGlspModule]);
    // Start the JSON server with the shared services
    startModelServer({ shared, language: UmlDiagram }, workspaceFolders[0]);
});
