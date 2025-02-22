/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { throttle } from 'lodash';
import { useCallback, useMemo, useState, type ReactElement } from 'react';

export interface BigTextFieldProps {
    label: string;
    value: string;
    disabled?: boolean;

    onDidChangeValue: (value: string) => void;
}

export function BigTextField(props: BigTextFieldProps): ReactElement {
    const [value, setValue] = useState<string>(props.value);

    const notify = useMemo(() => throttle(props.onDidChangeValue, 500, { trailing: true }), [props]);

    const onInput = useCallback<((e: Event) => unknown) & React.FormEventHandler<HTMLElement>>(
        event => {
            const target = event.target as HTMLInputElement;
            setValue(target.value);
            notify?.(target.value);
        },
        [notify]
    );

    return (
        <>
            <div className='grid-label'>{props.label}</div>
            <div className='grid-value grid-flex'>
                <VSCodeTextField disabled={props.disabled} onInput={onInput} value={value} />
            </div>
        </>
    );
}
