/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VSCodeContext } from '@borkdominik-biguml/big-components';
import { UpdateOperation } from '@borkdominik-biguml/uml-glsp-server';
import { CenterAction, DeleteElementOperation, SelectAction, SelectAllAction } from '@eclipse-glsp/protocol';
import { useContext, useEffect, useState, type ChangeEvent, type KeyboardEvent, type ReactElement } from 'react';
import {
    AvailableExportTemplatesResponse,
    CreateClassifierInstanceOperation,
    CreateInstanceLinkOperation,
    ExportInstancesNotification,
    ExportInstancesResponse,
    GeneratableClassifiersResponse,
    GenerateInstancesOperation,
    GenerateInstancesPreviewResponse,
    InstanceExplorerDataResponse,
    RequestExportInstancesAction,
    RequestGeneratableClassifiersAction,
    RequestGenerateInstancesPreviewAction,
    RequestSaveExportedInstancesAction,
    SaveExportedInstancesResponse,
    UpdateInstanceLinkEndOperation,
    UpdateInstanceSlotValuesOperation,
    type AvailableAssociation,
    type AvailableForInstantiation,
    type AvailableInstanceLink,
    type ClassifierGroup,
    type ClassifierType,
    type DiagnosticSummary,
    type EligibleInstance,
    type ExportTemplateSummary,
    type GeneratableAssociation,
    type GeneratableClassifier,
    type GenerationConfig,
    type GenerationResultSummary,
    type InstanceLinkSummary,
    type InstanceSummary,
    type ManyToManyRelationSection,
    type SlotSummary
} from '../common/index.js';
import { ExportDialog } from './export-dialog.component.js';
import { GenerateDialog } from './generate-dialog.component.js';

type EditTarget = 'slot' | 'instance' | 'classifier';

interface EditState {
    kind: EditTarget;
    targetId: string;
    value: string;
}

interface LinkEditState {
    linkId: string;
    end: 'source' | 'target';
}

interface CreateLinkState {
    associationId: string;
    sourceId: string;
    targetId: string;
    /** When set, the named end is locked (its dropdown is hidden); used for instance-anchored creation. */
    fixed?: 'source' | 'target';
    /** When set, the picker is rendered under this instance row only. */
    anchorInstanceId?: string;
}

const AVAILABLE_SECTION_KEY = '__available_to_instantiate__';

