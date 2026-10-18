/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeConnector } from '@borkdominik-biguml/big-components';
import { createRoot } from 'react-dom/client';
import 'reflect-metadata';
import '../../../../styles/transformation-preview.css';
import { TransformationPreview } from '../transformation-preview.component.js';

const element = document.getElementById('root');
if (!element) {
    throw new Error('Root element not found!');
}
const root = createRoot(element);
root.render(
    <VSCodeConnector debug={true}>
        <TransformationPreview />
    </VSCodeConnector>
);
