/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { BigCheckbox, BigDropdown, BigTextField, VSCodeContext } from '@borkdominik-biguml/big-components';
import { type Action } from '@eclipse-glsp/protocol';
import { VSCodeButton, VSCodeDivider, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { groupBy } from 'lodash';
import { useCallback, useContext, useEffect, useState, type ChangeEvent, type ReactElement } from 'react';
import {
    ElementBoolProperty,
    ElementChoiceProperty,
    ElementReferenceProperty,
    ElementTextProperty,
    RefreshPropertyPaletteAction,
    SetPropertyPaletteAction,
    UpdateElementPropertyAction,
    type ElementProperties,
    type ElementProperty
} from '../common/index.js';
import {
    PropertyPaletteReferenceItem,
    type PropertyDeleteEventDetail,
    type PropertyNameChangeDetail,
    type PropertyOrderDetail
} from './property-palette-reference-item.component.js';

export function PropertyPalette(): ReactElement {
    const { clientId, listenAction, dispatchAction } = useContext(VSCodeContext);
    const [properties, setProperties] = useState<ElementProperties | undefined>();
    const [navigationIds, setNavigationIds] = useState<{ [key: string]: { from: string; to: string }[] }>({});
    const [searchText, setSearchText] = useState<string>('');

    const onNotification = useCallback((action: Action) => {
        if (SetPropertyPaletteAction.is(action)) {
            setProperties(action.palette);
        }
    }, []);

    useEffect(() => {
        listenAction(onNotification);
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

    const onNavigateBack = useCallback(() => {
        if (!clientId) {
            return;
        }

        const ids = [...navigationIds[clientId]];
        if (ids.length > 0) {
            const elementId = ids.pop()?.from;
            dispatchAction(
                RefreshPropertyPaletteAction.create({
                    elementId
                })
            );
        }
    }, [clientId, navigationIds, dispatchAction]);

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

    const onOrderChange = useCallback(
        (event: PropertyOrderDetail) => {
            const { element, updates } = event;

            dispatchAction(
                UpdateElementPropertyAction.create({
                    elementId: element.elementId,
                    propertyId: `${element.propertyId}_index`,
                    value: JSON.stringify(updates)
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
                RefreshPropertyPaletteAction.create({
                    elementId
                })
            );
        },
        [properties, clientId, dispatchAction, navigationIds]
    );

    const onPropertyNameChange = useCallback(
        (event: PropertyNameChangeDetail) => {
            const { elementId, name } = event;

            dispatchAction(
                UpdateElementPropertyAction.create({
                    elementId,
                    propertyId: 'name',
                    value: name
                })
            );
        },
        [dispatchAction]
    );

    const onPropertyCreate = useCallback(
        (event: ElementReferenceProperty.CreateReference) => {
            dispatchAction(event.action);
        },
        [dispatchAction]
    );

    const onPropertyDelete = useCallback(
        (event: PropertyDeleteEventDetail) => {
            dispatchAction(event.references.flatMap(r => r.deleteActions) as any as Action);
        },
        [dispatchAction]
    );

    const renderReference = useCallback(
        (item: ElementReferenceProperty) => {
            return (
                <PropertyPaletteReferenceItem
                    item={item}
                    onPropertyCreate={onPropertyCreate}
                    onPropertyDelete={onPropertyDelete}
                    onPropertyNameChange={onPropertyNameChange}
                    onPropertyNavigate={onPropertyNavigate}
                    onPropertyOrderChange={onOrderChange}
                />
            );
        },
        [onOrderChange, onPropertyCreate, onPropertyDelete, onPropertyNameChange, onPropertyNavigate]
    );

    const renderHeader = useCallback(() => {
        if (clientId && navigationIds[clientId]?.length > 0) {
            return (
                <header>
                    <VSCodeButton appearance='icon' id='navigate-back' onClick={onNavigateBack}>
                        <span className='codicon codicon-chevron-left' />
                    </VSCodeButton>
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
                    <BigTextField
                        key={item.propertyId}
                        label={item.label}
                        value={item.text}
                        onDidChangeValue={value => onPropertyChange(item, value)}
                    />
                );
            } else if (ElementBoolProperty.is(item)) {
                return (
                    <BigCheckbox
                        key={item.propertyId}
                        label={item.label}
                        value={item.value}
                        onDidChangeValue={value => onPropertyChange(item, value + '')}
                    />
                );
            } else if (ElementChoiceProperty.is(item)) {
                return (
                    <BigDropdown
                        key={item.propertyId}
                        label={item.label}
                        disabled={item.disabled}
                        choice={item.choice}
                        choices={item.choices}
                        onDidChangeValue={value => onPropertyChange(item, value)}
                    ></BigDropdown>
                );
            }

            return null;
        });

        const referenceTemplates = referenceItems.map((item: any) => {
            if (ElementReferenceProperty.is(item)) {
                return renderReference(item);
            }

            return null;
        });

        return (
            <div className='body'>
                <VSCodeTextField
                    id='search'
                    onInput={((event: ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value)) as any}
                    placeholder='Search'
                    value={searchText}
                >
                    <span className='codicon codicon-search' slot='start' />
                </VSCodeTextField>

                <VSCodeDivider />

                {gridTemplates.length > 0 && <div className='grid'>{gridTemplates}</div>}

                {gridTemplates.length > 0 && referenceTemplates.length > 0 && <VSCodeDivider />}

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
