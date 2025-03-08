/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react/index.js';
import { useCallback, useState, type ReactElement } from 'react';

export interface BigDropdownProps {
    label: string;
    disabled?: boolean;

    choice: string;
    choices: { label: string; value: string; secondaryText?: string }[];

    onDidChangeValue: (value: string) => void;
}

export function BigDropdown(props: BigDropdownProps): ReactElement {
    const [value, setValue] = useState<string>(props.choice);

    const onChange = useCallback<((e: Event) => unknown) & React.FormEventHandler<HTMLElement>>(
        event => {
            const target = event.target as HTMLInputElement;
            setValue(target.value);
            props.onDidChangeValue?.(target.value);
        },
        [props]
    );

    return (
        <>
            <div className='grid-label'>{props.label}</div>

            <div className='grid-value grid-flex'>
                <VSCodeDropdown disabled={props.disabled} onChange={onChange} value={value}>
                    <div slot='selected-value'>{props.choices.find(c => c.value === props.choice)?.label}</div>

                    {props.choices.map(choice => (
                        <VSCodeOption key={choice.value} value={choice.value}>
                            <div className='dropdown-option'>
                                <span>{choice.label}</span>

                                {choice.secondaryText ? <small>{choice.secondaryText}</small> : null}
                            </div>
                        </VSCodeOption>
                    ))}
                </VSCodeDropdown>
            </div>
        </>
    );
}
