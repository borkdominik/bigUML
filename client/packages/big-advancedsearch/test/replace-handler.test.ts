/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import 'reflect-metadata';

import { describe, expect, it, vi } from 'vitest';
import { ReplaceActionResponse, RequestReplaceAction } from '../src/env/common/replace.action.js';
import { ReplaceActionHandler } from '../src/env/glsp-server/replace.handler.js';

interface HandlerFixture {
    handler: ReplaceActionHandler;
    sendModelPatch: ReturnType<typeof vi.fn>;
    submitModel: ReturnType<typeof vi.fn>;
}

function createHandler(options?: {
    nodes?: Record<string, any>;
    paths?: Record<string, string>;
    sendModelPatch?: (patch: string) => Promise<void>;
}): HandlerFixture {
    const nodes = options?.nodes ?? {};
    const paths = options?.paths ?? {};
    const sendModelPatch = vi.fn(options?.sendModelPatch ?? (async () => {}));
    const submitModel = vi.fn(async () => []);

    const handler = new ReplaceActionHandler();
    Object.assign(handler, {
        modelState: {
            index: {
                findIdElement: (id: string) => nodes[id],
                findPath: (id: string) => paths[id]
            },
            sendModelPatch
        },
        modelSubmissionHandler: { submitModel },
        // Minimal stand-in for the GLSP command stack: execute the command and
        // let failures propagate, like DefaultCommandStack does.
        commandStack: { execute: async (cmd: { execute(): Promise<void> }) => cmd.execute() }
    });

    return { handler, sendModelPatch, submitModel };
}

function responseOf(actions: any[]): ReplaceActionResponse {
    const response = actions.find(a => ReplaceActionResponse.is(a));
    expect(response).toBeDefined();
    return response;
}

function request(overrides: Partial<Parameters<typeof RequestReplaceAction.create>[0]>): RequestReplaceAction {
    return RequestReplaceAction.create({
        elementIds: ['e1'],
        searchPattern: 'User',
        replaceWith: 'Customer',
        ...overrides
    });
}

describe('ReplaceActionHandler', () => {
    it('rejects an empty find pattern', async () => {
        const { handler, sendModelPatch } = createHandler();
        const response = responseOf(await handler.execute(request({ searchPattern: '' })));
        expect(response.ok).toBe(false);
        expect(response.error).toMatch(/must not be empty/i);
        expect(sendModelPatch).not.toHaveBeenCalled();
    });

    it('rejects unsafe property names', async () => {
        const { handler } = createHandler();
        const response = responseOf(await handler.execute(request({ property: 'a/b' })));
        expect(response.ok).toBe(false);
        expect(response.error).toMatch(/invalid property/i);
    });

    it('reports a row error for unknown elements', async () => {
        const { handler } = createHandler();
        const response = responseOf(await handler.execute(request({})));
        expect(response.ok).toBe(true);
        expect(response.results).toEqual([expect.objectContaining({ id: 'e1', success: false, error: 'Element not found' })]);
    });

    it('reports a row error for non-string properties', async () => {
        const { handler } = createHandler({
            nodes: { e1: { name: 42 } },
            paths: { e1: '/entities/0' }
        });
        const response = responseOf(await handler.execute(request({})));
        expect(response.results?.[0]).toMatchObject({ success: false, changed: false });
        expect(response.results?.[0].error).toMatch(/not a string/i);
    });

    it('marks rows without a match as successful no-ops and sends no patch', async () => {
        const { handler, sendModelPatch } = createHandler({
            nodes: { e1: { name: 'Order' } },
            paths: { e1: '/entities/0' }
        });
        const response = responseOf(await handler.execute(request({})));
        expect(response.ok).toBe(true);
        expect(response.results?.[0]).toMatchObject({ success: true, changed: false, oldValue: 'Order', newValue: 'Order' });
        expect(sendModelPatch).not.toHaveBeenCalled();
    });

    it('patches matching rows and submits with reason "operation"', async () => {
        const { handler, sendModelPatch, submitModel } = createHandler({
            nodes: { e1: { name: 'UserService' }, e2: { name: 'userRepo' } },
            paths: { e1: '/entities/0', e2: '/entities/1' }
        });
        const response = responseOf(await handler.execute(request({ elementIds: ['e1', 'e2'] })));

        expect(response.ok).toBe(true);
        expect(response.results).toEqual([
            expect.objectContaining({ id: 'e1', success: true, changed: true, newValue: 'CustomerService' }),
            // Case-insensitive by default: 'userRepo' matches 'User' too.
            expect.objectContaining({ id: 'e2', success: true, changed: true, newValue: 'CustomerRepo' })
        ]);
        expect(sendModelPatch).toHaveBeenCalledTimes(1);
        expect(JSON.parse(sendModelPatch.mock.calls[0][0])).toEqual([
            { op: 'replace', path: '/entities/0/name', value: 'CustomerService' },
            { op: 'replace', path: '/entities/1/name', value: 'CustomerRepo' }
        ]);
        expect(submitModel).toHaveBeenCalledWith('operation');
    });

    it('honors caseSensitive = true', async () => {
        const { handler } = createHandler({
            nodes: { e1: { name: 'userService' } },
            paths: { e1: '/entities/0' }
        });
        const response = responseOf(await handler.execute(request({ caseSensitive: true })));
        expect(response.results?.[0]).toMatchObject({ changed: false });
    });

    it('rejects rows whose replacement would clear the value', async () => {
        const { handler, sendModelPatch } = createHandler({
            nodes: { e1: { name: 'User' } },
            paths: { e1: '/entities/0' }
        });
        const response = responseOf(await handler.execute(request({ replaceWith: '' })));
        expect(response.results?.[0]).toMatchObject({ success: false, changed: false });
        expect(response.results?.[0].error).toMatch(/clear the value/i);
        expect(sendModelPatch).not.toHaveBeenCalled();
    });

    it('answers ok:false when the model patch fails', async () => {
        const { handler, submitModel } = createHandler({
            nodes: { e1: { name: 'User' } },
            paths: { e1: '/entities/0' },
            sendModelPatch: async () => {
                throw new Error('patch rejected by model server');
            }
        });
        const response = responseOf(await handler.execute(request({})));
        expect(response.ok).toBe(false);
        expect(response.error).toMatch(/patch rejected/i);
        expect(submitModel).not.toHaveBeenCalled();
    });
});
