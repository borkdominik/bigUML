/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react/index.js';
import { throttle } from 'lodash';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';

export interface BigTextFieldProps {
    label?: string;
    value: string;
    disabled?: boolean;

    onDidChangeValue: (value: string) => void;
}

export function BigTextField(props: BigTextFieldProps): ReactElement {
    const [value, setValue] = useState<string>(props.value);

    const notify = useMemo(() => throttle(props.onDidChangeValue, 500, { trailing: true }), [props]);

    useEffect(() => {
        setValue(props.value);
    }, [props.value])

    const onInput = useCallback<React.KeyboardEventHandler<HTMLElement>>(
        event => {
            const target = event.target as HTMLInputElement;
            setValue(target.value);

        },
        []
    );

    const onKeyDown = useCallback<React.KeyboardEventHandler<HTMLElement>>(
        event => {
            if (event.key === 'Enter') {
                notify?.(value);
            }
        },
        [notify, value]
    );


    const onBlur = useCallback<React.FocusEventHandler<HTMLElement>>(
        () => {
            notify?.(value);
        },
        [notify, value]
    );

    const textField = <VSCodeTextField disabled={props.disabled} onInput={onInput as any} onKeyDown={onKeyDown} onBlur={onBlur} value={value} />

    if (props.label) {
        return (
            <>
                <div className='grid-label'>{props.label}</div>
                <div className='grid-value grid-flex'>
                    {textField}
                </div>
            </>
        );
    }

    return textField;
}
