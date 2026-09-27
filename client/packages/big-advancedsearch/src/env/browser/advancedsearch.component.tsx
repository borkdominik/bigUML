/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { BButton, BOption, BSingleSelect, BTextfield, VSCodeContext } from '@borkdominik-biguml/big-components';
import { useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';

import { AdvancedSearchActionResponse, RequestAdvancedSearchAction } from '../common/advancedsearch.action.js';
import { HighlightElementActionResponse, RequestHighlightElementAction } from '../common/highlight.action.js';
import { ModelChangedNotification } from '../common/model-change.notification.js';
import { applyExactReplacement, applyReplacement } from '../common/replace-semantics.js';
import { ReplaceActionResponse, RequestReplaceAction, type ReplaceResult } from '../common/replace.action.js';
import { FILTER_SPECS, isTokenProperty, SPEC_BY_KEY } from '../common/search-filter-spec.js';
import { UndoNotification } from '../common/undo.notification.js';
import { PreviewsDisabledNotification, PreviewsEnabledNotification, ToggleSyntaxNotification } from '../common/view-chrome.notification.js';

import type { SearchFilterSpec } from '../common/search-filter-spec.js';
import type { SearchResult } from '../common/searchresult.js';
import { SearchResultThumbnail } from './search-result-thumbnail.component.js';

type QueryableFilter = SearchFilterSpec;

const QUERYABLE_FILTERS: QueryableFilter[] = FILTER_SPECS;

function getFilterValueHint(filter: QueryableFilter): string {
    switch (filter.valueType) {
        case 'boolean':
            return 'boolean: true or false';
        case 'number':
            return 'number';
        default:
            return `string: ${filter.key}="value"`;
    }
}

const CHEATSHEET = [
    {
        category: 'Basic',
        entries: [
            { syntax: 'Class', description: 'All classes' },
            { syntax: 'Attribute', description: 'All attributes' },
            { syntax: 'Method', description: 'All methods' },
            { syntax: 'Relationship', description: 'All relationships (relation)' }
        ]
    },
    {
        category: 'Filters',
        entries: [
            { syntax: 'Class[name="Foo"]', description: 'Class named Foo (exact)' },
            { syntax: 'Class[name~"Foo"]', description: 'Class whose name contains Foo' },
            { syntax: 'Class[isAbstract=true]', description: 'Abstract classes' },
            { syntax: 'Class[visibility="PUBLIC"]', description: 'Public classes' },
            { syntax: 'Attribute[isDerived=true]', description: 'Derived attributes' },
            { syntax: 'Attribute[propertyType="String"]', description: 'Attributes of type String' },
            { syntax: 'Method[isStatic=true]', description: 'Static methods' },
            { syntax: 'Relationship[relationType="ASSOCIATION"]', description: 'Associations' }
        ]
    },
    {
        category: 'Children ( > )',
        entries: [
            { syntax: 'Class > Attribute', description: 'Classes that have attributes' },
            { syntax: 'Class > Method', description: 'Classes that have methods' },
            { syntax: 'Class > Method > Parameter', description: 'Classes with methods that have parameters. A class that has a method that has a parameter' },
            { syntax: 'Class[name="Foo"] > Attribute[isDerived=true]', description: 'Foo with derived attributes' }
        ]
    },
    {
        category: 'Relationships',
        entries: [
            { syntax: 'Relationship[source=Class[name="Foo"]]', description: 'Edges from class Foo' },
            { syntax: 'Relationship[target=Class[name="Bar"]]', description: 'Edges to class Bar' },
            { syntax: 'Relationship[sourceAggregation="NONE"]', description: 'By aggregation type' }
        ]
    },
    {
        category: 'Operators',
        entries: [
            { syntax: '=', description: 'Equals' },
            { syntax: '~', description: 'Contains (partial match)' }
        ]
    }
];

function getBadgeClass(type: string): string {
    const t = type.toLowerCase();
    if (t === 'class' || t === 'abstractclass') return 'result-item__tag--class';
    if (t === 'property' || t === 'attribute') return 'result-item__tag--attribute';
    if (t === 'operation' || t === 'method') return 'result-item__tag--method';
    if (
        [
            'association',
            'aggregation',
            'composition',
            'generalization',
            'dependency',
            'abstraction',
            'usage',
            'realization',
            'interfacerealization',
            'substitution',
            'packageimport',
            'packagemerge'
        ].includes(t)
    )
        return 'result-item__tag--relationship';
    return 'result-item__tag--default';
}

// SVG preview extraction (diagram thumbnails for results)

interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ExtractedElement {
    markup: string;
    bounds?: Bounds;
    ancestorId?: string;
}

interface DiagramSvgData {
    defs: string;
    byId: Map<string, ExtractedElement>;
}

const EMPTY_SVG_DATA: DiagramSvgData = { defs: '', byId: new Map() };

/** Sprotty prefixes element IDs (e.g. "uml-diagram_0_<semanticId>"); take the last segment. */
function semanticIdOf(elementId: string): string {
    const lastUnderscoreIdx = elementId.lastIndexOf('_');
    return lastUnderscoreIdx >= 0 ? elementId.substring(lastUnderscoreIdx + 1) : elementId;
}

/** Walk up the SVG to the nearest ancestor `<g>` that is bounds-aware (has a sizing rect). */
function findBoundedAncestorId(group: Element): string | undefined {
    let el = group.parentElement;
    while (el) {
        if (el.tagName.toLowerCase() === 'g' && el.hasAttribute('id')) {
            const bounds = parseSprottyBounds(el);
            if (bounds && bounds.width > 0 && bounds.height > 0) {
                return semanticIdOf(el.getAttribute('id')!);
            }
        }
        el = el.parentElement;
    }
    return undefined;
}

/**
 * Parse the full diagram SVG and extract per-element `<g>` subtrees by their ID.
 * Sprotty assigns element IDs to `<g>` groups in the rendered SVG. Nodes carry bounds
 * (from a child <rect>); edges are kept too (without bounds) so relations can be composed.
 */
function extractElementsFromSvg(fullSvg: string): DiagramSvgData {
    const byId = new Map<string, ExtractedElement>();
    const parser = new DOMParser();
    const doc = parser.parseFromString(fullSvg, 'image/svg+xml');

    const defsEl = doc.querySelector('defs');
    const defs = defsEl ? new XMLSerializer().serializeToString(defsEl) : '';

    const serializer = new XMLSerializer();
    const groups = doc.querySelectorAll('g[id]');

    for (const group of groups) {
        const elementId = group.getAttribute('id');
        if (!elementId) {
            continue;
        }
        const rawBounds = parseSprottyBounds(group);
        const bounds = rawBounds && rawBounds.width > 0 && rawBounds.height > 0 ? rawBounds : undefined;
        const markup = serializer.serializeToString(group);
        const semanticId = semanticIdOf(elementId);

        // For bounds-less children, remember the enclosing node so we can show it as a fallback preview.
        const ancestorId = bounds ? undefined : findBoundedAncestorId(group);

        // Don't let a bounds-less group (e.g. an edge) clobber a node already mapped to the same id.
        const existing = byId.get(semanticId);
        if (existing?.bounds && !bounds) {
            continue;
        }
        byId.set(semanticId, { markup, bounds, ancestorId });
    }

    return { defs, byId };
}

function unionBounds(a: Bounds, b: Bounds): Bounds {
    const minX = Math.min(a.x, b.x);
    const minY = Math.min(a.y, b.y);
    const maxX = Math.max(a.x + a.width, b.x + b.width);
    const maxY = Math.max(a.y + a.height, b.y + b.height);
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/**
 * Re-render the ancestor markup with the matched descendant emphasized (accent fill + bold),
 * so a child result (e.g. a property) is recognizable within its parent's preview.
 */
function highlightDescendant(markup: string, childId: string): string {
    const doc = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${markup}</svg>`, 'image/svg+xml');
    const root = doc.documentElement;
    const target = root.querySelector(`[id="${childId}"], [id$="_${childId}"]`);
    if (target) {
        target.querySelectorAll('text, tspan').forEach(textEl => {
            const style = (textEl as unknown as ElementCSSInlineStyle).style;
            style.setProperty('fill', 'var(--vscode-textLink-foreground, #4ea1ff)', 'important');
            style.setProperty('font-weight', 'bold', 'important');
        });
    }
    return root.firstElementChild ? new XMLSerializer().serializeToString(root.firstElementChild) : markup;
}

/**
 * Build the SVG + bounds for a result's preview.
 * - Relations (have source/target ids): compose the two endpoint nodes plus the connector
 *   into one crop spanning both, so the preview is meaningful rather than a lone line.
 * - Nodes: the element's own `<g>` cropped to its bounds.
 * - Bounds-less children (e.g. a property): the nearest bounds-aware ancestor (the class),
 *   with the matched child highlighted within it.
 */
function buildPreview(item: SearchResult, data: DiagramSvgData): { svg: string; bounds: Bounds } | undefined {
    if (item.sourceId && item.targetId) {
        const src = data.byId.get(item.sourceId);
        const tgt = data.byId.get(item.targetId);
        if (src?.bounds && tgt?.bounds) {
            const edgeMarkup = data.byId.get(item.id)?.markup ?? '';
            return {
                svg: data.defs + edgeMarkup + src.markup + tgt.markup,
                bounds: unionBounds(src.bounds, tgt.bounds)
            };
        }
        return undefined;
    }

    const own = data.byId.get(item.id);
    if (own?.bounds) {
        return { svg: data.defs + own.markup, bounds: own.bounds };
    }
    if (own?.ancestorId) {
        const ancestor = data.byId.get(own.ancestorId);
        if (ancestor?.bounds) {
            return { svg: data.defs + highlightDescendant(ancestor.markup, item.id), bounds: ancestor.bounds };
        }
    }
    return undefined;
}

/**
 * Extract position and size from a Sprotty-rendered `<g>` element.
 * Position comes from `transform="translate(x, y)"`.
 * Size comes from the first child `<rect>` with width/height attributes.
 */
function parseSprottyBounds(group: Element): { x: number; y: number; width: number; height: number } | undefined {
    const transform = group.getAttribute('transform') ?? '';
    const translateMatch = transform.match(/translate\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/);
    const x = translateMatch ? parseFloat(translateMatch[1]) : 0;
    const y = translateMatch ? parseFloat(translateMatch[2]) : 0;

    const rect = group.querySelector('rect');
    if (rect) {
        const width = parseFloat(rect.getAttribute('width') ?? '0');
        const height = parseFloat(rect.getAttribute('height') ?? '0');
        if (width > 0 && height > 0) {
            return { x, y, width, height };
        }
    }
    return undefined;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ReplaceStatus {
    ok: boolean;
    message: string;
    detail?: string;
    /** True after a successful replace that actually mutated at least one row. */
    canUndo?: boolean;
}

function computeNewValue(
    oldValue: string | undefined,
    find: string,
    replaceWith: string,
    caseSensitive: boolean,
    exact: boolean
): string | undefined {
    if (typeof oldValue !== 'string' || find === '') {
        return oldValue;
    }
    return exact ? applyExactReplacement(oldValue, find, replaceWith, caseSensitive) : applyReplacement(oldValue, find, replaceWith, caseSensitive);
}

type PropertyInputType = 'text' | 'select';

interface PropertyConfig {
    label: string;
    inputType: PropertyInputType;
    values?: readonly string[];
}

const PROPERTY_LABEL_OVERRIDES: Record<string, string> = {
    uri: 'URI',
    parameterDirection: 'Direction',
    effectType: 'Effect',
    sourceAggregation: 'Source Aggregation',
    targetAggregation: 'Target Aggregation'
};

const BOOLEAN_VALUES = ['true', 'false'] as const;

function humanizeKey(key: string): string {
    return key
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Model-change notifications arriving within this window after a replace are
// attributed to the replace itself and must not retire its status/Undo button.
const REPLACE_STATUS_GRACE_MS = 2000;

function getPropertyConfig(prop: string): PropertyConfig {
    const label = PROPERTY_LABEL_OVERRIDES[prop] ?? humanizeKey(prop);
    const spec = SPEC_BY_KEY.get(prop);

    if (spec?.valueType === 'boolean') {
        return { label, inputType: 'select', values: BOOLEAN_VALUES };
    }
    if (spec?.values && spec.values.length > 0) {
        return { label, inputType: 'select', values: spec.values };
    }
    return { label, inputType: 'text' };
}

function propertyLabel(prop: string): string {
    return getPropertyConfig(prop).label;
}

function getCurrentValue(r: SearchResult, prop: string): string | undefined {
    if (r.properties && prop in r.properties) return r.properties[prop];
    // Backwards compat for results predating the properties map.
    if (prop === 'name' && typeof r.name === 'string') return r.name;
    return undefined;
}

export function AdvancedSearch(): ReactElement {
    const { clientId, dispatchAction, dispatchNotification, listenAction, listenNotification } = useContext(VSCodeContext);
    const [query, setQuery] = useState('');
    const queryRef = useRef('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [searchError, setSearchError] = useState<string | undefined>(undefined);
    // Value of the query's name filter, parsed server-side (single source of
    // truth: the same parser that produced the results).
    const [serverFindPattern, setServerFindPattern] = useState('');
    const [replaceOpen, setReplaceOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState('name');
    // Used as the find pattern when `selectedProperty !== 'name'`. For the name
    // property the find pattern is derived from the search query instead, so we
    // never need an override field for that case.
    const [findOverride, setFindOverride] = useState('');
    const [replaceWith, setReplaceWith] = useState('');
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
    const [outcomes, setOutcomes] = useState<Map<string, ReplaceResult>>(new Map());
    const [replaceStatus, setReplaceStatus] = useState<ReplaceStatus | undefined>(undefined);
    // Cheatsheet + SVG-preview UI state (from the search/preview feature).
    const [showCheatsheet, setShowCheatsheet] = useState(false);
    const [fullDiagramSvg, setFullDiagramSvg] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [showAllPreviews, setShowAllPreviews] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Refs mirroring context values so the once-registered model-change
    // listener never works with stale closures.
    const clientIdRef = useRef(clientId);
    const dispatchActionRef = useRef(dispatchAction);
    const lastReplaceAtRef = useRef(0);
    const cheatsheetRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        clientIdRef.current = clientId;
        dispatchActionRef.current = dispatchAction;
    }, [clientId, dispatchAction]);

    const fireSearch = (value: string) => {
        setQuery(value);
        queryRef.current = value;
        setOutcomes(new Map());
        setReplaceStatus(undefined);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            if (clientId) {
                if (!fullDiagramSvg) {
                    setLoading(true);
                }
                dispatchAction(RequestAdvancedSearchAction.create({ query: value }));
            }
        }, 150);
    };

    // Find pattern source depends on the selected property: for `name` it's
    // the query's name filter as parsed by the server, for any other property
    // the user supplies a value via `findOverride`.
    const findPattern = useMemo(() => {
        if (selectedProperty === 'name') return serverFindPattern;
        return findOverride.trim();
    }, [serverFindPattern, selectedProperty, findOverride]);

    // Properties offered in the property selector. Always includes `name` and
    // the currently selected property (so the dropdown stays valid even when no
    // row publishes it); other entries come from whatever results expose.
    const availableProperties = useMemo(() => {
        const set = new Set<string>(['name']);

        for (const r of results) {
            if (r.properties) {
                for (const k of Object.keys(r.properties)) set.add(k);
            }
        }

        return Array.from(set);
    }, [results]);

    useEffect(() => {
        if (!availableProperties.includes(selectedProperty)) {
            setSelectedProperty('name');
            setFindOverride('');
            setReplaceWith('');
            setOutcomes(new Map());
            setReplaceStatus(undefined);
        }
    }, [availableProperties, selectedProperty]);

    const onPropertyChange = (next: string) => {
        setSelectedProperty(next);
        // Reset transient input so switching property doesn't leak a stale
        // pattern or replacement.
        setFindOverride('');
        setReplaceWith('');
        setOutcomes(new Map());
        setReplaceStatus(undefined);
    };

    const highlight = (item: SearchResult) => {
        const semanticUri = (item as any).semanticUri ?? item.id;
        if (!clientId || !semanticUri) return;
        // Relations: fit to the connected nodes since the edge itself has no fittable bounds.
        const fitElementIds = item.sourceId && item.targetId ? [item.sourceId, item.targetId] : undefined;
        dispatchAction(RequestHighlightElementAction.create({ semanticUri, fitElementIds }));
    };

    // Parse the full SVG once into shared <defs> + a per-element lookup of markup/bounds.
    const svgData = useMemo(() => {
        if (!fullDiagramSvg) {
            return EMPTY_SVG_DATA;
        }
        return extractElementsFromSvg(fullDiagramSvg);
    }, [fullDiagramSvg]);

    const applyDiagramHighlighting = useCallback((matchedIds: string[]) => {
        const sprottyRoot = document.querySelector('.sprotty');
        if (!sprottyRoot) return;

        if (matchedIds.length > 0) {
            sprottyRoot.classList.add('search-active');
        } else {
            sprottyRoot.classList.remove('search-active');
        }

        sprottyRoot.querySelectorAll('.search-match').forEach(el => {
            el.classList.remove('search-match');
        });

        for (const id of matchedIds) {
            const el = sprottyRoot.querySelector(`[id="${id}"]`);
            if (el) el.classList.add('search-match');
        }
    }, []);

    // Registered once; reacts to any diagram model change (replace, manual
    // edit, undo/redo) reported by the extension host.
    useEffect(() => {
        listenNotification(ModelChangedNotification.TYPE, () => {
            // Refresh the current result list so names reflect the new model.
            if (clientIdRef.current) {
                dispatchActionRef.current(RequestAdvancedSearchAction.create({ query: queryRef.current }));
            }
            // Retire the replace status (and its Undo button) unless this
            // change is the replace we just performed — after an unrelated
            // edit, the button would undo that edit instead of the replace.
            if (Date.now() - lastReplaceAtRef.current > REPLACE_STATUS_GRACE_MS) {
                setReplaceStatus(undefined);
            }
        });
        listenNotification(ToggleSyntaxNotification.TYPE, () => setShowCheatsheet(prev => !prev));
        listenNotification(PreviewsEnabledNotification.TYPE, () => setShowAllPreviews(true));
        listenNotification(PreviewsDisabledNotification.TYPE, () => setShowAllPreviews(false));
        // listenNotification has no disposal handle; register exactly once.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!showCheatsheet) return;
        const onMouseDown = (e: MouseEvent) => {
            if (cheatsheetRef.current && !cheatsheetRef.current.contains(e.target as Node)) {
                setShowCheatsheet(false);
            }
        };
        document.addEventListener('mousedown', onMouseDown);
        return () => document.removeEventListener('mousedown', onMouseDown);
    }, [showCheatsheet]);

    const dispatchReplace = (elementIds: string[]) => {
        if (!clientId || elementIds.length === 0 || findPattern === '') {
            return;
        }
        setReplaceStatus(undefined);
        lastReplaceAtRef.current = Date.now();
        dispatchAction(
            RequestReplaceAction.create({
                elementIds,
                searchPattern: findPattern,
                replaceWith,
                property: selectedProperty,
                caseSensitive
            })
        );
    };

    const toggleExcluded = (id: string) => {
        setExcludedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Per-row preview of the new value for the selected property (client-side;
    // mirrors backend semantics). `current` is undefined when the row doesn't
    // expose the selected property — those rows render as a missing-value
    // placeholder and stay disabled for replace.
    const previews = useMemo(() => {
        const map = new Map<string, { current: string | undefined; newValue: string; changes: boolean; invalid: boolean }>();
        if (!replaceOpen) return map;
        const exact = isTokenProperty(selectedProperty);
        for (const r of results) {
            const current = getCurrentValue(r, selectedProperty);
            const computed = computeNewValue(current, findPattern, replaceWith, caseSensitive, exact);
            const newValue = typeof computed === 'string' ? computed : (current ?? '');
            const changes = typeof current === 'string' && newValue !== current;
            // Mirrors the backend guard: a replace must not wipe the value.
            const invalid = changes && newValue.trim() === '';
            map.set(r.id, { current, newValue, changes, invalid });
        }
        return map;
    }, [results, findPattern, replaceWith, caseSensitive, replaceOpen, selectedProperty]);

    const includedIds = useMemo(() => results.filter(r => !excludedIds.has(r.id)).map(r => r.id), [results, excludedIds]);

    // "Will modify N of M" counts only rows that are included AND whose preview
    // actually changes into a valid (non-empty) value.
    const willChangeCount = useMemo(
        () =>
            results.filter(r => {
                if (excludedIds.has(r.id)) return false;
                const p = previews.get(r.id);
                return !!p?.changes && !p.invalid;
            }).length,
        [results, excludedIds, previews]
    );

    const replaceAllDisabled = includedIds.length === 0 || findPattern === '' || willChangeCount === 0;

    useEffect(() => {
        const handler = (action: unknown) => {
            if (AdvancedSearchActionResponse.is(action)) {
                // Background SVG export status — just toggle the loading indicator, keep current results.
                if (action.exportInFlight !== undefined) {
                    setLoading(action.exportInFlight);
                    return;
                }

                // Normal results update
                setResults(action.results);
                setSearchError(action.error);
                setServerFindPattern(action.findPattern ?? '');
                const ids = action.results.map(r => r.id).filter(Boolean);
                applyDiagramHighlighting(ids);
                const idSet = new Set(action.results.map(r => r.id));
                // Keep outcomes for rows that survived the refresh (the panel
                // re-searches right after a replace — wiping the map here made
                // the outcome icons flash and disappear). User-initiated query
                // changes still clear outcomes in fireSearch.
                setOutcomes(prev => {
                    if (prev.size === 0) return prev;
                    const next = new Map<string, ReplaceResult>();
                    for (const [id, outcome] of prev) {
                        if (idSet.has(id)) next.set(id, outcome);
                    }
                    return next.size === prev.size ? prev : next;
                });
                // Drop excluded IDs that no longer exist in the new result set.
                setExcludedIds(prev => {
                    if (prev.size === 0) return prev;
                    let mutated = false;
                    const next = new Set<string>();
                    for (const id of prev) {
                        if (idSet.has(id)) {
                            next.add(id);
                        } else {
                            mutated = true;
                        }
                    }
                    return mutated ? next : prev;
                });

                // Refresh the cached diagram SVG so thumbnails reflect the new model.
                const svg = action.fullDiagramSvg;
                if (svg) {
                    setFullDiagramSvg(svg);
                } else if (action.results.length === 0) {
                    setFullDiagramSvg(undefined);
                }

                // Loading while results exist but their SVG hasn't arrived yet.
                setLoading(action.results.length > 0 && !svg);
                return;
            }

            if (HighlightElementActionResponse.is(action)) {
                if (action.ok) {
                    return;
                }
            }
            if (ReplaceActionResponse.is(action)) {
                if (action.ok) {
                    const list = action.results ?? [];
                    const changedRows = list.filter(r => r.changed);
                    const erroredRows = list.filter(r => !r.success);
                    // Merge so a single-row replace doesn't wipe the outcome
                    // icons of rows replaced earlier.
                    setOutcomes(prev => {
                        const next = new Map(prev);
                        for (const r of list) {
                            next.set(r.id, r);
                        }
                        return next;
                    });
                    const detail =
                        erroredRows.length > 0
                            ? `${erroredRows.length} error${erroredRows.length !== 1 ? 's' : ''}: ${erroredRows
                                .slice(0, 3)
                                .map(r => r.error ?? 'unknown')
                                .join('; ')}`
                            : undefined;
                    setReplaceStatus({
                        ok: true,
                        message: `Replaced ${changedRows.length} element${changedRows.length !== 1 ? 's' : ''}.`,
                        detail,
                        canUndo: changedRows.length > 0
                    });
                    // Refresh the result list so names reflect the new model state.
                    if (clientId) {
                        dispatchAction(RequestAdvancedSearchAction.create({ query: queryRef.current }));
                    }
                } else {
                    setReplaceStatus({ ok: false, message: `Error: ${action.error ?? 'Replace failed'}` });
                }
            }
        };
        listenAction(handler);

        return () => {
            const sprottyRoot = document.querySelector('.sprotty');
            if (sprottyRoot) {
                sprottyRoot.classList.remove('search-active');
                sprottyRoot.querySelectorAll('.search-match').forEach(el => el.classList.remove('search-match'));
            }
        };
    }, [listenAction, applyDiagramHighlighting, clientId, dispatchAction]);

    const hasResults = results.length > 0;
    const isSearching = query.trim().length > 0;
    const selectedPropertyConfig = getPropertyConfig(selectedProperty);
    const selectedFindValues = selectedPropertyConfig.values ?? [];
    const selectedReplaceValues = selectedPropertyConfig.values ?? [];

    return (
        <div className='advanced-search'>
            <div className='advanced-search__controls'>
                <div className='advanced-search__search-row'>
                    <button disabled={!hasResults}
                        type='button'
                        className={`advanced-search__toggle ${hasResults ? '' : 'disable-btn'} ${replaceOpen ? 'advanced-search__toggle--open' : ''}`}
                        title={replaceOpen ? 'Hide replace' : 'Show replace'}
                        aria-expanded={replaceOpen}
                        aria-label='Toggle replace'
                        onClick={() => setReplaceOpen(o => !o)}
                    >
                        <span className={`codicon codicon-chevron-${replaceOpen ? 'down' : 'right'}`} />
                    </button>

                    <BTextfield
                        className='advanced-search__text'
                        value={query}
                        placeholder='e.g. Class[name~"User"]'
                        onInput={e => fireSearch((e.target as HTMLInputElement).value)}
                    >
                        <span slot='end' className='codicon codicon-search' />
                    </BTextfield>
                </div>

                {replaceOpen && hasResults && (
                    <div className='advanced-search__replace-block'>
                        <div className='advanced-search__replace-controls'>
                            <span className='advanced-search__replace-word'>In</span>
                            <BSingleSelect
                                className='advanced-search__property-select'
                                aria-label='Property to replace'
                                value={selectedProperty}
                                onChange={(e: any) => onPropertyChange((e.target as HTMLSelectElement).value)}
                            >
                                {availableProperties.map(p => (
                                    <BOption key={p} value={p}>
                                        {propertyLabel(p)}
                                    </BOption>
                                ))}
                            </BSingleSelect>

                            {selectedProperty === 'name' ? (
                                <span className={`advanced-search__find-chip ${findPattern === '' ? 'advanced-search__find-chip--empty' : ''}`}>
                                    {findPattern === '' ? 'name filter' : findPattern}
                                </span>
                            ) : selectedPropertyConfig.inputType === 'select' ? (
                                <BSingleSelect
                                    className='advanced-search__replace-input'
                                    aria-label='Value to find'
                                    value={findOverride}
                                    onChange={(e: any) => setFindOverride((e.target as HTMLSelectElement).value)}
                                >
                                    <BOption value=''>—</BOption>
                                    {selectedFindValues.map(v => (
                                        <BOption key={v} value={v}>
                                            {v}
                                        </BOption>
                                    ))}
                                </BSingleSelect>
                            ) : (
                                <BTextfield
                                    className='advanced-search__replace-input'
                                    aria-label='Value to find'
                                    value={findOverride}
                                    placeholder='find…'
                                    onInput={e => setFindOverride((e.target as HTMLInputElement).value)}
                                />
                            )}

                            <span className='advanced-search__replace-arrow codicon codicon-arrow-right' />
                            {selectedPropertyConfig.inputType !== 'select' && (
                                <button
                                    type='button'
                                    className={`advanced-search__option ${caseSensitive ? 'advanced-search__option--active' : ''}`}
                                    title={`Match case (${caseSensitive ? 'on' : 'off'})`}
                                    aria-pressed={caseSensitive}
                                    aria-label='Match case'
                                    onClick={() => setCaseSensitive(v => !v)}
                                >
                                    <span className='codicon codicon-case-sensitive' />
                                </button>
                            )}
                            {selectedPropertyConfig.inputType === 'select' ? (
                                <BSingleSelect
                                    className='advanced-search__replace-input'
                                    value={replaceWith}
                                    onChange={(e: any) => setReplaceWith((e.target as HTMLSelectElement).value)}
                                >
                                    <BOption value=''>replace with…</BOption>
                                    {selectedReplaceValues.map(v => (
                                        <BOption key={v} value={v}>
                                            {v}
                                        </BOption>
                                    ))}
                                </BSingleSelect>
                            ) : (
                                <BTextfield
                                    className='advanced-search__replace-input'
                                    value={replaceWith}
                                    placeholder='replace with…'
                                    onInput={e => setReplaceWith((e.target as HTMLInputElement).value)}
                                >
                                    <span slot='end' className='codicon codicon-replace' />
                                </BTextfield>
                            )}
                            <BButton
                                className='advanced-search__replace-btn'
                                onClick={() => dispatchReplace(includedIds)}
                                disabled={replaceAllDisabled}
                                title={
                                    findPattern === ''
                                        ? selectedProperty === 'name'
                                            ? 'Add a name filter (e.g. Class[name~"User"]) to enable replace'
                                            : `Pick a ${propertyLabel(selectedProperty).toLowerCase()} value to find`
                                        : willChangeCount === 0
                                            ? 'No included row would change'
                                            : `Replace ${willChangeCount} element${willChangeCount !== 1 ? 's' : ''}`
                                }
                            >
                                Replace All
                            </BButton>
                        </div>
                        <p className='advanced-search__replace-hint'>
                            {findPattern === ''
                                ? selectedProperty === 'name'
                                    ? 'Add a name filter (e.g. Class[name~"User"]) to preview changes.'
                                    : `Pick a ${propertyLabel(selectedProperty).toLowerCase()} value to find.`
                                : `Will modify ${willChangeCount} of ${includedIds.length} included element${includedIds.length !== 1 ? 's' : ''}.`}
                        </p>
                    </div>
                )}

                {replaceOpen && replaceStatus && (
                    <div
                        className={`advanced-search__replace-status advanced-search__replace-status--${replaceStatus.ok ? 'ok' : 'error'}`}
                    >
                        <span className={`codicon codicon-${replaceStatus.ok ? 'check' : 'error'}`} />
                        <span className='advanced-search__replace-status-message'>{replaceStatus.message}</span>
                        {replaceStatus.canUndo && (
                            <button
                                type='button'
                                className='advanced-search__undo-btn'
                                title='Undo this replace (Ctrl+Z)'
                                onClick={() => {
                                    // No optimistic clear: the undo round-trips
                                    // through the diagram client, and the model-
                                    // change notification it causes retires the
                                    // status. If nothing happens (no active
                                    // client), the button honestly stays.
                                    lastReplaceAtRef.current = 0;
                                    dispatchNotification(UndoNotification.TYPE);
                                }}
                            >
                                <span className='codicon codicon-discard' />
                                <span>Undo</span>
                            </button>
                        )}
                        {replaceStatus.detail && <small>{replaceStatus.detail}</small>}
                    </div>
                )}
            </div>

            {showCheatsheet && (
                <div className='advanced-search__cheatsheet' ref={cheatsheetRef}>
                    <div className='cheatsheet__header'>
                        <span className='cheatsheet__title'>Query syntax</span>
                        <button
                            type='button'
                            className='cheatsheet__close'
                            title='Close'
                            aria-label='Close syntax help'
                            onClick={() => setShowCheatsheet(false)}
                        >
                            <span className='codicon codicon-close' />
                        </button>
                    </div>
                    <p className='cheatsheet__intro'>Use structured queries to find elements by type, properties, and relationships. The search is case-insensitive.</p>
                    {CHEATSHEET.map(section => (
                        <div key={section.category} className='cheatsheet__section'>
                            <div className='cheatsheet__category'>{section.category}</div>
                            {section.entries.map((entry, idx) => (
                                <div
                                    key={idx}
                                    className='cheatsheet__entry'
                                    onClick={() => {
                                        fireSearch(entry.syntax);
                                        setShowCheatsheet(false);
                                    }}
                                    title='Click to use this query'
                                >
                                    <code className='cheatsheet__syntax'>{entry.syntax}</code>
                                    <span className='cheatsheet__desc'>{entry.description}</span>
                                </div>
                            ))}
                        </div>
                    ))}

                    <div className='cheatsheet__section cheatsheet__filter-reference'>
                        <div className='cheatsheet__category'>Queryable parameters</div>
                        <p className='cheatsheet__intro'>
                            A parameter can only be used with the element types listed below. All current filters use equality by default;
                            quote string values and use <code>true</code> or <code>false</code> for booleans.
                        </p>
                        {QUERYABLE_FILTERS.map(filter => (
                            <div key={filter.key} className='cheatsheet__entry cheatsheet__filter-entry'>
                                <code className='cheatsheet__syntax'>{filter.key}</code>
                                <span className='cheatsheet__desc'>
                                    {getFilterValueHint(filter)} · {filter.scopes.join(', ')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showAllPreviews && loading && <div className='advanced-search__svg-loading-bar' />}

            <div>
                {hasResults ? (
                    <ul className='advanced-search__results'>
                        {results.map((item, idx) => {
                            const excluded = excludedIds.has(item.id);
                            const preview = previews.get(item.id);
                            const outcome = outcomes.get(item.id);
                            const willChange = !!preview?.changes && !preview.invalid;
                            const thumbnail = buildPreview(item, svgData);
                            return (
                                <li
                                    key={`${item.id}-${idx}`}
                                    className={`result-item ${replaceOpen && excluded ? 'result-item--excluded' : ''} ${willChange ? 'result-item--will-change' : ''}`}
                                    onClick={() => highlight(item)}
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                >
                                    <div className='result-item__header'>
                                        {replaceOpen && (
                                            <input
                                                type='checkbox'
                                                className='result-item__include'
                                                checked={!excluded}
                                                title={excluded ? 'Include in Replace All' : 'Exclude from Replace All'}
                                                onChange={() => toggleExcluded(item.id)}
                                                onClick={e => e.stopPropagation()}
                                            />
                                        )}
                                        <span className={`result-item__tag ${getBadgeClass(item.type)}`}>{item.type}</span>
                                        <span className='result-item__name'>
                                            {selectedProperty === 'name' ? (
                                                willChange && preview ? (
                                                    <>
                                                        <span className='result-item__old'>{item.name}</span>
                                                        <span className='result-item__arrow'> → </span>
                                                        <span className='result-item__new'>{preview.newValue}</span>
                                                    </>
                                                ) : (
                                                    item.name
                                                )
                                            ) : (
                                                <>
                                                    <span>{item.name}</span>
                                                    <span className='result-item__prop-preview'>
                                                        {' · '}
                                                        <span className='result-item__prop-label'>{propertyLabel(selectedProperty)}:</span>{' '}
                                                        {preview?.current === undefined ? (
                                                            <span className='result-item__prop-missing'>—</span>
                                                        ) : willChange ? (
                                                            <>
                                                                <span className='result-item__old'>{preview.current}</span>
                                                                <span className='result-item__arrow'> → </span>
                                                                <span className='result-item__new'>{preview.newValue}</span>
                                                            </>
                                                        ) : (
                                                            <span>{preview.current}</span>
                                                        )}
                                                    </span>
                                                </>
                                            )}
                                        </span>
                                        {replaceOpen && outcome && (
                                            <span
                                                className={`result-item__outcome result-item__outcome--${!outcome.success ? 'error' : outcome.changed ? 'changed' : 'noop'
                                                    }`}
                                                title={
                                                    !outcome.success
                                                        ? outcome.error ?? 'Replace failed'
                                                        : outcome.changed
                                                            ? `Replaced: ${outcome.oldValue} → ${outcome.newValue}`
                                                            : 'No change'
                                                }
                                            >
                                                <span
                                                    className={`codicon codicon-${!outcome.success ? 'error' : outcome.changed ? 'check' : 'dash'
                                                        }`}
                                                />
                                            </span>
                                        )}
                                        {replaceOpen && (
                                            <button
                                                type='button'
                                                className='result-item__action'
                                                title={
                                                    findPattern === ''
                                                        ? selectedProperty === 'name'
                                                            ? 'Add a name filter (e.g. Class[name~"User"]) to enable replace'
                                                            : `Pick a ${propertyLabel(selectedProperty).toLowerCase()} value to find`
                                                        : willChange
                                                            ? `Replace this element: ${preview?.current ?? item.name} → ${preview?.newValue}`
                                                            : preview?.invalid
                                                                ? 'Replacement would clear the value'
                                                                : preview?.current === undefined
                                                                    ? `This element has no ${propertyLabel(selectedProperty).toLowerCase()} property`
                                                                    : 'No change in this element'
                                                }
                                                disabled={findPattern === '' || !willChange}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    dispatchReplace([item.id]);
                                                }}
                                            >
                                                <span className='codicon codicon-replace' />
                                            </button>
                                        )}
                                    </div>
                                    {item.parentName && <div className='result-item__details'>in {item.parentName}</div>}
                                    {item.details && <div className='result-item__details'>{item.details}</div>}
                                    {(showAllPreviews || hoveredIdx === idx) && (
                                        <SearchResultThumbnail svg={thumbnail?.svg} bounds={thumbnail?.bounds} loading={loading} />
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : isSearching ? (
                    searchError ? (
                        <p className='advanced-search__empty advanced-search__empty--error'>
                            <span className='codicon codicon-warning' />
                            <span>
                                &ldquo;{query}&rdquo; isn&rsquo;t a valid query.{' '}
                                <button
                                    type='button'
                                    className='advanced-search__empty-help'
                                    onClick={() => setShowCheatsheet(true)}
                                >
                                    See syntax help
                                </button>
                            </span>
                        </p>
                    ) : (
                        <p className='advanced-search__empty'>No results for &ldquo;{query}&rdquo;</p>
                    )
                ) : null}
            </div>
        </div>
    );
}
