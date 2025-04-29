/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import 'reflect-metadata';

import { VSCodeConnector } from '@borkdominik-biguml/big-components';
import { createRoot } from 'react-dom/client';
import { CodeToClassDiagram } from '../browser/code-to-class-diagram.component.js';

import '../../styles/index.css';

const element = document.getElementById('root');
if (!element) {
    throw new Error('Root element not found!');
}
const root = createRoot(element);
root.render(
    <VSCodeConnector debug={true}>
        <CodeToClassDiagram></CodeToClassDiagram>
    </VSCodeConnector>
);
