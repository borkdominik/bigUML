/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VSCodeContext } from '@borkdominik-biguml/big-components';
import { useContext, useEffect, useState, type ReactElement } from 'react';
import { AdvancedSearchActionResponse, RequestAdvancedSearchAction } from '../common/advancedsearch.action.js';


import type { SearchResult } from '../common/searchresult.js';

export function AdvancedSearch(): ReactElement {
    const { clientId, dispatchAction, listenAction } = useContext(VSCodeContext);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        const handler = (action: any) => {
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
    
    
    

    const handleSearch = () => {
        if (!clientId) {
            console.warn('Client ID not available, skipping dispatch.');
            return;
        }

        dispatchAction(RequestAdvancedSearchAction.create({ query }));
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Advanced Search</h2>
            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="e.g. Class:Lecture"
                    style={{ width: '60%', marginRight: '0.5rem' }}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <div>
                {results.length > 0 ? (
                    <ul>
                        {results.map((item, idx) => (
                            <li key={idx}>
                                  <strong>{item.type}</strong>: {item.name}
                                  {item.parentName && <span> (in {item.parentName})</span>}
                                {item.details && <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.details}</div>}
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
