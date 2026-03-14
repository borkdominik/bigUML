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
import { HelloWorldActionResponse, RequestHelloWorldAction } from '../common/index.js';


export function HelloWorld(): ReactElement {
    const { listenAction, dispatchAction } = useContext(VSCodeContext);
    const [count, setCount] = useState(0);

    useEffect(() => {
        listenAction(action => {
            if (HelloWorldActionResponse.is(action)) {
                setCount(action.count);
            }
        });
    }, [listenAction]);

    const increase1 = useCallback(() => {
        dispatchAction(RequestHelloWorldAction.create({ increase: 1 }));
    }, [dispatchAction]);

    const increase5 = useCallback(() => {
        dispatchAction(RequestHelloWorldAction.create({ increase: 5 }));
    }, [dispatchAction]);

    return (
        <div>
            <span>Hello World! {count}</span>
            <button onClick={() => increase1()}>Increase 1</button>
            <button onClick={() => increase5()}>Increase 5</button>
        </div>
    );
}
