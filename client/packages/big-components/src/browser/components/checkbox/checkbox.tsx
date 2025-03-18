/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react/index.js';
import { useCallback, useState, type ReactElement } from 'react';

export interface BigCheckboxProps {
    label: string;
    value: boolean;
    disabled?: boolean;

    onDidChangeValue: (value: boolean) => void;
}

export function BigCheckbox(props: BigCheckboxProps): ReactElement {
    const [value, setValue] = useState<boolean>(props.value);

    const onChange = useCallback<((e: Event) => unknown) & React.FormEventHandler<HTMLElement>>(
        event => {
            const target = event.target as HTMLInputElement;
            setValue(target.checked);
            props.onDidChangeValue?.(target.checked);
        },
        [props]
    );

    return (
        <>
            <div className='grid-label'>{props.label}</div>

            <div className='grid-value'>
                <VSCodeCheckbox checked={value} className='bool-item' disabled={props.disabled} onChange={onChange as any} />
            </div>
        </>
    );
}