export function InstanceExplorer(): ReactElement {
    const { clientId, dispatchAction, listenAction, listenNotification } = useContext(VSCodeContext);
    const [classifierGroups, setClassifierGroups] = useState<ClassifierGroup[]>([]);
    const [unclassified, setUnclassified] = useState<InstanceSummary[]>([]);
    const [manyToManyRelations, setManyToManyRelations] = useState<ManyToManyRelationSection[]>([]);
    const [availableForInstantiation, setAvailableForInstantiation] = useState<AvailableForInstantiation>({
        classifiers: [],
        associations: []
    });
    const [searchText, setSearchText] = useState('');
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [expandedInstances, setExpandedInstances] = useState<Record<string, boolean>>({});
    const [editState, setEditState] = useState<EditState | undefined>();
    const [linkEditState, setLinkEditState] = useState<LinkEditState | undefined>();
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [selectedDiagramInstanceIds, setSelectedDiagramInstanceIds] = useState<string[]>([]);
    const [templates, setTemplates] = useState<ExportTemplateSummary[]>([]);
    const [workspaceTemplateDirectory, setWorkspaceTemplateDirectory] = useState<string | null>(null);
    const [exportResult, setExportResult] = useState('');
    const [exportStatusMessage, setExportStatusMessage] = useState<string | undefined>();
    const [isSavingExport, setIsSavingExport] = useState(false);
    const [createLinkState, setCreateLinkState] = useState<CreateLinkState | undefined>();
    const [selectedInstanceId, setSelectedInstanceId] = useState<string | undefined>();
    const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
    const [generatePreview, setGeneratePreview] = useState<GenerationResultSummary | undefined>();
    const [generatableClassifiers, setGeneratableClassifiers] = useState<GeneratableClassifier[]>([]);
    const [generatableAssociations, setGeneratableAssociations] = useState<GeneratableAssociation[]>([]);

    useEffect(() => {
        listenAction(action => {
            if (!InstanceExplorerDataResponse.is(action)) {
                if (AvailableExportTemplatesResponse.is(action)) {
                    setTemplates(action.templates);
                    setWorkspaceTemplateDirectory(action.workspaceTemplateDirectory ?? null);
                    return;
                }

                if (ExportInstancesResponse.is(action)) {
                    if (action.success) {
                        setExportResult(action.content ?? '');
                    }
                    setExportStatusMessage(action.success ? 'Preview rendered successfully.' : (action.message ?? 'Export failed.'));
                    return;
                }

                if (SaveExportedInstancesResponse.is(action)) {
                    setIsSavingExport(false);
                    setExportStatusMessage(
                        action.success ? `Export saved to ${action.filePath}.` : (action.message ?? 'Could not save export.')
                    );
                    return;
                }

                if (GenerateInstancesPreviewResponse.is(action)) {
                    setGeneratePreview(action.summary);
                    return;
                }

                if (GeneratableClassifiersResponse.is(action)) {
                    setGeneratableClassifiers(action.classifiers);
                    setGeneratableAssociations(action.associations);
                    return;
                }

                return;
            }

            setClassifierGroups(action.classifierGroups);
            setUnclassified(action.unclassified);
            setManyToManyRelations(action.manyToManyRelations ?? []);
            setAvailableForInstantiation(action.availableForInstantiation ?? { classifiers: [], associations: [] });
            // The diagram/model just changed (e.g. a different .uml was opened): drop transient state
            // that referenced the previous diagram so nothing stale is shown. The generatable
            // classifiers are refreshed by the provider (see requestData), so they replace themselves.
            setGeneratePreview(undefined);
            setEditState(undefined);
            setLinkEditState(undefined);
            setSelectedInstanceId(undefined);
        });
    }, [listenAction]);

    useEffect(() => {
        listenNotification(ExportInstancesNotification.OpenDialog, () => {
            setIsExportDialogOpen(true);
            setExportStatusMessage(undefined);
        });
        listenNotification(ExportInstancesNotification.SelectionChanged, params => {
            setSelectedDiagramInstanceIds(params?.selectedElementIds ?? []);
        });
    }, [listenNotification]);

    useEffect(() => {
        setExpandedGroups(current => {
            const next = { ...current };
            for (const group of classifierGroups) {
                if (next[group.classifierId] === undefined) {
                    next[group.classifierId] = true;
                }
            }
            for (const section of manyToManyRelations) {
                if (next[section.id] === undefined) {
                    next[section.id] = true;
                }
            }
            if (unclassified.length > 0 && next.unclassified === undefined) {
                next.unclassified = true;
            }
            const hasAvailable = availableForInstantiation.classifiers.length > 0 || availableForInstantiation.associations.length > 0;
            if (hasAvailable && next[AVAILABLE_SECTION_KEY] === undefined) {
                next[AVAILABLE_SECTION_KEY] = true;
            }
            return next;
        });

        setExpandedInstances(current => {
            const next = { ...current };
            for (const instance of flattenInstances(classifierGroups, unclassified)) {
                if (next[instance.id] === undefined) {
                    next[instance.id] = false;
                }
            }
            return next;
        });
    }, [classifierGroups, unclassified, manyToManyRelations, availableForInstantiation]);

    useEffect(() => {
        if (!createLinkState) {
            return;
        }
        // Instance-anchored creates live on a specific instance's availableLinks list.
        if (createLinkState.anchorInstanceId) {
            const anchor = flattenInstances(classifierGroups, unclassified).find(
                instance => instance.id === createLinkState.anchorInstanceId
            );
            const stillAvailable = anchor?.availableLinks.some(
                a => a.associationId === createLinkState.associationId && a.end === createLinkState.fixed
            );
            if (!stillAvailable) {
                setCreateLinkState(undefined);
            }
            return;
        }
        const stillAvailable = availableForInstantiation.associations.some(a => a.associationId === createLinkState.associationId);
        const stillM2m = manyToManyRelations.some(section => section.id === createLinkState.associationId);
        if (!stillAvailable && !stillM2m) {
            setCreateLinkState(undefined);
        }
    }, [createLinkState, availableForInstantiation, manyToManyRelations, classifierGroups, unclassified]);

    useEffect(() => {
        if (!selectedInstanceId) {
            return;
        }
        const stillExists = flattenInstances(classifierGroups, unclassified).some(instance => instance.id === selectedInstanceId);
        if (!stillExists) {
            setSelectedInstanceId(undefined);
        }
    }, [selectedInstanceId, classifierGroups, unclassified]);

    const query = searchText.trim().toLowerCase();
    const filteredGroups = filterGroups(classifierGroups, query);
    const filteredUnclassified = filterInstances(unclassified, query);
    const totalInstances = classifierGroups.reduce((sum, group) => sum + group.instances.length, 0) + unclassified.length;

    const navigateTo = (elementId: string | undefined) => {
        if (!clientId || !elementId) {
            return;
        }

        dispatchAction(SelectAllAction.create(false));
        dispatchAction(SelectAction.create({ selectedElementsIDs: [elementId] }));
        dispatchAction(CenterAction.create([elementId]));
    };

    const selectInstance = (instanceId: string) => {
        setSelectedInstanceId(instanceId);
        navigateTo(instanceId);
    };

    const handleRootKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape' && selectedInstanceId) {
            setSelectedInstanceId(undefined);
            return;
        }
        if (event.key !== 'Delete') {
            return;
        }
        // Don't intercept Delete while the user is editing a text field, dropdown, etc.
        const target = event.target as HTMLElement | null;
        if (target) {
            const tag = target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) {
                return;
            }
        }
        if (!selectedInstanceId || !clientId) {
            return;
        }
        event.preventDefault();
        dispatchAction(DeleteElementOperation.create([selectedInstanceId]));
        setSelectedInstanceId(undefined);
    };

    const createInstance = (classifierId: string) => {
        if (!clientId) {
            return;
        }

        dispatchAction(CreateClassifierInstanceOperation.create({ classifierId }));
    };

    const commitLinkEdit = (linkId: string, end: 'source' | 'target', newInstanceId: string) => {
        if (clientId && newInstanceId) {
            dispatchAction(UpdateInstanceLinkEndOperation.create({ linkId, end, newInstanceId }));
        }
        setLinkEditState(undefined);
    };

    const beginCreateLink = (associationId: string, eligibleSources: EligibleInstance[], eligibleTargets: EligibleInstance[]) => {
        if (eligibleSources.length === 0 || eligibleTargets.length === 0) {
            return;
        }
        setCreateLinkState({
            associationId,
            sourceId: eligibleSources[0].id,
            targetId: eligibleTargets[0].id
        });
    };

    const beginCreateLinkFromInstance = (instanceId: string, available: AvailableInstanceLink) => {
        if (available.eligiblePeers.length === 0) {
            return;
        }
        const peerId = available.eligiblePeers[0].id;
        setCreateLinkState({
            associationId: available.associationId,
            sourceId: available.end === 'source' ? instanceId : peerId,
            targetId: available.end === 'target' ? instanceId : peerId,
            fixed: available.end,
            anchorInstanceId: instanceId
        });
    };

    const submitCreateLink = () => {
        if (!clientId || !createLinkState) {
            return;
        }
        const { associationId, sourceId, targetId } = createLinkState;
        if (!associationId || !sourceId || !targetId) {
            return;
        }
        dispatchAction(
            CreateInstanceLinkOperation.create({
                associationId,
                sourceInstanceId: sourceId,
                targetInstanceId: targetId
            })
        );
        setCreateLinkState(undefined);
    };

    const renderCreateLinkPicker = (eligibleSources: EligibleInstance[], eligibleTargets: EligibleInstance[]) => {
        if (!createLinkState) {
            return null;
        }
        const optionLabel = (candidate: EligibleInstance) =>
            candidate.classifierName ? `${candidate.name} : ${candidate.classifierName}` : candidate.name;
        const showSource = createLinkState.fixed !== 'source';
        const showTarget = createLinkState.fixed !== 'target';
        return (
            <div className='instance-explorer__create-link'>
                {showSource ? (
                    <select
                        autoFocus
                        className='instance-explorer__input instance-explorer__slot-input'
                        value={createLinkState.sourceId}
                        onChange={event =>
                            setCreateLinkState(current => (current ? { ...current, sourceId: event.target.value } : current))
                        }
                        onClick={event => event.stopPropagation()}
                    >
                        {eligibleSources.map(candidate => (
                            <option key={candidate.id} value={candidate.id}>
                                {optionLabel(candidate)}
                            </option>
                        ))}
                    </select>
                ) : null}
                {showSource && showTarget ? <span className='instance-explorer__slot-equals'>→</span> : null}
                {showTarget ? (
                    <select
                        autoFocus={!showSource}
                        className='instance-explorer__input instance-explorer__slot-input'
                        value={createLinkState.targetId}
                        onChange={event =>
                            setCreateLinkState(current => (current ? { ...current, targetId: event.target.value } : current))
                        }
                        onClick={event => event.stopPropagation()}
                    >
                        {eligibleTargets.map(candidate => (
                            <option key={candidate.id} value={candidate.id}>
                                {optionLabel(candidate)}
                            </option>
                        ))}
                    </select>
                ) : null}
                <button
                    className='instance-explorer__create-link-confirm'
                    onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();
                        submitCreateLink();
                    }}
                    type='button'
                >
                    Create
                </button>
                <button
                    className='instance-explorer__create-link-cancel'
                    onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();
                        setCreateLinkState(undefined);
                    }}
                    type='button'
                >
                    Cancel
                </button>
            </div>
        );
    };

    const renderLinkPicker = (linkId: string, end: 'source' | 'target', eligible: EligibleInstance[], currentId: string) => {
        const options = eligible.some(candidate => candidate.id === currentId)
            ? eligible
            : [{ id: currentId, name: currentId, classifierName: undefined } as EligibleInstance, ...eligible];

        return (
            <select
                autoFocus
                className='instance-explorer__input instance-explorer__slot-input'
                defaultValue={currentId}
                onBlur={() => setLinkEditState(undefined)}
                onChange={event => {
                    const nextId = event.target.value;
                    if (nextId && nextId !== currentId) {
                        commitLinkEdit(linkId, end, nextId);
                    } else {
                        setLinkEditState(undefined);
                    }
                }}
                onClick={event => event.stopPropagation()}
                onDoubleClick={event => event.stopPropagation()}
                onKeyDown={(event: KeyboardEvent<HTMLSelectElement>) => {
                    if (event.key === 'Escape') {
                        setLinkEditState(undefined);
                    }
                }}
            >
                {options.map(candidate => (
                    <option key={candidate.id} value={candidate.id}>
                        {candidate.classifierName ? `${candidate.name} : ${candidate.classifierName}` : candidate.name}
                    </option>
                ))}
            </select>
        );
    };

    const commitEdit = (current: EditState | undefined) => {
        if (!current) {
            return;
        }

        if (clientId) {
            if (current.kind === 'slot') {
                dispatchAction(
                    UpdateInstanceSlotValuesOperation.create({
                        slotId: current.targetId,
                        values: parseValues(current.value)
                    })
                );
            } else {
                const trimmed = current.value.trim();
                if (trimmed.length > 0) {
                    dispatchAction(UpdateOperation.create(current.targetId, 'name', trimmed));
                }
            }
        }

        setEditState(undefined);
    };

    const renderDiagnostics = (diagnostics: DiagnosticSummary[]) => {
        if (diagnostics.length === 0) {
            return null;
        }

        return (
            <span className='instance-explorer__warning' title={diagnostics.map(diagnostic => diagnostic.message).join('\n')}>
                <span className='codicon codicon-warning' />
                <span>{diagnostics.length}</span>
            </span>
        );
    };

    const renderSlot = (slot: SlotSummary) => {
        const isEditing = editState?.kind === 'slot' && editState.targetId === slot.id;

        return (
            <div
                key={slot.id}
                className='instance-explorer__slot'
                onDoubleClick={() => setEditState({ kind: 'slot', targetId: slot.id, value: formatValues(slot.values) })}
            >
                <span className='instance-explorer__slot-feature'>{slot.featureName || '(unnamed slot)'}</span>
                <span className='instance-explorer__slot-equals'>=</span>
                {isEditing ? (
                    <input
                        autoFocus
                        className='instance-explorer__input instance-explorer__slot-input'
                        value={editState?.value ?? ''}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            setEditState(current => (current ? { ...current, value: event.target.value } : current))
                        }
                        onBlur={() => commitEdit(editState)}
                        onClick={event => event.stopPropagation()}
                        onDoubleClick={event => event.stopPropagation()}
                        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                            if (event.key === 'Enter') {
                                commitEdit(editState);
                            } else if (event.key === 'Escape') {
                                setEditState(undefined);
                            }
                        }}
                    />
                ) : (
                    <span className='instance-explorer__slot-value'>{formatValues(slot.values)}</span>
                )}
                {renderDiagnostics(slot.diagnostics)}
            </div>
        );
    };

    const renderInstance = (instance: InstanceSummary) => {
        const expanded = expandedInstances[instance.id];
        const isRenaming = editState?.kind === 'instance' && editState.targetId === instance.id;

        const isSelected = selectedInstanceId === instance.id;
        return (
            <div key={instance.id} className='instance-explorer__instance'>
                <button
                    className={`instance-explorer__row instance-explorer__row--instance${
                        isSelected ? ' instance-explorer__row--selected' : ''
                    }`}
                    onClick={() => selectInstance(instance.id)}
                    type='button'
                >
                    <span
                        className={`codicon ${expanded ? 'codicon-chevron-down' : 'codicon-chevron-right'} instance-explorer__disclosure`}
                        onClick={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            setExpandedInstances(current => ({ ...current, [instance.id]: !current[instance.id] }));
                        }}
                    />
                    <span className='codicon codicon-symbol-field instance-explorer__icon' />
                    <span className='instance-explorer__label'>
                        {isRenaming ? (
                            <input
                                autoFocus
                                className='instance-explorer__input instance-explorer__slot-input'
                                value={editState?.value ?? ''}
                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                    setEditState(current => (current ? { ...current, value: event.target.value } : current))
                                }
                                onBlur={() => commitEdit(editState)}
                                onClick={event => event.stopPropagation()}
                                onDoubleClick={event => event.stopPropagation()}
                                onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                                    if (event.key === 'Enter') {
                                        commitEdit(editState);
                                    } else if (event.key === 'Escape') {
                                        setEditState(undefined);
                                    }
                                }}
                            />
                        ) : (
                            <span
                                onDoubleClick={event => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setEditState({ kind: 'instance', targetId: instance.id, value: instance.name });
                                }}
                            >
                                {instance.name}
                            </span>
                        )}
                        {instance.classifierName ? <span>{` : ${instance.classifierName}`}</span> : null}
                    </span>
                    {renderDiagnostics(instance.diagnostics)}
                </button>
                {expanded && (instance.slots.length > 0 || instance.links.length > 0) ? (
                    <div className='instance-explorer__slots'>
                        {instance.slots.map(renderSlot)}
                        {instance.links.map(renderLink)}
                    </div>
                ) : null}
                {expanded && instance.availableLinks.length > 0 ? (
                    <div className='instance-explorer__add-links'>
                        {instance.availableLinks.map(available => renderAvailableInstanceLink(instance.id, available))}
                    </div>
                ) : null}
            </div>
        );
    };

    const renderAvailableInstanceLink = (instanceId: string, available: AvailableInstanceLink) => {
        const isCreatingHere =
            createLinkState?.associationId === available.associationId &&
            createLinkState.anchorInstanceId === instanceId &&
            createLinkState.fixed === available.end;
        const arrow = available.direction === 'outgoing' ? '→' : '←';
        const eligibleSources = available.end === 'target' ? available.eligiblePeers : [];
        const eligibleTargets = available.end === 'source' ? available.eligiblePeers : [];
        return (
            <div key={`${available.associationId}-${available.end}`} className='instance-explorer__add-link'>
                <button
                    className='instance-explorer__add-link-trigger'
                    disabled={isCreatingHere}
                    onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();
                        beginCreateLinkFromInstance(instanceId, available);
                    }}
                    title={`Add ${available.associationName} link`}
                    type='button'
                >
                    <span className='codicon codicon-add' />
                    <span className='instance-explorer__slot-feature'>{available.associationName}</span>
                    <span className='instance-explorer__slot-equals'>{arrow}</span>
                    <span className='instance-explorer__add-link-hint'>add link…</span>
                </button>
                {isCreatingHere ? renderCreateLinkPicker(eligibleSources, eligibleTargets) : null}
            </div>
        );
    };

    const renderLink = (link: InstanceLinkSummary) => {
        const arrow = link.direction === 'outgoing' ? '→' : '←';
        const peerLabel = link.peerClassifierName ? `${link.peerInstanceName} : ${link.peerClassifierName}` : link.peerInstanceName;
        const isEditingPeer = linkEditState?.linkId === link.id && linkEditState.end === link.peerEnd;
        return (
            <div key={link.id} className='instance-explorer__slot instance-explorer__link'>
                <span className='instance-explorer__slot-feature'>{link.relationName}</span>
                <span className='instance-explorer__slot-equals'>{arrow}</span>
                {isEditingPeer ? (
                    renderLinkPicker(link.id, link.peerEnd, link.eligiblePeers, link.peerInstanceId)
                ) : (
                    <button
                        className='instance-explorer__link-peer'
                        onClick={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            navigateTo(link.peerInstanceId);
                        }}
                        onDoubleClick={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            if (link.eligiblePeers.length > 0) {
                                setLinkEditState({ linkId: link.id, end: link.peerEnd });
                            }
                        }}
                        title='Double-click to change to another eligible instance'
                        type='button'
                    >
                        {peerLabel}
                    </button>
                )}
                <span />
            </div>
        );
    };

    const renderGroup = (group: ClassifierGroup) => {
        const expanded = expandedGroups[group.classifierId];
        const isRenaming = editState?.kind === 'classifier' && editState.targetId === group.classifierId;

        return (
            <section key={group.classifierId} className='instance-explorer__group'>
                <div className='instance-explorer__row instance-explorer__row--group'>
                    <button
                        className='instance-explorer__row-main'
                        onClick={() => setExpandedGroups(current => ({ ...current, [group.classifierId]: !current[group.classifierId] }))}
                        type='button'
                    >
                        <span
                            className={`codicon ${expanded ? 'codicon-chevron-down' : 'codicon-chevron-right'} instance-explorer__disclosure`}
                        />
                        <span className={`codicon ${classifierIcon(group.classifierType)} instance-explorer__icon`} />
                        {isRenaming ? (
                            <input
                                autoFocus
                                className='instance-explorer__input instance-explorer__slot-input'
                                value={editState?.value ?? ''}
                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                    setEditState(current => (current ? { ...current, value: event.target.value } : current))
                                }
                                onBlur={() => commitEdit(editState)}
                                onClick={event => event.stopPropagation()}
                                onDoubleClick={event => event.stopPropagation()}
                                onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                                    if (event.key === 'Enter') {
                                        commitEdit(editState);
                                    } else if (event.key === 'Escape') {
                                        setEditState(undefined);
                                    }
                                }}
                            />
                        ) : (
                            <span
                                className='instance-explorer__label'
                                onClick={event => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    navigateTo(group.classifierId);
                                }}
                                onDoubleClick={event => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setEditState({ kind: 'classifier', targetId: group.classifierId, value: group.classifierName });
                                }}
                            >
                                {group.classifierName}
                            </span>
                        )}
                    </button>
                    <span className='instance-explorer__count'>{group.instances.length}</span>
                    {group.isInstantiable ? (
                        <button
                            className='instance-explorer__icon-button'
                            onClick={() => createInstance(group.classifierId)}
                            title={`Create instance of ${group.classifierName}`}
                            type='button'
                        >
                            <span className='codicon codicon-add' />
                        </button>
                    ) : null}
                </div>
                {expanded ? <div className='instance-explorer__children'>{group.instances.map(renderInstance)}</div> : null}
            </section>
        );
    };

    const renderManyToManyRelation = (section: ManyToManyRelationSection) => {
        const expanded = expandedGroups[section.id];
        const canCreate = section.eligibleSources.length > 0 && section.eligibleTargets.length > 0;
        const isCreating = createLinkState?.associationId === section.id;
        return (
            <section key={section.id} className='instance-explorer__group'>
                <div className='instance-explorer__row instance-explorer__row--group'>
                    <button
                        className='instance-explorer__row-main'
                        onClick={() => setExpandedGroups(current => ({ ...current, [section.id]: !current[section.id] }))}
                        type='button'
                    >
                        <span
                            className={`codicon ${expanded ? 'codicon-chevron-down' : 'codicon-chevron-right'} instance-explorer__disclosure`}
                        />
                        <span className='codicon codicon-references instance-explorer__icon' />
                        <span className='instance-explorer__label'>{`${section.name} : ${section.relationType}`}</span>
                    </button>
                    <span className='instance-explorer__count'>{section.links.length}</span>
                    <button
                        className='instance-explorer__icon-button'
                        disabled={!canCreate || isCreating}
                        onClick={() => beginCreateLink(section.id, section.eligibleSources, section.eligibleTargets)}
                        title={canCreate ? `Create instance of ${section.name}` : 'Source or target has no eligible instances yet'}
                        type='button'
                    >
                        <span className='codicon codicon-add' />
                    </button>
                </div>
                {isCreating ? renderCreateLinkPicker(section.eligibleSources, section.eligibleTargets) : null}
                {expanded ? (
                    <div className='instance-explorer__children'>
                        {section.links.map(link => {
                            const isEditingSource = linkEditState?.linkId === link.id && linkEditState.end === 'source';
                            const isEditingTarget = linkEditState?.linkId === link.id && linkEditState.end === 'target';
                            return (
                                <div key={link.id} className='instance-explorer__row instance-explorer__row--m2m'>
                                    <span className='codicon codicon-symbol-field instance-explorer__icon' />
                                    {isEditingSource ? (
                                        renderLinkPicker(link.id, 'source', link.eligibleSources, link.sourceInstanceId)
                                    ) : (
                                        <button
                                            className='instance-explorer__link-peer'
                                            onClick={event => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                navigateTo(link.sourceInstanceId);
                                            }}
                                            onDoubleClick={event => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                if (link.eligibleSources.length > 0) {
                                                    setLinkEditState({ linkId: link.id, end: 'source' });
                                                }
                                            }}
                                            title='Double-click to change to another eligible instance'
                                            type='button'
                                        >
                                            {link.sourceClassifierName
                                                ? `${link.sourceInstanceName} : ${link.sourceClassifierName}`
                                                : link.sourceInstanceName}
                                        </button>
                                    )}
                                    <span className='instance-explorer__slot-equals'>→</span>
                                    {isEditingTarget ? (
                                        renderLinkPicker(link.id, 'target', link.eligibleTargets, link.targetInstanceId)
                                    ) : (
                                        <button
                                            className='instance-explorer__link-peer'
                                            onClick={event => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                navigateTo(link.targetInstanceId);
                                            }}
                                            onDoubleClick={event => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                if (link.eligibleTargets.length > 0) {
                                                    setLinkEditState({ linkId: link.id, end: 'target' });
                                                }
                                            }}
                                            title='Double-click to change to another eligible instance'
                                            type='button'
                                        >
                                            {link.targetClassifierName
                                                ? `${link.targetInstanceName} : ${link.targetClassifierName}`
                                                : link.targetInstanceName}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : null}
            </section>
        );
    };

    const renderAvailableSection = () => {
        const filteredAvailable = filterAvailable(availableForInstantiation, query);
        const totalAvailable = filteredAvailable.classifiers.length + filteredAvailable.associations.length;
        if (totalAvailable === 0) {
            return null;
        }
        const expanded = expandedGroups[AVAILABLE_SECTION_KEY];
        return (
            <section className='instance-explorer__group'>
                <div className='instance-explorer__row instance-explorer__row--group'>
                    <button
                        className='instance-explorer__row-main'
                        onClick={() =>
                            setExpandedGroups(current => ({ ...current, [AVAILABLE_SECTION_KEY]: !current[AVAILABLE_SECTION_KEY] }))
                        }
                        type='button'
                    >
                        <span
                            className={`codicon ${
                                expanded ? 'codicon-chevron-down' : 'codicon-chevron-right'
                            } instance-explorer__disclosure`}
                        />
                        <span className='codicon codicon-lightbulb instance-explorer__icon' />
                        <span className='instance-explorer__label'>Available to instantiate</span>
                    </button>
                    <span className='instance-explorer__count'>{totalAvailable}</span>
                </div>
                {expanded ? (
                    <div className='instance-explorer__children'>
                        {filteredAvailable.classifiers.map(cls => (
                            <div key={cls.classifierId} className='instance-explorer__row instance-explorer__row--instance'>
                                <span className={`codicon ${classifierIcon(cls.classifierType)} instance-explorer__icon`} />
                                <span className='instance-explorer__label'>{cls.classifierName}</span>
                                <button
                                    className='instance-explorer__icon-button'
                                    onClick={() => createInstance(cls.classifierId)}
                                    title={`Create instance of ${cls.classifierName}`}
                                    type='button'
                                >
                                    <span className='codicon codicon-add' />
                                </button>
                            </div>
                        ))}
                        {filteredAvailable.associations.map(assoc => renderAvailableAssociation(assoc))}
                    </div>
                ) : null}
            </section>
        );
    };

    const renderAvailableAssociation = (assoc: AvailableAssociation) => {
        const canCreate = assoc.eligibleSources.length > 0 && assoc.eligibleTargets.length > 0;
        const isCreating = createLinkState?.associationId === assoc.associationId;
        return (
            <div key={assoc.associationId} className='instance-explorer__available-assoc'>
                <div className='instance-explorer__row instance-explorer__row--instance'>
                    <span className='codicon codicon-references instance-explorer__icon' />
                    <span className='instance-explorer__label'>{`${assoc.associationName} : ${assoc.relationType}`}</span>
                    <button
                        className='instance-explorer__icon-button'
                        disabled={!canCreate || isCreating}
                        onClick={() => beginCreateLink(assoc.associationId, assoc.eligibleSources, assoc.eligibleTargets)}
                        title={canCreate ? `Create instance of ${assoc.associationName}` : 'Source or target has no eligible instances yet'}
                        type='button'
                    >
                        <span className='codicon codicon-add' />
                    </button>
                </div>
                {isCreating ? renderCreateLinkPicker(assoc.eligibleSources, assoc.eligibleTargets) : null}
            </div>
        );
    };

    const filteredManyToMany = filterManyToMany(manyToManyRelations, query);
    const filteredAvailableForEmptyCheck = filterAvailable(availableForInstantiation, query);
    const hasAvailable = filteredAvailableForEmptyCheck.classifiers.length > 0 || filteredAvailableForEmptyCheck.associations.length > 0;
    const showEmptyState =
        filteredGroups.length === 0 && filteredUnclassified.length === 0 && filteredManyToMany.length === 0 && !hasAvailable;

    const openGenerateDialog = () => {
        setGeneratePreview(undefined);
        // Fetch the instantiable classifiers + their properties for the per-property pattern editor.
        dispatchAction(RequestGeneratableClassifiersAction.create());
        setIsGenerateDialogOpen(true);
    };

    return (
        <div className='instance-explorer' onKeyDown={handleRootKeyDown}>
            <header className='instance-explorer__header'>
                <div className='instance-explorer__subtitle'>{totalInstances} instance(s) in the current diagram</div>
                <input
                    className='instance-explorer__input'
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value)}
                    placeholder='Filter by classifier, instance, slot, or value'
                    type='search'
                    value={searchText}
                />
                <button className='instance-explorer__action' onClick={openGenerateDialog} title='Generate test data' type='button'>
                    <span className='codicon codicon-sparkle' />
                    <span>Generate Test Data</span>
                </button>
            </header>

            {isGenerateDialogOpen ? (
                <GenerateDialog
                    associations={generatableAssociations}
                    classifiers={generatableClassifiers}
                    onClose={() => setIsGenerateDialogOpen(false)}
                    onGenerate={(config: GenerationConfig) => {
                        dispatchAction(GenerateInstancesOperation.create(config));
                        setIsGenerateDialogOpen(false);
                        setGeneratePreview(undefined);
                    }}
                    onPreview={(config: GenerationConfig) => {
                        dispatchAction(RequestGenerateInstancesPreviewAction.create({ config }));
                    }}
                    onConfigChange={() => setGeneratePreview(undefined)}
                    preview={generatePreview}
                />
            ) : null}

            <div className='instance-explorer__tree'>
                {renderAvailableSection()}

                {filteredGroups.map(renderGroup)}

                {filteredUnclassified.length > 0 ? (
                    <section className='instance-explorer__group'>
                        <div className='instance-explorer__row instance-explorer__row--group'>
                            <button
                                className='instance-explorer__row-main'
                                onClick={() => setExpandedGroups(current => ({ ...current, unclassified: !current.unclassified }))}
                                type='button'
                            >
                                <span
                                    className={`codicon ${
                                        expandedGroups.unclassified ? 'codicon-chevron-down' : 'codicon-chevron-right'
                                    } instance-explorer__disclosure`}
                                />
                                <span className='codicon codicon-question instance-explorer__icon' />
                                <span className='instance-explorer__label'>Unclassified</span>
                            </button>
                            <span className='instance-explorer__count'>{filteredUnclassified.length}</span>
                        </div>
                        {expandedGroups.unclassified ? (
                            <div className='instance-explorer__children'>{filteredUnclassified.map(renderInstance)}</div>
                        ) : null}
                    </section>
                ) : null}

                {filteredManyToMany.map(renderManyToManyRelation)}

                {showEmptyState ? (
                    <div className='instance-explorer__empty'>No matching instances were found in the active diagram.</div>
                ) : null}
            </div>

            {isExportDialogOpen ? (
                <ExportDialog
                    classifierGroups={classifierGroups}
                    isSaving={isSavingExport}
                    onClose={() => setIsExportDialogOpen(false)}
                    onExport={options => {
                        setExportStatusMessage(undefined);
                        setExportResult('');
                        dispatchAction(
                            RequestExportInstancesAction.create({
                                action: {
                                    scope: options.scope,
                                    classifierIds: options.classifierIds,
                                    selection: options.selection,
                                    templateName: options.templateName,
                                    customTemplateFile: options.customTemplateFile
                                }
                            })
                        );
                    }}
                    onSave={({ suggestedFileName }) => {
                        setIsSavingExport(true);
                        dispatchAction(
                            RequestSaveExportedInstancesAction.create({
                                content: exportResult,
                                suggestedFileName
                            })
                        );
                    }}
                    result={exportResult}
                    selectedInstanceIds={selectedDiagramInstanceIds}
                    statusMessage={exportStatusMessage}
                    templates={templates}
                    unclassified={unclassified}
                    workspaceTemplateDirectory={workspaceTemplateDirectory}
                />
            ) : null}
        </div>
    );
}

