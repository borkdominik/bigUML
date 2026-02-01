/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { HiddenModelViewer, ModelRenderer, type Action, type GModelRoot, type IViewArgs, type IVNodePostprocessor, type RenderingTargetKind, type ViewRegistry } from "@eclipse-glsp/client";
import { injectable } from "inversify";

/**
 * The UMLHiddenModelViewer is a specialized version of the HiddenModelViewer
 * that uses the UMLModelRenderer for rendering.
 * It allows the renderer to clean up before the model is updated.
 */
@injectable()
export class UMLHiddenModelViewer extends HiddenModelViewer {
    declare hiddenRenderer: UMLModelRenderer;

    override update(hiddenModel: Readonly<GModelRoot>, cause?: Action): void {
        this.hiddenRenderer.preUpdate(cause);

        super.update(hiddenModel, cause);
    }
}

/**
 * The UMLModelRenderer is a specialized version of the ModelRenderer
 * that allows for pre-processing of the model before rendering.
 */
export class UMLModelRenderer extends ModelRenderer {

    protected preProcessors: any[];

    constructor(viewRegistry: ViewRegistry,
        targetKind: RenderingTargetKind,
        postprocessors: IVNodePostprocessor[],
        args: IViewArgs = {}) {
        super(viewRegistry, targetKind, postprocessors, args);
        this.preProcessors = postprocessors
    }


    preUpdate(cause?: Action) {
        this.preProcessors.forEach(processor => {
            if (processor.preUpdate) {
                processor.preUpdate(cause);
            }
        });
    }
}