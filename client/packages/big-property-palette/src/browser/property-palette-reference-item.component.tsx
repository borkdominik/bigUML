/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { BigMenu, BigMenuItem, BigTextField, BigTooltip, classNames, VSCodeContext } from '@borkdominik-biguml/big-components';
import { CompoundOperation } from '@eclipse-glsp/protocol';
import { VSCodeButton, VSCodeCheckbox, VSCodeOption } from '@vscode/webview-ui-toolkit/react/index.js';
import { useCallback, useContext, useEffect, useRef, useState, type ChangeEvent, type ReactElement } from 'react';
import Sortable from 'sortablejs';
import { UpdateElementPropertyAction, type ElementReferenceProperty } from '../common/index.js';

export interface PropertyDeleteEventDetail {
    references: ElementReferenceProperty.Reference[];
}

export interface PropertyNameChangeDetail {
    elementId: string;
    name: string;
}

export interface PropertyOrderDetail {
    element: ElementReferenceProperty;
    updates: {
        elementId: string;
        oldIndex: number;
        newIndex: number;
    }[];
}

export interface PropertyPaletteReferenceItemProps {
    item: ElementReferenceProperty;
    onPropertyNavigate: (item: ElementReferenceProperty.Reference) => void;
}

export function PropertyPaletteReferenceItem(props: PropertyPaletteReferenceItemProps): ReactElement {
    const { dispatchAction } = useContext(VSCodeContext);

    const [item, setItem] = useState<ElementReferenceProperty | undefined>(undefined);
    const itemsElementRef = useRef<HTMLDivElement | null>(null);
    const [_sortable, setSortable] = useState<Sortable | undefined>(undefined);

    useEffect(() => {
        setItem(props.item);
    }, [props.item]);

    const onNavigate = useCallback(
        (item: ElementReferenceProperty.Reference) => {
            props.onPropertyNavigate(item);
        },
        [props]
    );

    const onOrderChange = useCallback(
        (detail: PropertyOrderDetail) => {

            dispatchAction(
                UpdateElementPropertyAction.create({
                    elementId: detail.element.elementId,
                    propertyId: `${detail.element.propertyId}_index`,
                    value: JSON.stringify(detail.updates)
                })
            );
        },
        [dispatchAction]
    );

    const onNameChange = useCallback(
        (item: ElementReferenceProperty.Reference, name: string) => {
            dispatchAction(
                UpdateElementPropertyAction.create({
                    elementId: item.elementId,
                    propertyId: 'name',
                    value: name
                })
            );
        },
        [dispatchAction]
    );

    const onCreate = useCallback(
        (create: ElementReferenceProperty.CreateReference) => {
            dispatchAction(create.action);
        },
        [dispatchAction]
    );

    const onDelete = useCallback(
        (references: ElementReferenceProperty.Reference[]) => {
            dispatchAction(CompoundOperation.create(references.flatMap(r => r.deleteActions) as any));
        },
        [dispatchAction]
    );

    useEffect(() => {
        if (item && item.isOrderable && itemsElementRef.current) {
            let childNodes: ChildNode[] = [];

            const sortableInstance = Sortable.create(itemsElementRef.current, {
                animation: 100,
                handle: '.handle',
                dragClass: 'sortable-drag',
                onStart: e => {
                    const node = e.item as Node;
                    childNodes = Array.from(node.parentNode!.childNodes);
                    childNodes = childNodes.filter(
                        childNode =>
                            childNode.nodeType !== Node.ELEMENT_NODE || !(childNode as HTMLElement).classList.contains('sortable-fallback')
                    );
                },
                onEnd: e => {
                    const { oldIndex, newIndex } = e;

                    if (oldIndex === undefined || newIndex === undefined) {
                        return;
                    }

                    const elementId = e.item.getAttribute('data-id');
                    if (elementId === null) {
                        return;
                    }

                    const node = e.item as Node;
                    const parentNode = node.parentNode!;
                    for (const childNode of childNodes) {
                        parentNode.appendChild(childNode);
                    }

                    if (oldIndex === newIndex) {
                        return;
                    }

                    const updatedReferences = [...item.references];
                    const element = updatedReferences.splice(oldIndex, 1)[0];
                    updatedReferences.splice(newIndex, 0, element);

                    setItem(prevItem => (prevItem ? { ...prevItem, references: updatedReferences } : prevItem));

                    onOrderChange({
                        element: item,
                        updates: [
                            {
                                elementId,
                                oldIndex,
                                newIndex
                            }
                        ]
                    });
                }
            });

            setSortable(sortableInstance);

            return () => {
                sortableInstance.destroy();
            };
        }

        return;
    }, [item, onOrderChange]);

    const renderAutocomplete = useCallback(
        (item: ElementReferenceProperty) => {
            const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
                const target = event.target as HTMLSelectElement;
                onCreate(item.creates[target.selectedIndex]);
                target.value = '';
            };

            return (
                <VSCodeCheckbox
                    className='autocomplete'
                    ariaAutoComplete='both'
                    ariaPlaceholder={item.label}
                    onChange={handleChange as any}
                >
                    {item.creates.map(c => (
                        <VSCodeOption key={c.label}>{c.label}</VSCodeOption>
                    ))}
                </VSCodeCheckbox>
            );
        },
        [onCreate]
    );

    const renderItem = useCallback(
        (item: ElementReferenceProperty, ref: ElementReferenceProperty.Reference) => {
            return (
                <div className='reference-item' data-id={ref.elementId} key={ref.elementId}>
                    <div className='reference-item-body'>
                        {item.isOrderable && <div className='handle codicon codicon-gripper'></div>}
                        {ref.name === undefined ? (
                            <div className='reference-item-label'>{ref.label}</div>
                        ) : (
                            <div className='reference-item-name'>
                                <BigTextField value={ref.name} onDidChangeValue={(event) => onNameChange(ref, event)} />
                            </div>
                        )}
                        <div className='reference-item-actions'>
                            {ref.deleteActions.length > 0 && (
                                <BigTooltip>
                                    <VSCodeButton slot='anchor' className='action-delete' appearance='icon' onClick={() => onDelete([ref])}>
                                        <div className='codicon codicon-trash'></div>
                                    </VSCodeButton>
                                    <span slot='text'>Delete</span>
                                </BigTooltip>
                            )}
                            <BigTooltip>
                                <VSCodeButton slot='anchor' appearance='icon' onClick={() => onNavigate(ref)}>
                                    <div className='codicon codicon-chevron-right'></div>
                                </VSCodeButton>
                                <span slot='text'>Navigate</span>
                            </BigTooltip>
                        </div>
                    </div>
                    {ref.hint !== undefined && (
                        <div className={classNames({ 'hint-text': true, 'handle-empty': item.isOrderable })}>{ref.hint}</div>
                    )}
                </div>
            );
        },
        [onDelete, onNavigate, onNameChange]
    );

    const renderHeader = useCallback(
        (item: ElementReferenceProperty) => {
            return (
                <div className='reference-header'>
                    <h4 className='reference-header-title'>{item.label}</h4>
                    {item.references.some(r => r.deleteActions.length > 0) && (
                        <div className='reference-header-actions'>
                            <BigMenu>
                                <BigMenuItem
                                    icon='codicon-trash'
                                    onClick={() => onDelete(item.references.filter(r => r.deleteActions.length > 0))}
                                >
                                    Delete all
                                </BigMenuItem>
                            </BigMenu>
                        </div>
                    )}
                </div>
            );
        },
        [onDelete]
    );

    const renderBody = useCallback(
        (item: ElementReferenceProperty) => {
            return (
                <div className='reference-body'>
                    {item.isAutocomplete && renderAutocomplete(item)}
                    <div ref={itemsElementRef}>{item.references.map(ref => renderItem(item, ref))}</div>
                    {item.creates.length > 0 && !item.isAutocomplete && (
                        <div className='reference-body-actions'>
                            {item.creates.length === 1 ? (
                                <VSCodeButton appearance='primary' onClick={() => onCreate(item.creates[0])}>
                                    Add
                                </VSCodeButton>
                            ) : (
                                <BigMenu>
                                    {item.creates.map(c => (
                                        <BigMenuItem key={c.label} onClick={() => onCreate(c)}>
                                            {c.label}
                                        </BigMenuItem>
                                    ))}
                                    <VSCodeButton slot='menu-trigger' appearance='primary'>
                                        Add
                                    </VSCodeButton>
                                </BigMenu>
                            )}
                        </div>
                    )}
                </div>
            );
        },
        [renderAutocomplete, renderItem, onCreate]
    );

    if (!props.item) {
        return <div>Item not available.</div>;
    }
    return (
        <>
            {renderHeader(props.item)}
            {renderBody(props.item)}
        </>
    );
}
