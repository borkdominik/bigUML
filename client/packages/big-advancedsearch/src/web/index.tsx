/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeConnector } from '@borkdominik-biguml/big-components';

import { createRoot } from 'react-dom/client';
import 'reflect-metadata';
import { AdvancedSearch } from '../browser/advancedsearch.component.js';

import '@vscode/webview-ui-toolkit';
import '../../styles/index.css';

const element = document.getElementById('root');
if (!element) {
    throw new Error('Root element not found!');
}
const root = createRoot(element);
root.render(
    <VSCodeConnector debug={true}>
        <AdvancedSearch></AdvancedSearch>
    </VSCodeConnector>
);