function flattenInstances(classifierGroups: ClassifierGroup[], unclassified: InstanceSummary[]): InstanceSummary[] {
    return [...classifierGroups.flatMap(group => group.instances), ...unclassified];
}

function filterGroups(groups: ClassifierGroup[], query: string): ClassifierGroup[] {
    if (!query) {
        return groups;
    }

    const filtered: ClassifierGroup[] = [];
    for (const group of groups) {
        if (group.classifierName.toLowerCase().includes(query)) {
            filtered.push(group);
            continue;
        }

        const instances = filterInstances(group.instances, query);
        if (instances.length > 0) {
            filtered.push({
                ...group,
                instances
            });
        }
    }

    return filtered;
}

function filterInstances(instances: InstanceSummary[], query: string): InstanceSummary[] {
    if (!query) {
        return instances;
    }

    return instances.filter(instance => {
        if (instance.name.toLowerCase().includes(query)) {
            return true;
        }

        if (instance.classifierName?.toLowerCase().includes(query)) {
            return true;
        }

        if (instance.diagnostics.some(diagnostic => diagnostic.message.toLowerCase().includes(query))) {
            return true;
        }

        if (
            instance.links.some(
                link =>
                    link.relationName.toLowerCase().includes(query) ||
                    link.peerInstanceName.toLowerCase().includes(query) ||
                    (link.peerClassifierName?.toLowerCase().includes(query) ?? false)
            )
        ) {
            return true;
        }

        return instance.slots.some(slot => {
            if (slot.featureName.toLowerCase().includes(query)) {
                return true;
            }

            if (slot.values.some(value => value.toLowerCase().includes(query))) {
                return true;
            }

            return slot.diagnostics.some(diagnostic => diagnostic.message.toLowerCase().includes(query));
        });
    });
}

