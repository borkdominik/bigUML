/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

/**
 * THIS FILE CONTAINS WORKAROUNDS TILL GLSP-CLIENT SUPPORTS ACCESSIBILITY FOR THE DIFFERENT INTEGRATIONS
 */

import {
    type AutocompleteSuggestion,
    BaseEditTool,
    bindAsService,
    codiconCSSString,
    configureActionHandler,
    EnableDefaultToolsAction,
    FeatureModule,
    findParentByFeature,
    GChildElement,
    GEdge,
    type GLSPActionDispatcher,
    type GModelElement,
    type GModelRoot,
    GNode,
    type IActionHandler,
    type IAutocompleteSuggestionProvider,
    type ICommand,
    type ILogger,
    isBoundsAware,
    isNameable,
    isSelectable,
    isSelected,
    KeyListener,
    KeyTool,
    matchesKeystroke,
    name,
    type Selectable,
    type SelectableBoundsAware,
    SelectionService,
    toArray,
    type Tool,
    TYPES
} from '@eclipse-glsp/client';
import { SetAccessibleKeyShortcutAction } from '@eclipse-glsp/client/lib/features/accessibility/key-shortcut/accessible-key-shortcut.js';
import { type Action, CenterAction, SelectAction, TriggerEdgeCreationAction, TriggerNodeCreationAction } from '@eclipse-glsp/protocol';
import { inject, injectable } from 'inversify';

export const umlFallbackActionModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bind(UMLFallbackActionHandler).toSelf().inSingletonScope();
    configureActionHandler(context, SetAccessibleKeyShortcutAction.KIND, UMLFallbackActionHandler);
});

@injectable()
export class UMLFallbackActionHandler implements IActionHandler {
    @inject(TYPES.ILogger)
    protected logger: ILogger;

    handle(action: Action): void | Action | ICommand {
        this.logger.log(this, 'Unhandled action received:', action);
    }
}

import {
    ResizeElementAction,
    ResizeElementHandler,
    ResizeType
} from '@eclipse-glsp/client/lib/features/accessibility/resize-key-tool/resize-key-handler.js';
import { ShowToastMessageAction } from '@eclipse-glsp/client/lib/features/accessibility/toast/toast-handler.js';

export const umlResizeElementModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bind(ResizeElementHandler).toSelf().inSingletonScope();
    configureActionHandler(context, ResizeElementAction.KIND, ResizeElementHandler);
    bindAsService(context, TYPES.ITool, UMLResizeTool);
});

@injectable()
export class UMLResizeTool extends BaseEditTool {
    static ID = 'glsp.resize-tool';

    get id(): string {
        return UMLResizeTool.ID;
    }

    @inject(SelectionService) readonly selectionService: SelectionService;

    protected createResizeKeyListener(): UMLResizeKeyListener {
        return new UMLResizeKeyListener(this);
    }

    enable(): void {
        this.actionDispatcher.dispatch(
            ShowToastMessageAction.create({
                id: Symbol.for(UMLResizeKeyListener.name),
                message: "Resize On: Use plus(+) and minus(-) to resize, '0' for default size. Press 'ESC' to exit."
            })
        );
        this.toDisposeOnDisable.push(this.keyTool.registerListener(this.createResizeKeyListener()));
    }

    override disable(): void {
        this.actionDispatcher.dispatch(
            ShowToastMessageAction.createWithTimeout({
                id: Symbol.for(UMLResizeKeyListener.name),
                message: "Resize Off: Press 'ALT'+'A' for resize mode."
            })
        );
        super.disable();
    }
}

@injectable()
export class UMLResizeKeyListener extends KeyListener {
    constructor(protected readonly tool: UMLResizeTool) {
        super();
    }

