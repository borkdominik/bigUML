/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { VSCodeContext } from '@borkdominik-biguml/big-components';
import { AdvancedSearch } from '../browser/advancedsearch.component.js';

function renderWithCtx(ui: JSX.Element, ctx: any) {
    return render(<VSCodeContext.Provider value={ctx}>{ui}</VSCodeContext.Provider>);
}

describe('AdvancedSearch – dispatches search on typing', () => {
    test('fires search action with the typed query', async () => {
        const dispatchAction = vi.fn();
        const listenAction = vi.fn();

        renderWithCtx(<AdvancedSearch />, {
            clientId: 'test-client',
            dispatchAction,
            listenAction
        });

        const input = screen.getByTestId('search-input') as HTMLInputElement;
        expect(input.value).toBe('');

        // Use a user instance (wraps interactions in act under the hood)
        const user = userEvent.setup();
        await user.type(input, 'Class:Lecture');

        // Wait for the controlled input to reflect the state update
        await screen.findByDisplayValue('Class:Lecture');

        // Should have dispatched at least once
        expect(dispatchAction).toHaveBeenCalled();

        // Be flexible about action shape: support payload.query or query
        const lastArg = dispatchAction.mock.calls.at(-1)?.[0] as any;
        const query = lastArg?.payload?.query ?? lastArg?.query;
        expect(query).toBe('Class:Lecture');
    });
});
