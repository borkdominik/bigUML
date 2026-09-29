/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { loggerFactory } from '@borkdominik-biguml/big-common';
import * as net from 'net';
import * as rpc from 'vscode-jsonrpc/node.js';
import { type AddedSharedModelServices } from './model-module.js';
import { ModelServer } from './model-server.js';

const JSON_SERVER_PORT = 5999;
const JSON_SERVER_HOST = 'localhost';

const logger = loggerFactory('ModelServerLaunch');

/** What the model server needs of the language services: the model service to answer requests with. */
export interface ModelServerContext {
    shared: Pick<AddedSharedModelServices, 'model'>;
}

/**
 * Serves the model over JSON-RPC on a socket, one {@link ModelServer} per connected client.
 *
 * @returns a promise that resolves once the server is shut down, or rejects if it fails
 */
export function startModelServer(services: ModelServerContext): Promise<void> {
    const connections: rpc.MessageConnection[] = [];
    const close = (netServer: net.Server): void => {
        connections.forEach(connection => connection.dispose());
        netServer.close();
    };

    const netServer = net.createServer(socket => {
        const connection = createClientConnection(socket, services);
        connections.push(connection);
    });
    netServer.listen(JSON_SERVER_PORT, JSON_SERVER_HOST);
    netServer.on('listening', () => {
        const addressInfo = netServer.address();
        if (!addressInfo) {
            logger.error('Could not resolve JSON Server address info. Shutting down.');
            close(netServer);
        } else if (typeof addressInfo === 'string') {
            logger.error(`JSON Server is unexpectedly listening to pipe or domain socket "${addressInfo}". Shutting down.`);
            close(netServer);
        } else {
            logger.log(`Startup completed. Accepting requests on port:${addressInfo.port}`);
        }
    });
    netServer.on('error', error => {
        logger.error('JSON server experienced error', error);
        close(netServer);
    });
    return new Promise((resolve, reject) => {
        netServer.on('close', () => resolve());
        netServer.on('error', error => reject(error));
    });
}

function createClientConnection(socket: net.Socket, services: ModelServerContext): rpc.MessageConnection {
    logger.log(`Starting model server connection for client: '${socket.localAddress}'`);
    const connection = rpc.createMessageConnection(new rpc.SocketMessageReader(socket), new rpc.SocketMessageWriter(socket), console);
    const modelServer = new ModelServer(connection, services.shared.model.ModelService);
    connection.onDispose(() => modelServer.dispose());
    socket.on('close', () => modelServer.dispose());
    connection.listen();
    logger.log(`Connecting to client: '${socket.localAddress}'`);
    return connection;
}