    override keyDown(_element: GModelElement, event: KeyboardEvent): Action[] {
        if (this.matchesDeactivateResizeModeKeystroke(event)) {
            return [EnableDefaultToolsAction.create()];
        }

        const actions = [];
        const selectedElementsIds = this.tool.selectionService.getSelectedElementIDs();

        if (this.matchesIncreaseSizeKeystroke(event)) {
            actions.push(ResizeElementAction.create(selectedElementsIds, ResizeType.Increase));
        } else if (this.matchesDecreaseSizeKeystroke(event)) {
            actions.push(ResizeElementAction.create(selectedElementsIds, ResizeType.Decrease));
        } else if (this.matchesMinSizeKeystroke(event)) {
            actions.push(ResizeElementAction.create(selectedElementsIds, ResizeType.MinSize));
        }
        return actions;
    }

    protected matchesIncreaseSizeKeystroke(event: KeyboardEvent): boolean {
        /** here event.key is used for '+', as keycode 187 is already declared for 'Equals' in {@link matchesKeystroke}.*/
        return event.key === '+' || matchesKeystroke(event, 'NumpadAdd');
    }

    protected matchesDeactivateResizeModeKeystroke(event: KeyboardEvent): boolean {
        return matchesKeystroke(event, 'Escape');
    }

    protected matchesMinSizeKeystroke(event: KeyboardEvent): boolean {
        return matchesKeystroke(event, 'Digit0');
    }

    protected matchesDecreaseSizeKeystroke(event: KeyboardEvent): boolean {
        return matchesKeystroke(event, 'Minus') || matchesKeystroke(event, 'NumpadSubtract');
    }
}

import {
    RevealEdgeElementAutocompleteSuggestionProvider,
    RevealNamedElementAutocompleteSuggestionProvider,
    SearchAutocompletePalette
} from '@eclipse-glsp/client/lib/features/accessibility/search/search-palette.js';

export class UMLRevealNamedElementAutocompleteSuggestionProvider extends RevealNamedElementAutocompleteSuggestionProvider {
    override async retrieveSuggestions(root: Readonly<GModelRoot>, _text: string): Promise<AutocompleteSuggestion[]> {
        const nameables = toArray(root.index.all().filter(element => isNameable(element)));
        return nameables.map(nameable => ({
            element: nameable,
            action: {
                label: `[${nameable.type.split('__').at(-1)}] ${name(nameable) ?? '<no-name>'}`,
                actions: this.getActions(nameable),
                icon: codiconCSSString('eye')
            }
        }));
    }
}

export class UMLRevealEdgeElementAutocompleteSuggestionProvider extends RevealEdgeElementAutocompleteSuggestionProvider {
    override async retrieveSuggestions(root: Readonly<GModelRoot>, _text: string): Promise<AutocompleteSuggestion[]> {
        const edges = toArray(root.index.all().filter(element => element instanceof GEdge)) as GEdge[];
        return edges.map(edge => ({
            element: edge,
            action: {
                label: `[${edge.type.split('__').at(-1)}] ${this.getEdgeLabel(root, edge)}`,
                actions: this.getActions(edge),
                icon: codiconCSSString('arrow-both')
            }
        }));
    }
}

export class UMLRevealNodesWithoutNameAutocompleteSuggestionProvider implements IAutocompleteSuggestionProvider {
    async retrieveSuggestions(root: Readonly<GModelRoot>, _text: string): Promise<AutocompleteSuggestion[]> {
        const nodes = toArray(root.index.all().filter(element => !isNameable(element) && element instanceof GNode));

        return nodes.map(node => ({
            element: node,
            action: {
                label: `[${node.type}]`,
                actions: this.getActions(node),
                icon: codiconCSSString('symbol-namespace')
            }
        }));
    }

    protected getActions(nameable: GModelElement): Action[] {
        return [SelectAction.create({ selectedElementsIDs: [nameable.id] }), CenterAction.create([nameable.id], { retainZoom: true })];
    }
}

