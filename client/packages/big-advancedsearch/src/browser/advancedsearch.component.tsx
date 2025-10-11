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
import { HighlightElementActionResponse, RequestHighlightElementAction } from '../common/highlight.action.js';

import type { SearchResult } from '../common/searchresult.js';

export function AdvancedSearch(): ReactElement {
    const { clientId, dispatchAction, listenAction } = useContext(VSCodeContext);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);

    const fireSearch = (value: string) => {
        setQuery(value);
        if (clientId) {
            dispatchAction(RequestAdvancedSearchAction.create({ query: value }));
        }
    };

    const highlight = (semanticUri: string | undefined) => {
        if (!clientId || !semanticUri) {
            return;
        }
        dispatchAction(RequestHighlightElementAction.create({ semanticUri }));
    };

    useEffect(() => {
        const handler = (action: unknown) => {
            if (AdvancedSearchActionResponse.is(action)) {
                setResults(action.results);
            }
            if (HighlightElementActionResponse.is(action)) {
                if (action.ok) {
                    console.log('Element highlighted successfully');
                } else {
                    console.error('Failed to highlight element');
                }
            }
        };
        listenAction(handler);
    }, [listenAction]);

    return (
        <div className='advanced-search'>
            <div className='advanced-search__controls'>
                <VSCodeTextField
                    className='advanced-search__text'
                    value={query}
                    placeholder='e.g. Class:Lecture'
                    onInput={e => fireSearch((e.target as HTMLInputElement).value)}
                >
                    <span slot='end' className='codicon codicon-search' />
                </VSCodeTextField>
            </div>

            <div>
                {results.length > 0 ? (
                    <ul className='advanced-search__results'>
                        {results.map((item, idx) => (
                            <li key={idx} className='result-item' onClick={() => highlight((item as any).semanticUri ?? item.id)}>
                                <div className='result-item__header'>
                                    <VSCodeTag className='result-item__tag'>{item.type}</VSCodeTag>
                                    <span className='result-item__name'>{item.name}</span>
                                </div>
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
