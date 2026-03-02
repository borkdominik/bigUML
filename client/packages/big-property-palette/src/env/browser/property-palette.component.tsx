/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { BButton, BCheckbox, BDivider, BOption, BSingleSelect, BTextfield, VSCodeContext } from '@borkdominik-biguml/big-components';
import {
    ElementBoolProperty,
    ElementChoiceProperty,
    ElementReferenceProperty,
    ElementTextProperty,
    RequestPropertyPaletteAction,
    SetNavigationIdNotification,
    SetPropertyPaletteAction,
    UpdateElementPropertyAction,
    type ElementProperties,
    type ElementProperty
} from '@borkdominik-biguml/big-property-palette';
import { type Action } from '@eclipse-glsp/protocol';
import { groupBy } from 'lodash';
import { useCallback, useContext, useEffect, useState, type ChangeEvent, type ReactElement } from 'react';
import { PropertyPaletteReferenceItem } from './property-palette-reference-item.component.js';

export function PropertyPalette(): ReactElement {
    const { clientId, dispatchNotification, listenAction, dispatchAction } = useContext(VSCodeContext);
    const [properties, setProperties] = useState<ElementProperties | undefined>();
    const [navigationIds, setNavigationIds] = useState<{ [key: string]: { from: string; to: string }[] }>({});
    const [searchText, setSearchText] = useState<string>('');

    const onAction = useCallback((action: Action) => {
        if (SetPropertyPaletteAction.is(action)) {
            if (action.palette === undefined) {
                setProperties(undefined);
            } else {
                const sortedProperties: ElementProperties = {
                    ...action.palette,
                    items: action.palette.items.sort((itemA, itemB) => {
                        if ('label' in itemA && 'label' in itemB) {
                            return (itemA.label as string).localeCompare(itemB.label as string);
                        }

                        return 0;
                    })
                };
                setProperties(sortedProperties);
            }
        }
    }, []);

    useEffect(() => {
        listenAction(onAction);
    });

    document.addEventListener('contextmenu', event => {
        event.stopImmediatePropagation();
    });

    useEffect(() => {
        if (clientId !== undefined) {
            setNavigationIds(navigationIds => {
                const ids = navigationIds[clientId];

                if (properties === undefined || ids?.at(-1)?.to !== properties.elementId) {
                    return {
                        ...navigationIds,
                        [clientId]: []
                    };
                }

                return navigationIds;
            });
        }
    }, [properties, clientId]);

    useEffect(() => {
        if (!clientId || !navigationIds[clientId] || navigationIds[clientId].length === 0) {
            return;
        }

        const ids = [...navigationIds[clientId]];
        dispatchNotification(SetNavigationIdNotification, ids.at(-1)!.to);
    }, [clientId, dispatchNotification, navigationIds]);

    const onNavigateBack = useCallback(() => {
        if (!clientId) {
            return;
        }

        const ids = [...navigationIds[clientId]];
        if (ids.length > 0) {
            const elementId = ids.pop()?.from;
            setNavigationIds({
                ...navigationIds,
                [clientId]: ids
            });
            dispatchAction(
                RequestPropertyPaletteAction.create({
                    elementId
                })
            );
            dispatchNotification(SetNavigationIdNotification, elementId);
        }
    }, [clientId, navigationIds, dispatchAction, dispatchNotification]);

    const onPropertyChange = useCallback(
        (item: ElementProperty, value: string) => {
            const { elementId, propertyId } = item;

            dispatchAction(
                UpdateElementPropertyAction.create({
                    elementId,
                    propertyId,
                    value
                })
            );
        },
        [dispatchAction]
    );

    const onPropertyNavigate = useCallback(
        (event: ElementReferenceProperty.Reference) => {
            const { elementId } = event;
            if (properties && clientId) {
                setNavigationIds({
                    ...navigationIds,
                    [clientId]: [
                        ...(navigationIds[clientId] ?? []),
                        {
                            from: properties.elementId,
                            to: elementId
                        }
                    ]
                });
            }

            dispatchAction(
                RequestPropertyPaletteAction.create({
                    elementId
                })
            );
        },
        [properties, clientId, dispatchAction, navigationIds]
    );

    const renderReference = useCallback(
        (item: ElementReferenceProperty) => {
            return (
                <PropertyPaletteReferenceItem
                    key={`${item.elementId}-${item.propertyId}`}
                    item={item}
                    onPropertyNavigate={onPropertyNavigate}
                />
            );
        },
        [onPropertyNavigate]
    );

    const renderHeader = useCallback(() => {
        if (clientId && navigationIds[clientId]?.length > 0) {
            return (
                <header>
                    <BButton icon='chevron-left' id='navigate-back' onClick={onNavigateBack} />
                    <h3 className='title'>{properties?.label}</h3>
                </header>
            );
        }

        return <header>{properties === undefined ? '' : <h3 className='title'>{properties?.label}</h3>}</header>;
    }, [clientId, navigationIds, onNavigateBack, properties]);

    const renderBody = useCallback(() => {
        if (!properties) {
            return <div className='no-data-message'>The active diagram does not provide property information.</div>;
        }

        const items = properties.items;
        const filteredItems = items.filter((item: any) => {
            const label: string = item.label;

            if (label !== undefined && searchText.trim().length > 0) {
                return label.toLowerCase().includes(searchText.toLowerCase());
            }

            return true;
        });

        const { references: referenceItems, other: gridItems } = extractReferences(filteredItems);

        const gridTemplates = gridItems.map((item: any) => {
            if (ElementTextProperty.is(item)) {
                return (
                    <div key={`${item.elementId}-${item.propertyId}`}>
                        <div className='grid-label'>{item.label}</div>
                        <div className='grid-value grid-flex'>
                            <BTextfield
                                value={item.text}
                                onBlur={(e: any) => onPropertyChange(item, (e.target as HTMLInputElement).value)}
                            />
                        </div>
                    </div>
                );
            } else if (ElementBoolProperty.is(item)) {
                return (
                    <div key={`${item.elementId}-${item.propertyId}`}>
                        <div className='grid-label'>{item.label}</div>
                        <div className='grid-value'>
                            <BCheckbox checked={item.value} onChange={() => onPropertyChange(item, !item.value + '')} />
                        </div>
                    </div>
                );
            } else if (ElementChoiceProperty.is(item)) {
                return (
                    <div key={`${item.elementId}-${item.propertyId}`}>
                        <div className='grid-label'>{item.label}</div>
                        <div className='grid-value grid-flex'>
                            <BSingleSelect
                                disabled={item.disabled}
                                value={item.choice}
                                onChange={(e: any) => onPropertyChange(item, (e.target as HTMLSelectElement).value)}
                            >
                                {item.choices.map(choice => (
                                    <BOption key={choice.value} value={choice.value}>
                                        {choice.label}
                                    </BOption>
                                ))}
                            </BSingleSelect>
                        </div>
                    </div>
                );
            }

            return null;
        });

        const referenceTemplates = referenceItems.map(item => {
            if (ElementReferenceProperty.is(item)) {
                return renderReference(item);
            }

            return null;
        });

        return (
            <div className='body'>
                <BTextfield
                    id='search'
                    onInput={((event: ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value)) as any}
                    placeholder='Search'
                    value={searchText}
                >
                    <span className='codicon codicon-search' slot='start' />
                </BTextfield>

                <BDivider />

                {gridTemplates.length > 0 && <div className='grid'>{gridTemplates}</div>}

                {gridTemplates.length > 0 && referenceTemplates.length > 0 && <BDivider />}

                {referenceTemplates}
            </div>
        );
    }, [onPropertyChange, properties, renderReference, searchText]);

    return (
        <div>
            {renderHeader()}
            {renderBody()}
        </div>
    );
}

function extractReferences(items: ElementProperty[]): { references: ElementReferenceProperty[]; other: ElementProperty[] } {
    const group = groupBy(items, item => item.type === 'REFERENCE');

    return {
        references: (group['true'] as ElementReferenceProperty[]) ?? [],
        other: group['false'] ?? []
    };
}