export class UMLSearchAutocompletePalette extends SearchAutocompletePalette {
    protected override getSuggestionProviders(_root: Readonly<GModelRoot>, _input: string): IAutocompleteSuggestionProvider[] {
        return [
            new UMLRevealNamedElementAutocompleteSuggestionProvider(),
            new UMLRevealEdgeElementAutocompleteSuggestionProvider(),
            new UMLRevealNodesWithoutNameAutocompleteSuggestionProvider()
        ];
    }

    protected override getHiddenElements(root: Readonly<GModelRoot>, suggestions: AutocompleteSuggestion[]): GModelElement[] {
        const hidden = toArray(
            root.index
                .all()
                .filter(element => element instanceof GNode || element instanceof GEdge)
                .filter(element => suggestions.find(suggestion => suggestion.element.id === element.id) === undefined)
        );

        return hidden.filter(h => {
            if (h instanceof GChildElement) {
                let element = h;
                while (element.parent !== undefined) {
                    if (hidden.includes(element.parent)) {
                        return false;
                    }

                    if (element.parent instanceof GChildElement) {
                        element = element.parent;
                    } else {
                        break;
                    }
                }
            }

            return true;
        });
    }
}

export const umlSearchPaletteModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bindAsService(context, TYPES.IUIExtension, UMLSearchAutocompletePalette);
});

import { SetEdgeTargetSelectionAction } from '@eclipse-glsp/client/lib/features/accessibility/edge-autocomplete/action.js';
import { EdgeAutocompletePalette } from '@eclipse-glsp/client/lib/features/accessibility/edge-autocomplete/edge-autocomplete-palette.js';
import { EdgeAutocompletePaletteTool } from '@eclipse-glsp/client/lib/features/accessibility/edge-autocomplete/edge-autocomplete-tool.js';
import {
    EnableKeyboardGridAction,
    KeyboardGridCellSelectedAction
} from '@eclipse-glsp/client/lib/features/accessibility/keyboard-grid/action.js';
import { GridSearchPalette } from '@eclipse-glsp/client/lib/features/accessibility/keyboard-grid/keyboard-grid-search-palette.js';
import { KeyboardGrid } from '@eclipse-glsp/client/lib/features/accessibility/keyboard-grid/keyboard-grid.js';
import { KeyboardNodeGrid } from '@eclipse-glsp/client/lib/features/accessibility/keyboard-grid/keyboard-node-grid.js';
import { SetKeyboardPointerRenderPositionAction } from '@eclipse-glsp/client/lib/features/accessibility/keyboard-pointer/actions.js';
import { KeyboardPointer } from '@eclipse-glsp/client/lib/features/accessibility/keyboard-pointer/keyboard-pointer.js';

export const umlKeyboardControlToolsModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    bindAsService(context, TYPES.IUIExtension, KeyboardPointer);
    bindAsService(context, TYPES.IUIExtension, KeyboardGrid);
    bindAsService(context, TYPES.IUIExtension, KeyboardNodeGrid);

    configureActionHandler(context, TriggerNodeCreationAction.KIND, KeyboardPointer);
    configureActionHandler(context, SetKeyboardPointerRenderPositionAction.KIND, KeyboardPointer);

    bindAsService(context, TYPES.IUIExtension, EdgeAutocompletePalette);
    bindAsService(context, TYPES.IDefaultTool, EdgeAutocompletePaletteTool);

    configureActionHandler(context, EnableKeyboardGridAction.KIND, KeyboardGrid);
    configureActionHandler(context, KeyboardGridCellSelectedAction.KIND, KeyboardPointer);

    configureActionHandler(context, TriggerEdgeCreationAction.KIND, EdgeAutocompletePalette);
    configureActionHandler(context, SetEdgeTargetSelectionAction.KIND, EdgeAutocompletePalette);

    bindAsService(context, TYPES.IUIExtension, GridSearchPalette);
});

import { type ElementNavigator } from '@eclipse-glsp/client/lib/features/accessibility/element-navigation/element-navigator.js';
import { LocalElementNavigator } from '@eclipse-glsp/client/lib/features/accessibility/element-navigation/local-element-navigator.js';
import { PositionNavigator } from '@eclipse-glsp/client/lib/features/accessibility/element-navigation/position-navigator.js';
import { RepositionAction } from '@eclipse-glsp/client/lib/features/viewport/reposition.js';

