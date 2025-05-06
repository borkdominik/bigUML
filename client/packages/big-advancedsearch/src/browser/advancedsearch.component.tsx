/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { messenger } from '@borkdominik-biguml/big-components';
import { type ReactElement, useEffect, useState } from 'react';
import { HOST_EXTENSION } from 'vscode-messenger-common';

export function AdvancedSearch(): ReactElement {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<string[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);

        // Send query as action/request
        messenger.sendNotification(
            { method: 'action/request' },
            HOST_EXTENSION,
            {
                kind: 'RequestAdvancedSearchAction',
                payload: value,
            }
        );

    };

    useEffect(() => {
        // Listen for action responses from backend
        const disposable = messenger.listenNotification(
            { method: 'action/response' },
            (action: any) => {
                if (action.kind === 'AdvancedSearchActionResponse' && action.results) {
                    setResults(action.results);
                }
                
            }
        );

        return () => disposable.dispose();
    }, []);

    return (
        <div style={{ padding: '10px' }}>
            <h3>Advanced Search</h3>
            <input
                type="text"
                placeholder="Enter search pattern..."
                value={query}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
            <ul>
                {results.map((result, index) => (
                    <li key={index}>{result}</li>
                ))}
            </ul>
        </div>
    );
}

