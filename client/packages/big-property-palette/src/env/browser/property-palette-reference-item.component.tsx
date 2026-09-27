/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { BButton, BCheckbox, BContextMenu, BOption, BTextfield, classNames, VSCodeContext } from '@borkdominik-biguml/big-components';
import { UpdateElementPropertyAction, type ElementReferenceProperty } from '@borkdominik-biguml/big-property-palette';
import { isValidMultiplicity, sanitizeMultiplicity } from '@borkdominik-biguml/uml-glsp-server';
import { CompoundOperation, DeleteElementOperation } from '@eclipse-glsp/protocol';
import { useCallback, useContext, useEffect, useRef, useState, type ChangeEvent, type ReactElement } from 'react';
import Sortable from 'sortablejs';
import { TypeCombobox } from './type-combobox.component.js';

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
    const [isCreateMenuOpen, setCreateMenuOpen] = useState(false);

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

    const onFieldChange = useCallback(
        (item: ElementReferenceProperty.Reference, propertyId: string, value: string) => {
            dispatchAction(
                UpdateElementPropertyAction.create({
                    elementId: item.elementId,
                    propertyId,
                    value
                })
            );
        },
        [dispatchAction]
    );

    const onCreate = useCallback(
        (create: ElementReferenceProperty.CreateReference) => {
            setCreateMenuOpen(false);
            dispatchAction(create.action);
        },
        [dispatchAction]
    );

    // The menu takes itself down again on the next click anywhere outside it. Closing it here as well
    // keeps the button in step with it: left thinking the menu was still open, the button would want a
    // click to close a menu that had already gone before it would open one again.
    useEffect(() => {
        if (!isCreateMenuOpen) {
            return;
        }

        const close = (): void => setCreateMenuOpen(false);
        // Listened for a frame late, so that the click opening the menu is not the one closing it.
        const frame = requestAnimationFrame(() => document.addEventListener('click', close, { once: true }));

        return () => {
            cancelAnimationFrame(frame);
            document.removeEventListener('click', close);
        };
    }, [isCreateMenuOpen]);

    const onDelete = useCallback(
        (references: ElementReferenceProperty.Reference[]) => {
            const actions = references.flatMap(r => r.deleteActions);
            // Merge every DeleteElementOperation into one so the server removes all targeted
            // elements from a single, consistently-indexed patch instead of N patches whose
            // array indices go stale as soon as an earlier one in the batch is applied.
            const elementIds = actions.filter(DeleteElementOperation.is).flatMap(action => action.elementIds);
            const otherActions = actions.filter(action => !DeleteElementOperation.is(action));
            const mergedActions = elementIds.length > 0 ? [DeleteElementOperation.create(elementIds), ...otherActions] : otherActions;

            if (mergedActions.length === 0) {
                return;
            }

            dispatchAction(mergedActions.length === 1 ? mergedActions[0] : CompoundOperation.create(mergedActions as any));
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
                <BCheckbox className='autocomplete' onChange={handleChange as any}>
                    {item.creates.map(c => (
                        <BOption key={c.label}>{c.label}</BOption>
                    ))}
                </BCheckbox>
            );
        },
        [onCreate]
    );

    const renderItem = useCallback(
        (item: ElementReferenceProperty, ref: ElementReferenceProperty.Reference, index: number) => {
            return (
                // Keyed by position as well: rows need not stand for elements of their own - the bend
                // points of an edge all carry the edge's id.
                <div className='reference-item' data-id={ref.elementId} key={`${ref.elementId}-${index}`}>
                    <div className='reference-item-body'>
                        {item.isOrderable && <div className='handle codicon codicon-gripper'></div>}
                        {ref.fields && ref.fields.length > 0 ? (
                            // The fields the referenced type declares, side by side, each written back on its own.
                            <div className='reference-item-fields'>
                                {ref.fields.map(field => {
                                    // Held to the same rules as the palette's own multiplicity field: what
                                    // cannot be part of one is dropped as it is typed, and one left half-typed
                                    // goes back to the stored value instead of being written.
                                    const isMultiplicity = field.format === 'multiplicity';
                                    if (field.suggestions) {
                                        return (
                                            <TypeCombobox
                                                key={field.propertyId}
                                                value={field.value}
                                                suggestions={field.suggestions}
                                                title={field.label}
                                                onCommit={value => onFieldChange(ref, field.propertyId, value)}
                                            />
                                        );
                                    }
                                    return (
                                        <BTextfield
                                            key={field.propertyId}
                                            className={classNames({ 'multiplicity-field': isMultiplicity })}
                                            value={field.value}
                                            placeholder={field.label}
                                            title={field.label}
                                            onInput={(e: any) => {
                                                const input = e.target as HTMLInputElement;
                                                if (isMultiplicity) {
                                                    const sanitized = sanitizeMultiplicity(input.value);
                                                    if (sanitized !== input.value) {
                                                        input.value = sanitized;
                                                    }
                                                }
                                            }}
                                            onBlur={(e: any) => {
                                                const input = e.target as HTMLInputElement;
                                                if (isMultiplicity && input.value !== '' && !isValidMultiplicity(input.value)) {
                                                    input.value = field.value;
                                                    return;
                                                }
                                                onFieldChange(ref, field.propertyId, input.value);
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        ) : ref.name === undefined ? (
                            <div className='reference-item-label'>{ref.label}</div>
                        ) : (
                            <div className='reference-item-name'>
                                <BTextfield
                                    value={ref.name}
                                    onInput={() => {}}
                                    onBlur={(e: any) => onFieldChange(ref, 'name', (e.target as HTMLInputElement).value)}
                                />
                            </div>
                        )}
                        <div className='reference-item-actions'>
                            {ref.deleteActions.length > 0 && (
                                <BButton secondary icon='trash' className='action-delete' title='Delete' onClick={() => onDelete([ref])} />
                            )}
                            {item.isNavigable && (
                                <BButton secondary icon='chevron-right' title='Navigate' onClick={() => onNavigate(ref)} />
                            )}
                        </div>
                    </div>
                    {ref.hint !== undefined && (
                        <div className={classNames({ 'hint-text': true, 'handle-empty': item.isOrderable })}>{ref.hint}</div>
                    )}
                </div>
            );
        },
        [onDelete, onNavigate, onFieldChange]
    );

    const renderHeader = useCallback(
        (item: ElementReferenceProperty) => {
            // Added from the section's own header, beside the button that clears it: the list below is
            // what is being added to, and on a long one an action underneath it is scrolled away from
            // the heading that says what it would add. The autocomplete field is its own way in, so a
            // section offering one is left with it alone.
            const creates = item.isAutocomplete ? [] : item.creates;
            const deletable = item.references.filter(r => r.deleteActions.length > 0);

            if (creates.length === 0 && deletable.length === 0) {
                return (
                    <div className='reference-header'>
                        <h4 className='reference-header-title'>{item.label}</h4>
                    </div>
                );
            }

            return (
                <div className='reference-header'>
                    <h4 className='reference-header-title'>{item.label}</h4>
                    <div className='reference-header-actions'>
                        {deletable.length > 0 && <BButton secondary icon='trash' title='Delete all' onClick={() => onDelete(deletable)} />}
                        {creates.length > 0 && (
                            <div className='reference-create'>
                                <BButton
                                    secondary
                                    icon='add'
                                    title={creates.length === 1 ? creates[0].label : 'Add'}
                                    onClick={() => (creates.length === 1 ? onCreate(creates[0]) : setCreateMenuOpen(open => !open))}
                                />
                                {/* Where there is more than one thing to add - a message can join a link
                                    running either way, say - the choice is offered rather than guessed at. */}
                                {isCreateMenuOpen && creates.length > 1 && (
                                    <BContextMenu
                                        className='reference-create-menu'
                                        show
                                        data={creates.map((create, index) => ({ label: create.label, value: `${index}` }))}
                                        onVscContextMenuSelect={event => onCreate(creates[Number(event.detail.value)])}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
        },
        [isCreateMenuOpen, onCreate, onDelete]
    );

    const renderBody = useCallback(
        (item: ElementReferenceProperty) => {
            return (
                <div className='reference-body'>
                    {item.isAutocomplete && renderAutocomplete(item)}
                    <div ref={itemsElementRef}>{item.references.map((ref, index) => renderItem(item, ref, index))}</div>
                </div>
            );
        },
        [renderAutocomplete, renderItem]
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