export const umlElementNavigationModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bindAsService(context, TYPES.ITool, UMLPrimaryElementNavigatorTool);
    bindAsService(context, TYPES.ITool, UMLSecondaryElementNavigatorTool);
    bindAsService(context, TYPES.IElementNavigator, PositionNavigator);
    bindAsService(context, TYPES.ILocalElementNavigator, LocalElementNavigator);
});

@injectable()
export class UMLPrimaryElementNavigatorTool implements Tool {
    static ID = 'uml.primary-element-navigator-tool';

    get id(): string {
        return UMLPrimaryElementNavigatorTool.ID;
    }

    isEditTool = false;

    protected elementNavigatorKeyListener: PrimaryElementNavigatorKeyListener;

    @inject(KeyTool) protected readonly keytool: KeyTool;
    @inject(TYPES.IElementNavigator) readonly elementNavigator: ElementNavigator;
    @inject(TYPES.IActionDispatcher) readonly actionDispatcher: GLSPActionDispatcher;

    private enabled = false;
    enable(): void {
        if (this.enabled) {
            return;
        }

        const editLabelUi = document.querySelector('[id$=editLabelUi]');
        if (!editLabelUi || editLabelUi?.classList.contains('hidden')) {
            this.enabled = true;
            this.elementNavigatorKeyListener = new PrimaryElementNavigatorKeyListener(this.elementNavigator);
            this.actionDispatcher.dispatch(
                ShowToastMessageAction.create({
                    id: Symbol.for(PrimaryElementNavigatorKeyListener.name),
                    message:
                        'Primary Navigation On: Use arrow keys to select preceding (←) or succeding (→) elements.' +
                        "Use the up (↑) and down (↓) arrows to navigate paths. Press 'ESC' to exit."
                })
            );
            this.keytool.register(this.elementNavigatorKeyListener);
        }
    }

    disable(): void {
        if (!this.enabled) {
            return;
        }

        this.enabled = false;
        this.actionDispatcher.dispatch(
            ShowToastMessageAction.createWithTimeout({
                id: Symbol.for(PrimaryElementNavigatorKeyListener.name),
                message: "Primary Navigation Off: Press 'N' for primary element navigation, 'ALT+N' for secondary element navigation."
            })
        );
        this.keytool.deregister(this.elementNavigatorKeyListener);
    }
}

@injectable()
export class UMLSecondaryElementNavigatorTool implements Tool {
    static ID = 'uml.secondary-element-navigator-tool';

    get id(): string {
        return UMLSecondaryElementNavigatorTool.ID;
    }

    isEditTool = false;

    protected elementNavigatorKeyListener: PrimaryElementNavigatorKeyListener;

    @inject(KeyTool) protected readonly keytool: KeyTool;
    @inject(TYPES.ILocalElementNavigator) readonly elementNavigator: ElementNavigator;
    @inject(TYPES.IActionDispatcher) readonly actionDispatcher: GLSPActionDispatcher;

    private enabled = false;
    enable(): void {
        if (this.enabled) {
            return;
        }

        const editLabelUi = document.querySelector('[id$=editLabelUi]');
        if (!editLabelUi || editLabelUi?.classList.contains('hidden')) {
            this.enabled = true;
            this.elementNavigatorKeyListener = new PrimaryElementNavigatorKeyListener(this.elementNavigator);
            this.actionDispatcher.dispatch(
                ShowToastMessageAction.create({
                    id: Symbol.for(PrimaryElementNavigatorKeyListener.name),
                    message:
                        'Secondary Navigation On: Navigate nearest elements using arrow keys: (↑) for above,' +
                        "(↓) for below, (←) for previous, (→) for next element. Press 'ESC' to exit."
                })
            );
            this.keytool.register(this.elementNavigatorKeyListener);
        }
    }

