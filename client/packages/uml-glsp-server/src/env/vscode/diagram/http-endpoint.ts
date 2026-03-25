/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { ActionDispatcher, CreateNodeOperation } from '@eclipse-glsp/server';
import { inject, injectable, postConstruct } from 'inversify';
import * as http from 'node:http';

let FREE_PORT = 8080;

@injectable()
export class HttpEndpoint {
    @inject(ActionDispatcher) protected actionDispatcher: ActionDispatcher;

    protected server?: http.Server;

    @postConstruct()
    protected init(): void {
        try {
            const port = FREE_PORT++;
            this.server = http.createServer((req, res) => this.handleRequest(req, res));
            this.server.listen(port, '127.0.0.1', () => {
                const address = this.server!.address();

                console.log(`[HttpEndpoint] Listening on`, address);
            });
        } catch (error) {
            console.error('Error starting HTTP server:', error);
        }
    }

    protected handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
        if (req.method === 'POST' && req.url === '/api/createNode') {
            this.createNode(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not found' }));
        }
    }

    protected createNode(req: http.IncomingMessage, res: http.ServerResponse): void {
        let body = '';
        req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const operation = CreateNodeOperation.create('class__Class', { location: { x: 0, y: 0 } });
                await this.actionDispatcher.dispatch(operation);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: String(error) }));
            }
        });
    }
}
