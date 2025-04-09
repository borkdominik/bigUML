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
import { RequestCodeGenerationAction, RequestSelectTemplateFileAction, SelectTemplateFileActionResponse } from '../common/index.js';
import { type CodeGenerationOptions, type JavaCodeGenerationOptions } from '../types/config.js';
import { JavaCodeGenerationConfig } from './config-java.component.js';

export function CodeGeneration(): ReactElement {
    const { listenAction, dispatchAction } = useContext(VSCodeContext);
    const [language, setLanguage] = useState<string>('java');
    const [javaOptions, setJavaOptions] = useState<JavaCodeGenerationOptions>({
        folder: null,
        multiple: false
    });
    const [options, setOptions] = useState<CodeGenerationOptions>({
        templateFile: null
    });
    const [isGenerationDisabled, setIsGenerationDisabled] = useState(true);

    useEffect(() => {
        listenAction(action => {
            if (SelectTemplateFileActionResponse.is(action)) {
                setOptions({ templateFile: action.file });
            }
        });
    }, [listenAction, setOptions]);

    const selectTemplateFile = () => {
        dispatchAction(RequestSelectTemplateFileAction.create({}));
    };

    const generateCode = useCallback(() => {
        dispatchAction(
            RequestCodeGenerationAction.create({
                options: options,
                language,
                languageOptions: javaOptions,
            })
        );
    }, [dispatchAction, language, javaOptions, options]);

    const handleLanguageChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
    }, []);

    return (
        <div>
            <div style={{ marginBottom: '8px' }}>
                <label htmlFor="language-select" style={{ marginRight: '8px' }}>Language:</label>
                <select id="language-select" value={language} onChange={handleLanguageChange}>
                    <option value="java">Java</option>
                </select>
            </div>
            <div style={{ marginBottom: '8px' }}>
                <span>Selected TemplateFile: {options.templateFile ?? 'Default'}</span>
                <button onClick={selectTemplateFile} style={{ marginLeft: '8px' }}>Select Template File</button>
            </div>
            {language === 'java' && (
                <JavaCodeGenerationConfig
                    options={javaOptions}
                    setOptions={setJavaOptions}
                    setIsGenerationDisabled={setIsGenerationDisabled}
                />
            )}
            <div>
                <button onClick={generateCode} style={{ marginLeft: '8px' }} disabled={isGenerationDisabled}>Generate</button>
            </div>
        </div>
    );
}