    disable(): void {
        if (!this.enabled) {
            return;
        }

        this.enabled = false;

        this.actionDispatcher.dispatch(
            ShowToastMessageAction.createWithTimeout({
                id: Symbol.for(PrimaryElementNavigatorKeyListener.name),
                message: "Secondary Navigation Off: Press 'N' for primary element navigation, 'ALT+N' for secondary element navigation."
            })
        );
        this.keytool.deregister(this.elementNavigatorKeyListener);
    }
}

export class PrimaryElementNavigatorKeyListener extends KeyListener {
    protected previousNode?: SelectableBoundsAware;
    protected readonly token = PrimaryElementNavigatorKeyListener.name;

    constructor(protected readonly navigator: ElementNavigator) {
        super();
    }

    override keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
        const actions = this.resetOnEscape(event, element);
        if (actions.length > 0) {
            return actions;
        }

        if (this.getSelectedElements(element.root).length > 0) {
            return this.navigate(element, event);
        }

        return [];
    }

    protected resetOnEscape(event: KeyboardEvent, element: GModelElement): Action[] {
        if (this.matchesDeactivateNavigationMode(event)) {
            this.navigator?.clean?.(element.root);
            return [EnableDefaultToolsAction.create()];
        }

        return [];
    }

    protected navigate(element: GModelElement, event: KeyboardEvent): Action[] {
        const selected = this.getSelectedElements(element.root);
        const current = selected.length > 0 ? selected[0] : undefined;

        if (this.navigator !== undefined && current !== undefined && isBoundsAware(current)) {
            this.navigator.clean?.(current.root, current, this.previousNode);

            const target = this.navigateOnEvent(event, this.navigator, current);
            if (target !== undefined) {
                this.navigator.process?.(current.root, current, target as SelectableBoundsAware, this.previousNode);
            }
            const selectableTarget = target ? findParentByFeature(target, isSelectable) : undefined;

            if (selectableTarget) {
                if (!(current instanceof GEdge)) {
                    this.previousNode = current;
                }
                const deselectedElementsIDs = selected.map(e => e.id).filter(id => id !== selectableTarget.id);

                return [
                    SelectAction.create({ selectedElementsIDs: [selectableTarget.id], deselectedElementsIDs }),
                    RepositionAction.create([selectableTarget.id])
                ];
            }
        }

        return [];
    }

    protected navigateOnEvent(
        event: KeyboardEvent,
        navigator: ElementNavigator,
        current: SelectableBoundsAware
    ): GModelElement | undefined {
        if (this.matchesNavigatePrevious(event)) {
            return navigator.previous(current.root, current);
        } else if (this.matchesNavigateNext(event)) {
            return navigator.next(current.root, current);
        } else if (this.matchesNavigateUp(event)) {
            return navigator.up?.(current.root, current, this.previousNode);
        } else if (this.matchesNavigateDown(event)) {
            return navigator.down?.(current.root, current, this.previousNode);
        }

        return undefined;
    }

    protected getSelectedElements(root: GModelRoot): (GModelElement & Selectable)[] {
        return toArray(root.index.all().filter(e => isSelected(e))) as (GModelElement & Selectable)[];
    }

    protected matchesDeactivateNavigationMode(event: KeyboardEvent): boolean {
        return matchesKeystroke(event, 'Escape');
    }
    protected matchesNavigatePrevious(event: KeyboardEvent): boolean {
        return matchesKeystroke(event, 'ArrowLeft');
    }
    protected matchesNavigateNext(event: KeyboardEvent): boolean {
        return matchesKeystroke(event, 'ArrowRight');
    }
    protected matchesNavigateUp(event: KeyboardEvent): boolean {
        return matchesKeystroke(event, 'ArrowUp');
    }
    protected matchesNavigateDown(event: KeyboardEvent): boolean {
        return matchesKeystroke(event, 'ArrowDown');
    }
}
