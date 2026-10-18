/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactElement } from 'react';
import {
    suggestPattern,
    type GeneratableAssociation,
    type GeneratableClassifier,
    type GenerationConfig,
    type GenerationResultSummary,
    type GenerationStrategyKind
} from '../common/index.js';
import { checkboxStyle, primaryButtonStyle, secondaryButtonStyle, withDisabled } from './webview-styles.js';

interface GenerateDialogProps {
    classifiers: GeneratableClassifier[];
    associations: GeneratableAssociation[];
    preview?: GenerationResultSummary;
    onClose: () => void;
    onPreview: (config: GenerationConfig) => void;
    onGenerate: (config: GenerationConfig) => void;
    /** Invoked when the configuration changes so a now-stale preview can be cleared. */
    onConfigChange?: () => void;
}

/**
 * Inline, single-column generation form rendered inside the (narrow) Instances panel.
 * In `pattern` mode each selected classifier gets a collapsible section listing its
 * properties, each with an editable field prefilled by `suggestPattern` (empty = random fallback).
 */
export function GenerateDialog(props: GenerateDialogProps): ReactElement {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [count, setCount] = useState(3);
    const [strategy, setStrategy] = useState<GenerationStrategyKind>('realistic');
    // classifierId -> (property -> edited pattern). Absent => use the suggested default.
    const [patternEdits, setPatternEdits] = useState<Record<string, Record<string, string>>>({});
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [associationDepth, setAssociationDepth] = useState(1);
    // associationId -> chosen existing target instanceId ('' = automatic).
    const [linkTargets, setLinkTargets] = useState<Record<string, string>>({});
    const [linkWithinBatchOnly, setLinkWithinBatchOnly] = useState(false);
    const [seedText, setSeedText] = useState('');

    const effectivePattern = (classifier: GeneratableClassifier, property: string): string =>
        patternEdits[classifier.classifierId]?.[property] ?? suggestPattern(classifier.classifierName, property);

    const config = useMemo<GenerationConfig>(() => {
        let patterns: Record<string, Record<string, string>> | undefined;
        if (strategy === 'pattern') {
            patterns = {};
            for (const classifier of props.classifiers) {
                if (!selectedIds.includes(classifier.classifierId)) {
                    continue;
                }
                const map: Record<string, string> = {};
                for (const property of classifier.properties) {
                    const value = effectivePattern(classifier, property.name).trim();
                    if (value.length > 0) {
                        map[property.name] = value;
                    }
                }
                if (Object.keys(map).length > 0) {
                    patterns[classifier.classifierId] = map;
                }
            }
        }
        let chosenLinkTargets: Record<string, string> | undefined;
        if (associationDepth >= 1) {
            const entries = Object.entries(linkTargets).filter(([, instanceId]) => instanceId.length > 0);
            if (entries.length > 0) {
                chosenLinkTargets = Object.fromEntries(entries);
            }
        }
        return {
            classifierIds: selectedIds,
            countPerClassifier: count,
            strategy,
            patterns,
            associationDepth,
            linkTargets: chosenLinkTargets,
            linkWithinBatchOnly: associationDepth >= 1 ? linkWithinBatchOnly : undefined,
            seed: seedText.trim().length > 0 ? Number(seedText) : undefined
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIds, count, strategy, patternEdits, associationDepth, linkTargets, linkWithinBatchOnly, seedText, props.classifiers]);

    // A preview reflects one specific config; clear it whenever the config changes so the user
    // never sees a dry-run that no longer matches the current selections.
    const firstRender = useRef(true);
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        props.onConfigChange?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config]);

    const classifierName = (id: string): string =>
        props.classifiers.find(classifier => classifier.classifierId === id)?.classifierName ?? id;
    // Associations a selected classifier participates in as a source (directly or via inheritance).
    // Shown even with no existing target instances (e.g. an empty diagram): "Auto" / "within this
    // batch" still create links between generated instances.
    const relevantAssociations = props.associations.filter(association =>
        association.sourceClassifierIds.some(id => selectedIds.includes(id))
    );

    const invalid = selectedIds.length === 0 || count < 1 || (seedText.trim().length > 0 && Number.isNaN(Number(seedText)));

    const toggleClassifier = (id: string): void =>
        setSelectedIds(current => (current.includes(id) ? current.filter(value => value !== id) : [...current, id]));
    const setPattern = (classifierId: string, property: string, value: string): void =>
        setPatternEdits(current => ({ ...current, [classifierId]: { ...current[classifierId], [property]: value } }));

    const selectedClassifiers = props.classifiers.filter(classifier => selectedIds.includes(classifier.classifierId));

    return (
        <section style={cardStyle}>
            <div style={headerStyle}>
                <div style={titleStyle}>Generate Test Data</div>
                <button onClick={props.onClose} style={closeButtonStyle} title='Close' type='button'>
                    <span className='codicon codicon-close' />
                </button>
            </div>
            <div style={subtitleStyle}>Create instances with slot values for the selected classifiers in one undoable step.</div>

            <div style={fieldStyle}>
                <span
                    style={labelStyle}
                    title='Pick the classes/data types to instantiate. Inherited properties are included. With association depth ≥ 2, related classifiers are generated automatically too.'
                >
                    Classifiers
                </span>
                <div style={classifierPanelStyle}>
                    {props.classifiers.length > 0 ? (
                        props.classifiers.map(classifier => (
                            <label key={classifier.classifierId} style={checkboxRowStyle}>
                                <input
                                    checked={selectedIds.includes(classifier.classifierId)}
                                    onChange={() => toggleClassifier(classifier.classifierId)}
                                    style={checkboxStyle}
                                    type='checkbox'
                                />
                                <span>{classifier.classifierName}</span>
                            </label>
                        ))
                    ) : (
                        <div style={mutedStyle}>No instantiable classifiers (Class/DataType) in the diagram.</div>
                    )}
                </div>
            </div>

            <label style={fieldStyle}>
                <span style={labelStyle} title='How many instances to create for each selected classifier.'>
                    Instances per classifier
                </span>
                <input min={1} onChange={event => setCount(Math.max(1, Number(event.target.value) || 1))} type='number' value={count} />
            </label>

            <label style={fieldStyle}>
                <span
                    style={labelStyle}
                    title={
                        'How slot values are produced (applies to every generated classifier):\n' +
                        '• Realistic — Faker values from the field name (name, email, city…), with a type fallback.\n' +
                        '• Random — type-correct dummy values (String/Integer/Boolean/Real/Enumeration).\n' +
                        '• Pattern — your templates per property; unmapped properties fall back to random.\n' +
                        'Note: in Pattern mode, classifiers pulled in by association depth use random (only selected classifiers are configurable).'
                    }
                >
                    Strategy
                </span>
                <select value={strategy} onChange={event => setStrategy(event.target.value as GenerationStrategyKind)}>
                    <option value='realistic'>Realistic (Faker)</option>
                    <option value='random'>Random (type-driven)</option>
                    <option value='pattern'>Pattern (editable per property)</option>
                </select>
            </label>

            {strategy === 'pattern' ? (
                <div style={fieldStyle}>
                    <span style={labelStyle}>
                        Patterns — {'{n}'} = index, {'{pick:a,b,c}'} = random choice; empty = random
                    </span>
                    {selectedClassifiers.length === 0 ? (
                        <div style={mutedStyle}>Select one or more classifiers above to edit their patterns.</div>
                    ) : (
                        selectedClassifiers.map(classifier => {
                            const open = expanded[classifier.classifierId] ?? true;
                            return (
                                <div key={classifier.classifierId} style={patternSectionStyle}>
                                    <button
                                        onClick={() => setExpanded(current => ({ ...current, [classifier.classifierId]: !open }))}
                                        style={patternHeaderStyle}
                                        type='button'
                                    >
                                        <span className={`codicon ${open ? 'codicon-chevron-down' : 'codicon-chevron-right'}`} />
                                        <span>{classifier.classifierName}</span>
                                    </button>
                                    {open ? (
                                        classifier.properties.length > 0 ? (
                                            classifier.properties.map(property => (
                                                <label key={property.name} style={patternRowStyle}>
                                                    <span style={patternPropStyle} title={property.typeName}>
                                                        {property.name}
                                                    </span>
                                                    <input
                                                        onChange={event =>
                                                            setPattern(classifier.classifierId, property.name, event.target.value)
                                                        }
                                                        style={patternInputStyle}
                                                        type='text'
                                                        value={effectivePattern(classifier, property.name)}
                                                    />
                                                </label>
                                            ))
                                        ) : (
                                            <div style={mutedStyle}>No editable properties.</div>
                                        )
                                    ) : null}
                                </div>
                            );
                        })
                    )}
                </div>
            ) : null}

            <label style={fieldStyle}>
                <span style={labelStyle}>Association depth</span>
                <input
                    min={0}
                    onChange={event => setAssociationDepth(Math.max(0, Number(event.target.value) || 0))}
                    type='number'
                    value={associationDepth}
                />
                <span style={hintStyle}>
                    0 = no links · 1 = link the selected classifiers · 2+ = also generate &amp; link related classifiers (e.g. Company at 3
                    ⇒ Employees + Addresses)
                </span>
            </label>

            {associationDepth >= 1 ? (
                <label
                    style={checkboxRowStyle}
                    title='Link the instances generated in this batch to each other instead of to pre-existing instances'
                >
                    <input
                        checked={linkWithinBatchOnly}
                        onChange={event => setLinkWithinBatchOnly(event.target.checked)}
                        style={checkboxStyle}
                        type='checkbox'
                    />
                    <span>Link only within this batch (connect the generated instances to each other)</span>
                </label>
            ) : null}

            {associationDepth >= 1 && !linkWithinBatchOnly && relevantAssociations.length > 0 ? (
                <div style={fieldStyle}>
                    <span style={labelStyle}>Link targets (choose a specific existing instance, or Auto)</span>
                    {relevantAssociations.map(association => (
                        <label key={association.associationId} style={patternRowStyle}>
                            <span
                                style={patternPropStyle}
                                title={`${association.sourceClassifierIds.map(classifierName).join(', ')} → ${classifierName(association.targetClassifierId)}`}
                            >
                                {association.associationName}
                            </span>
                            <select
                                onChange={event =>
                                    setLinkTargets(current => ({ ...current, [association.associationId]: event.target.value }))
                                }
                                style={patternInputStyle}
                                value={linkTargets[association.associationId] ?? ''}
                            >
                                <option value=''>Auto (random eligible)</option>
                                {association.targets.map(target => (
                                    <option key={target.instanceId} value={target.instanceId}>
                                        {target.instanceName}
                                    </option>
                                ))}
                            </select>
                        </label>
                    ))}
                </div>
            ) : null}

            <label style={fieldStyle}>
                <span
                    style={labelStyle}
                    title='Same seed + same configuration ⇒ identical output (values, {pick} choices, link selection). Leave blank for fresh-random each run.'
                >
                    Seed (optional, for reproducible output)
                </span>
                <input onChange={event => setSeedText(event.target.value)} placeholder='e.g. 42' type='text' value={seedText} />
            </label>

            <div style={buttonRowStyle}>
                <button
                    disabled={invalid}
                    onClick={() => props.onPreview(config)}
                    style={withDisabled(primaryButtonStyle, invalid)}
                    type='button'
                >
                    Preview
                </button>
                <button
                    disabled={invalid}
                    onClick={() => props.onGenerate(config)}
                    style={withDisabled(primaryButtonStyle, invalid)}
                    type='button'
                >
                    Generate
                </button>
                <button onClick={props.onClose} style={secondaryButtonStyle} type='button'>
                    Cancel
                </button>
            </div>

            {props.preview ? (
                <div style={previewStyle}>
                    <div style={previewTitleStyle}>Preview (dry-run, nothing applied)</div>
                    <div>
                        {props.preview.instanceCount} instance(s), {props.preview.slotCount} slot(s), {props.preview.linkCount} link(s).
                    </div>
                    {props.preview.perClassifier.length > 0 ? (
                        <div style={hintStyle}>
                            {props.preview.perClassifier.map(entry => `${entry.classifierName}: ${entry.instanceCount}`).join(' · ')}
                        </div>
                    ) : null}
                    {props.preview.sample.length > 0
                        ? props.preview.perClassifier
                              .map(entry => ({
                                  entry,
                                  samples: props.preview!.sample.filter(instance => instance.classifierName === entry.classifierName)
                              }))
                              .filter(group => group.samples.length > 0)
                              .map(group => (
                                  <div key={group.entry.classifierName} style={sampleListStyle}>
                                      <div style={hintStyle}>
                                          {group.entry.classifierName} — showing {group.samples.length} of {group.entry.instanceCount}
                                      </div>
                                      {group.samples.map((instance, index) => (
                                          <div key={`${instance.name}-${index}`} style={sampleInstanceStyle}>
                                              <div style={sampleHeaderStyle}>
                                                  {instance.name} : {instance.classifierName}
                                              </div>
                                              {instance.slots.map((slot, slotIndex) => (
                                                  <div key={`${slot.feature}-${slotIndex}`} style={sampleSlotStyle}>
                                                      {slot.feature} = {slot.value}
                                                  </div>
                                              ))}
                                          </div>
                                      ))}
                                  </div>
                              ))
                        : null}
                    {props.preview.diagnostics.length > 0 ? (
                        <ul style={diagnosticsListStyle}>
                            {props.preview.diagnostics.map((diagnostic, index) => (
                                <li key={`${diagnostic.code}-${index}`}>
                                    [{diagnostic.severity}] {diagnostic.message}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div style={mutedStyle}>No diagnostics.</div>
                    )}
                </div>
            ) : null}
        </section>
    );
}

const cardStyle: CSSProperties = {
    display: 'grid',
    gap: '10px',
    margin: '8px',
    padding: '12px',
    border: '1px solid var(--vscode-panel-border)',
    borderRadius: '6px',
    background: 'var(--vscode-editorWidget-background, var(--vscode-editor-background))'
};
const headerStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' };
const titleStyle: CSSProperties = { fontSize: '13px', fontWeight: 600 };
const subtitleStyle: CSSProperties = { opacity: 0.75, fontSize: '11px', marginTop: '-4px' };
const closeButtonStyle: CSSProperties = { background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 };
const fieldStyle: CSSProperties = { display: 'grid', gap: '4px' };
const labelStyle: CSSProperties = { fontSize: '11px', opacity: 0.85 };
const hintStyle: CSSProperties = { fontSize: '10px', opacity: 0.6 };
const mutedStyle: CSSProperties = { opacity: 0.7, fontSize: '11px' };
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
const patternSectionStyle: CSSProperties = {
    border: '1px solid var(--vscode-panel-border)',
    borderRadius: '4px',
    padding: '6px',
    display: 'grid',
    gap: '4px'
};
const patternHeaderStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'transparent',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    padding: 0,
    fontSize: '12px',
    fontWeight: 600
};
const patternRowStyle: CSSProperties = { display: 'grid', gridTemplateColumns: '40% 60%', alignItems: 'center', gap: '6px' };
const patternPropStyle: CSSProperties = { fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const patternInputStyle: CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'var(--vscode-editor-font-family)',
    fontSize: '11px'
};
const buttonRowStyle: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: '6px' };
const previewStyle: CSSProperties = {
    border: '1px solid var(--vscode-panel-border)',
    borderRadius: '4px',
    padding: '8px',
    display: 'grid',
    gap: '6px',
    fontSize: '11px'
};
const previewTitleStyle: CSSProperties = { fontWeight: 600 };
const sampleListStyle: CSSProperties = { display: 'grid', gap: '6px', maxHeight: '220px', overflow: 'auto' };
const sampleInstanceStyle: CSSProperties = { display: 'grid', gap: '1px' };
const sampleHeaderStyle: CSSProperties = { fontWeight: 600, textDecoration: 'underline' };
const sampleSlotStyle: CSSProperties = { paddingLeft: '10px', fontFamily: 'var(--vscode-editor-font-family)' };
const diagnosticsListStyle: CSSProperties = { margin: 0, paddingLeft: '16px', display: 'grid', gap: '2px' };
