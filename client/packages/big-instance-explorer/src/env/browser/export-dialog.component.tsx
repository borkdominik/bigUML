/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { useEffect, useMemo, useState, type CSSProperties, type ReactElement } from 'react';
import type { ClassifierGroup, ExportScope, ExportTemplateSummary, InstanceSummary } from '../common/index.js';
import { checkboxStyle, primaryButtonStyle, withDisabled } from './webview-styles.js';

interface ExportDialogProps {
    classifierGroups: ClassifierGroup[];
    unclassified: InstanceSummary[];
    selectedInstanceIds: string[];
    templates: ExportTemplateSummary[];
    workspaceTemplateDirectory?: string | null;
    result: string;
    statusMessage?: string;
    isSaving: boolean;
    onClose: () => void;
    onExport: (options: {
        scope: ExportScope;
        classifierIds?: string[];
        selection?: string[];
        templateName: string;
        customTemplateFile?: string | null;
    }) => void;
    onSave: (options: { suggestedFileName: string }) => void;
}

export function ExportDialog(props: ExportDialogProps): ReactElement {
    const [templateName, setTemplateName] = useState('json');
    const [scope, setScope] = useState<ExportScope>('all');
    const [classifierIds, setClassifierIds] = useState<string[]>([]);

    const availableInstances = useMemo(
        () => [...props.classifierGroups.flatMap(group => group.instances), ...props.unclassified],
        [props.classifierGroups, props.unclassified]
    );
    const selectedInstances = useMemo(
        () => availableInstances.filter(instance => props.selectedInstanceIds.includes(instance.id)),
        [availableInstances, props.selectedInstanceIds]
    );
    const selectedTemplate = useMemo(
        () => props.templates.find(template => template.name === templateName) ?? props.templates[0],
        [props.templates, templateName]
    );

    useEffect(() => {
        if (props.templates.length === 0) {
            return;
        }
        if (!props.templates.some(template => template.name === templateName)) {
            setTemplateName(props.templates[0].name);
        }
    }, [props.templates, templateName]);

    useEffect(() => {
        if (props.classifierGroups.length === 0) {
            setClassifierIds([]);
            return;
        }
        setClassifierIds(current => (current.length > 0 ? current : [props.classifierGroups[0].classifierId]));
    }, [props.classifierGroups]);

    const selectionDisabled = scope === 'selection' && selectedInstances.length === 0;
    const classifierDisabled = scope === 'byClassifier' && classifierIds.length === 0;
    const exportDisabled = !selectedTemplate || selectionDisabled || classifierDisabled;

    const toggleClassifier = (id: string): void =>
        setClassifierIds(current => (current.includes(id) ? current.filter(value => value !== id) : [...current, id]));

    const handleExport = () => {
        if (!selectedTemplate) {
            return;
        }
        props.onExport({
            scope,
            classifierIds: scope === 'byClassifier' ? classifierIds : undefined,
            selection: scope === 'selection' ? selectedInstances.map(instance => instance.id) : undefined,
            templateName: selectedTemplate.name,
            customTemplateFile: selectedTemplate.file ?? null
        });
    };

    const suggestedFileName = `instances.${selectedTemplate?.extension ?? 'txt'}`;

    return (
        <div style={overlayStyle}>
            <div style={dialogStyle}>
                <div style={headerStyle}>
                    <div>
                        <div style={titleStyle}>Export Instances</div>
                        <div style={subtitleStyle}>Render the current diagram data through a built-in or workspace Eta template.</div>
                    </div>
                    <button onClick={props.onClose} style={closeButtonStyle} type='button'>
                        <span className='codicon codicon-close' />
                    </button>
                </div>

                <div style={bodyStyle}>
                    <label style={fieldStyle}>
                        <span>Template</span>
                        <select value={templateName} onChange={event => setTemplateName(event.target.value)}>
                            {props.templates.map(template => (
                                <option key={`${template.kind}:${template.name}`} value={template.name}>
                                    {template.label} {template.kind === 'workspace' ? '(workspace)' : '(built-in)'}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label style={fieldStyle}>
                        <span>Scope</span>
                        <select value={scope} onChange={event => setScope(event.target.value as ExportScope)}>
                            <option value='all'>All instances</option>
                            <option value='byClassifier'>By classifier</option>
                            <option value='selection'>Current diagram selection</option>
                        </select>
                    </label>

                    {scope === 'byClassifier' ? (
                        <div style={fieldStyle}>
                            <span>Classifiers</span>
                            <div style={classifierPanelStyle}>
                                {props.classifierGroups.length > 0 ? (
                                    props.classifierGroups.map(group => (
                                        <label key={group.classifierId} style={checkboxRowStyle}>
                                            <input
                                                checked={classifierIds.includes(group.classifierId)}
                                                onChange={() => toggleClassifier(group.classifierId)}
                                                style={checkboxStyle}
                                                type='checkbox'
                                            />
                                            <span>
                                                {group.classifierName} ({group.instances.length})
                                            </span>
                                        </label>
                                    ))
                                ) : (
                                    <div style={mutedStyle}>No classifiers available.</div>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {scope === 'selection' ? (
                        <div style={fieldStyle}>
                            <span>Selected instances</span>
                            <div style={selectionPanelStyle}>
                                {selectedInstances.length > 0 ? (
                                    selectedInstances.map(instance => (
                                        <div key={instance.id}>
                                            {instance.classifierName ? `${instance.name} : ${instance.classifierName}` : instance.name}
                                        </div>
                                    ))
                                ) : (
                                    <div>No `InstanceSpecification` is currently selected in the diagram.</div>
                                )}
                            </div>
                        </div>
                    ) : null}

                    <div style={referenceStyle}>
                        <div style={referenceTitleStyle}>Template Reference</div>
                        <div>`it.instances[]`, `it.classifiers[]`, `it.links[]`, `it.diagramName`, `it.timestamp`</div>
                        <div>
                            Each instance exposes `name`, `classifierName`, `classifierId`, and `slots[]` with `featureName`, `value`, and
                            `values[]`.
                        </div>
                        {props.workspaceTemplateDirectory ? (
                            <div>Workspace templates are loaded from `{props.workspaceTemplateDirectory}`.</div>
                        ) : null}
                    </div>

                    {selectedTemplate?.description ? <div style={descriptionStyle}>{selectedTemplate.description}</div> : null}

                    {props.statusMessage ? <div style={statusStyle}>{props.statusMessage}</div> : null}

                    <div style={buttonRowStyle}>
                        <button
                            disabled={exportDisabled}
                            onClick={handleExport}
                            style={withDisabled(primaryButtonStyle, exportDisabled)}
                            type='button'
                        >
                            Render Preview
                        </button>
                        <button
                            disabled={!props.result || props.isSaving}
                            onClick={() => props.onSave({ suggestedFileName })}
                            style={withDisabled(primaryButtonStyle, !props.result || props.isSaving)}
                            type='button'
                        >
                            {props.isSaving ? 'Saving…' : 'Save Export…'}
                        </button>
                    </div>

                    <textarea readOnly style={resultStyle} value={props.result} />
                </div>
            </div>
        </div>
    );
}

const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    zIndex: 10
};

const dialogStyle: CSSProperties = {
    width: 'min(880px, 100%)',
    maxHeight: '90vh',
    overflow: 'auto',
    background: 'var(--vscode-editor-background)',
    color: 'var(--vscode-editor-foreground)',
    border: '1px solid var(--vscode-panel-border)',
    borderRadius: '8px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)'
};

const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '16px 18px',
    borderBottom: '1px solid var(--vscode-panel-border)'
};

const titleStyle: CSSProperties = { fontSize: '16px', fontWeight: 600 };
const subtitleStyle: CSSProperties = { opacity: 0.75, fontSize: '12px', marginTop: '4px' };
const closeButtonStyle: CSSProperties = { background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' };
const bodyStyle: CSSProperties = { display: 'grid', gap: '12px', padding: '18px' };
const fieldStyle: CSSProperties = { display: 'grid', gap: '6px' };
const selectionPanelStyle: CSSProperties = {
    border: '1px solid var(--vscode-panel-border)',
    borderRadius: '4px',
    padding: '10px',
    display: 'grid',
    gap: '4px',
    maxHeight: '140px',
    overflow: 'auto'
};
const referenceStyle: CSSProperties = {
    border: '1px solid var(--vscode-panel-border)',
    borderRadius: '4px',
    padding: '10px',
    display: 'grid',
    gap: '4px',
    fontSize: '12px',
    opacity: 0.9
};
const referenceTitleStyle: CSSProperties = { fontWeight: 600, opacity: 1 };
const descriptionStyle: CSSProperties = { fontSize: '12px', opacity: 0.8 };
const statusStyle: CSSProperties = {
    padding: '8px 10px',
    borderRadius: '4px',
    background: 'var(--vscode-textCodeBlock-background)'
};
const buttonRowStyle: CSSProperties = { display: 'flex', gap: '8px', justifyContent: 'flex-start' };
const resultStyle: CSSProperties = {
    width: '100%',
    minHeight: '280px',
    resize: 'vertical',
    fontFamily: 'var(--vscode-editor-font-family)'
};

const classifierPanelStyle: CSSProperties = {
    border: '1px solid var(--vscode-panel-border)',
    borderRadius: '4px',
    padding: '8px',
    display: 'grid',
    gap: '4px',
    maxHeight: '140px',
    overflow: 'auto'
};

const checkboxRowStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' };
const mutedStyle: CSSProperties = { opacity: 0.7, fontSize: '11px' };
