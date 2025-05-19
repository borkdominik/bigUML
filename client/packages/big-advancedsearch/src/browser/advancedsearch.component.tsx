/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VSCodeContext } from '@borkdominik-biguml/big-components';
import { useCallback, useContext, useEffect, useState, type ReactElement } from 'react';
import { AdvancedSearchActionResponse, RequestAdvancedSearchAction } from '../common/advancedsearch.action.js';

interface SearchResult {
    id: string;
    type: string;
    name: string;
    parentName?: string;
    details?: string;
}

export function AdvancedSearch(): ReactElement {
    const { dispatchAction, listenAction } = useContext(VSCodeContext);
    const [model, setModel] = useState<any>(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        listenAction(action => {
            if (AdvancedSearchActionResponse.is(action)) {
                console.log('Received model in webview:', action.model);
                setModel(action.model);
            }
        });
    }, [listenAction]);

    const handleSearch = useCallback(() => {
        if (!model?.packagedElement) return;

        const normalized: SearchResult[] = [];

        for (const element of model.packagedElement) {
            const baseType = element.eClass?.split('#//')[1];

            if (!element.name) continue;

            // Add top-level element
            normalized.push({
                id: element.id,
                type: baseType,
                name: element.name
            });

            // Add ownedAttributes
            if (element.ownedAttribute) {
                for (const attr of element.ownedAttribute) {
                    normalized.push({
                        id: attr.id,
                        type: 'Attribute',
                        name: attr.name,
                        parentName: element.name,
                        details: `In ${baseType} ${element.name}`
                    });
                }
            }

            // Add ownedOperations
            if (element.ownedOperation) {
                for (const op of element.ownedOperation) {
                    normalized.push({
                        id: op.id,
                        type: 'Operation',
                        name: op.name,
                        parentName: element.name,
                        details: `In ${baseType} ${element.name}`
                    });
                }
            }

            // Add Enumeration literals
            if (element.ownedLiteral) {
                for (const lit of element.ownedLiteral) {
                    normalized.push({
                        id: lit.id,
                        type: 'Literal',
                        name: lit.name,
                        parentName: element.name,
                        details: `In Enumeration ${element.name}`
                    });
                }
            }
        }

        // Parse search query like "Class:Lecture"
        const [rawType, rawPattern] = query.split(':');
        const type = rawType?.trim().toLowerCase();
        const pattern = rawPattern?.trim().toLowerCase();

        const filtered = normalized.filter(item => {
            const matchesType = !type || item.type.toLowerCase().includes(type);
            const matchesPattern = !pattern || item.name?.toLowerCase().includes(pattern);
            return matchesType && matchesPattern;
        });

        setResults(filtered);
    }, [query, model]);

    const handleFetchModel = useCallback(() => {
        dispatchAction(RequestAdvancedSearchAction.create({ increase: 1 }));
    }, [dispatchAction]);

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
                <button onClick={handleFetchModel} style={{ marginLeft: '0.5rem' }}>Reload Model</button>
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
