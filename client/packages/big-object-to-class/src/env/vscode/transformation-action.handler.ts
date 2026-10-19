/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
    ApplyModelPatchResponse,
    ApplyTransformationAction,
    ApplyTransformationResponse,
    RequestApplyModelPatchAction,
    RequestTransformationPreviewAction,
    TransformationPreviewResponse
} from '@borkdominik-biguml/big-object-to-class';
import {
    bindWebviewViewFactory,
    TYPES,
    VscodeFeatureModule,
    type ActionDispatcher,
    type ActionListener,
    type BigGlspVSCodeConnector,
    type GlspModelState,
    type OnActivate,
    type OnDispose
} from '@borkdominik-biguml/big-vscode/vscode';
import { DisposableCollection, type Action } from '@eclipse-glsp/protocol';
import { type ActionHandler } from '@eclipse-glsp/server';
import { inject, injectable, postConstruct } from 'inversify';
import { buildPatches, transform } from '../common/index.js';
import { TransformationPreviewWebviewViewProvider } from './transformation-preview.webview-view-provider.js';

/**
 * VSCode-side action handler:
 *  - Processes preview requests → runs inference → returns preview data
 *  - Processes apply requests → builds JSON patches → sends to model server
 *  - Provides the command to open the preview panel
 */
@injectable()
export class TransformationActionHandler implements OnActivate, OnDispose {
    @inject(TYPES.GlspVSCodeConnector)
    protected readonly connector: BigGlspVSCodeConnector;

    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;

    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;

    @inject(TYPES.GlspModelState)
    protected readonly modelState: GlspModelState;

    private readonly toDispose = new DisposableCollection();

    public dispose() {
        this.toDispose.dispose();
    }

    @postConstruct()
    protected init(): void {}

    onActivate(): void {
        this.toDispose.push(
            this.connector.registerVscodeHandledAction(TransformationPreviewResponse.KIND),
            this.connector.registerVscodeHandledAction(ApplyTransformationResponse.KIND),
            this.connector.registerVscodeHandledAction(ApplyModelPatchResponse.KIND),
            this.actionListener.handleVSCodeRequest<RequestTransformationPreviewAction>(
                RequestTransformationPreviewAction.KIND,
                async message => {
                    // Type-safe extraction: The ID and data live inside message.action
                    const reqId = message.action.requestId;
                    const dataToParse = message.action.mockData;

                    try {
                        const { classes, associations, conflicts } = transform(dataToParse);

                        // Debug: log what we inferred locally before sending to the webview
                        console.debug('[Transform] preview -> classes=', classes.length, 'associations=', associations.length);

                        return TransformationPreviewResponse.create({
                            // FIX: Pass the reqId down so it's "used" and not empty
                            responseId: reqId,
                            success: true,
                            classes: classes.map(c => ({
                                name: c.name,
                                properties: c.properties.map(p => ({
                                    name: p.name,
                                    type: formatType(p.type),
                                    isOptional: p.isOptional
                                }))
                            })),
                            associations: associations.map(a => ({
                                name: a.name ?? '',
                                sourceTypeName: a.sourceTypeName,
                                targetTypeName: a.targetTypeName,
                                sourceMultiplicity: a.sourceMultiplicity,
                                targetMultiplicity: a.targetMultiplicity
                            })),
                            conflicts: conflicts.map(c => ({
                                kind: c.kind,
                                message: c.message,
                                conflictingNames: c.conflictingNames
                            }))
                        });
                    } catch (error: any) {
                        return TransformationPreviewResponse.create({
                            // FIX: Pass the reqId down here too
                            responseId: reqId,
                            success: false,
                            message: error?.message ?? 'Invalid schema.',
                            classes: [],
                            associations: [],
                            conflicts: []
                        });
                    }
                }
            ),
            this.actionListener.handleVSCodeRequest<ApplyTransformationAction>(ApplyTransformationAction.KIND, async message => {
                // Type-safe extraction
                const reqId = message.action.requestId;
                const dataToParse = message.action.mockData;

                try {
                    const { parsed, classes, associations } = transform(dataToParse);
                    const patches = buildPatches({ parsed, classes, associations });

                    const patchesString = JSON.stringify(patches);

                    const patchAction = RequestApplyModelPatchAction.create({
                        patches: patchesString
                    });

                    const response = await this.actionDispatcher.request(patchAction);

                    const patchResponse = response.action;
                    if (!patchResponse.success) {
                        throw new Error(patchResponse.message || 'Failed to apply model patch.');
                    }

                    return ApplyTransformationResponse.create({
                        // FIX: Pass the reqId down
                        responseId: reqId,
                        success: true,
                        message: `Applied: ${classes.length} classes, ${parsed.instances.length} instances, ${associations.length} associations`
                    });
                } catch (error: any) {
                    return ApplyTransformationResponse.create({
                        // FIX: Pass the reqId down here too
                        responseId: reqId,
                        success: false,
                        message: error?.message ?? 'Failed to apply transformation.'
                    });
                }
            })
        );
    }

    // Consolidated disposal to match interface
    onDispose(): void {
        this.toDispose.dispose();
    }
}

function formatType(t: ReturnType<typeof transform>['classes'][0]['properties'][0]['type']): string {
    if (typeof t === 'string') return t;
    return `enum ${t.name}`;
}

export function transformationPreviewModule(viewType: string) {
    return new VscodeFeatureModule(context => {
        context.bind(TransformationActionHandler).toSelf().inSingletonScope();
        context.bind(TYPES.OnActivate).toService(TransformationActionHandler);
        context.bind(TYPES.OnDispose).toService(TransformationActionHandler);

        bindWebviewViewFactory(context, {
            provider: TransformationPreviewWebviewViewProvider,
            options: { viewType }
        });
    });
}

@injectable()
export class TransformationResponseHandler implements ActionHandler {
    // Tell the system we "handle" these two response types
    readonly actionKinds = [TransformationPreviewResponse.KIND, ApplyTransformationResponse.KIND, ApplyModelPatchResponse.KIND];

    // TS2416 FIX: Must return Promise<Action[]> to match the interface
    // TS6133 FIX: Rename 'action' to '_action' to tell TS we intentionally ignore it
    async execute(_action: Action): Promise<Action[]> {
        // Return an empty array to satisfy the requirement
        return [];
    }
}
