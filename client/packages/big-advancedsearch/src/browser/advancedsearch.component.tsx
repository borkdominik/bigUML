/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VSCodeContext } from '@borkdominik-biguml/big-components';
import { VSCodeTag, VSCodeTextField } from '@vscode/webview-ui-toolkit/react/index.js';
import { useContext, useEffect, useState, type ReactElement } from 'react';
import { AdvancedSearchActionResponse, RequestAdvancedSearchAction } from '../common/advancedsearch.action.js';

import type { SearchResult } from '../common/searchresult.js';

export function AdvancedSearch(): ReactElement {
    const { clientId, dispatchAction, listenAction } = useContext(VSCodeContext);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);

    /* ────────────────────────────────────────────────────────────────────────── */
    /*  Live-search helper                                                       */
    /* ────────────────────────────────────────────────────────────────────────── */

    const fireSearch = (value: string) => {
        setQuery(value);

        if (clientId) {
            dispatchAction(RequestAdvancedSearchAction.create({ query: value }));
        }
    };

    /* ────────────────────────────────────────────────────────────────────────── */
    /*  Effect: listen for results coming back                                   */
    /* ────────────────────────────────────────────────────────────────────────── */

    useEffect(() => {
        const handler = (action: unknown) => {
            if (AdvancedSearchActionResponse.is(action)) {
                console.log('[AdvancedSearch] Received search results:', action.results);
                setResults(action.results);
            }
        };

        listenAction(handler);

        return () => {
            console.warn('[AdvancedSearch] Cannot remove listener — using one-time handler only');
        };
    }, [listenAction]);

    /* ────────────────────────────────────────────────────────────────────────── */

    return (
        <div className='advanced-search'>
            <div className='advanced-search__controls'>
                <VSCodeTextField
                    className='advanced-search__text'
                    value={query}
                    placeholder='e.g. Class:Lecture'
                    onInput={e => fireSearch((e.target as HTMLInputElement).value)}
                >
                    {/* search icon permanently docked on the left */}
                    <span slot='end' className='codicon codicon-search' />
                </VSCodeTextField>
            </div>

            <div>
                {results.length > 0 ? (
                    <ul className='advanced-search__results'>
                        {results.map((item, idx) => (
                            <li key={idx} className='result-item'>
                                {/* ── header row ── */}
                                <div className='result-item__header'>
                                    <VSCodeTag className='result-item__tag'>{item.type}</VSCodeTag>
                                    <span className='result-item__name'>{item.name}</span>
                                </div>

                                {/* ── details row (optional) ── */}
                                {item.details && <div className='result-item__details'>{item.details}</div>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found.</p>
                )}
            </div>
        </div>
    );
}
