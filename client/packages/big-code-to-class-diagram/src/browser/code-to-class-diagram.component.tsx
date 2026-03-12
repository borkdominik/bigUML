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
import { ChangeLanguageResponseAction, GenerateDiagramRequestAction, RequestChangeLanguageAction, RequestSelectFolderAction, SelectedFolderResponseAction, type Option } from '../common/code-to-class-diagram.action.js';



export function CodeToClassDiagram(): ReactElement {
    const { listenAction, dispatchAction } = useContext(VSCodeContext);
    const [folder, setFolder] = useState<string | null>(null);
    const [fileCount, setFileCount] = useState<number | null>(null);
    const [selectedOption, setSelectedOption] = useState<Option>('Java');

    const handleSelectLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as Option;
        setSelectedOption(value);
        dispatchAction(RequestChangeLanguageAction.create({ language: selectedOption }));
    };

    useEffect(() => {
        listenAction(action => {
            console.log("Action received", action);
            if (SelectedFolderResponseAction.is(action)) {
                setFolder(action.folderPath);
                setFileCount(action.fileCount);
            }
            if (ChangeLanguageResponseAction.is(action)) {
                setFileCount(action.fileCount);
            }
        });
    }, [listenAction]);


    const openFile = useCallback(() => {
        dispatchAction(RequestSelectFolderAction.create());
    }, [dispatchAction]);

    const generateDiagram = useCallback(() => {
        dispatchAction(GenerateDiagramRequestAction.create());
    }, [dispatchAction]);

    return (
        <div>

            <button onClick={() => openFile()}>📁 Select Project Folder</button>
            {folder !== null && (
                <div>
                    <span><strong>Selected Folder:</strong> {folder}</span>
                    <span><strong>Files used for diagram generation:</strong> {fileCount}</span>
                </div>
            )}
            {folder !== null && (
                <div>
                    <br />
                    <label htmlFor="language-select">Choose Project Language: </label>
                    <select id="language-select" value={selectedOption} onChange={handleSelectLanguageChange}>
                        <option value="Java">Java</option>
                    </select>

                    <button onClick={() => generateDiagram()}>Generate Class Diagram</button>
                </div>
            )}
        </div>
    );
}
