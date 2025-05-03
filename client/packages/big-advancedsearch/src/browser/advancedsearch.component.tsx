/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type ReactElement } from 'react';


export function AdvancedSearch(): ReactElement {

    const notifyConsole = () => {
        console.log("advanced search!")
    };

    return (
        <div>
            <span>Advanced Search!</span>
            <button onClick={() => notifyConsole()}>Notify console</button>
        </div>
    );
}