function filterAvailable(available: AvailableForInstantiation, query: string): AvailableForInstantiation {
    if (!query) {
        return available;
    }
    return {
        classifiers: available.classifiers.filter(cls => cls.classifierName.toLowerCase().includes(query)),
        associations: available.associations.filter(
            assoc => assoc.associationName.toLowerCase().includes(query) || assoc.relationType.toLowerCase().includes(query)
        )
    };
}

function filterManyToMany(sections: ManyToManyRelationSection[], query: string): ManyToManyRelationSection[] {
    if (!query) {
        return sections;
    }

    const filtered: ManyToManyRelationSection[] = [];
    for (const section of sections) {
        if (section.name.toLowerCase().includes(query) || section.relationType.toLowerCase().includes(query)) {
            filtered.push(section);
            continue;
        }
        const links = section.links.filter(
            link =>
                link.sourceInstanceName.toLowerCase().includes(query) ||
                link.targetInstanceName.toLowerCase().includes(query) ||
                (link.sourceClassifierName?.toLowerCase().includes(query) ?? false) ||
                (link.targetClassifierName?.toLowerCase().includes(query) ?? false)
        );
        if (links.length > 0) {
            filtered.push({ ...section, links });
        }
    }
    return filtered;
}

function parseValues(value: string): string[] {
    return value
        .split(/\r?\n|,/)
        .map(entry => entry.trim())
        .filter(entry => entry.length > 0);
}

function formatValues(values: string[]): string {
    return values.length > 0 ? values.join(', ') : '';
}

function classifierIcon(classifierType: ClassifierType): string {
    switch (classifierType) {
        case 'Interface':
            return 'codicon-symbol-interface';
        case 'DataType':
            return 'codicon-symbol-key';
        default:
            return 'codicon-symbol-class';
    }
}
