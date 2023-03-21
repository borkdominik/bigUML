/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import '@eclipse-glsp/client/css/glsp-sprotty.css';
import 'balloon-css/balloon.min.css';
import 'sprotty/css/edit-label.css';

import '../css/style.css';

import '../css/extensions/edit-label.css';

import {
    configureDefaultModelElements,
    configureModelElement,
    configureViewerOptions,
    createDiagramContainer,
    EditLabelUI,
    GLSPGraph,
    LogLevel,
    overrideViewerOptions,
    saveModule,
    TYPES
} from '@eclipse-glsp/client';
import toolPaletteModule from '@eclipse-glsp/client/lib/features/tool-palette/di.config';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { Container, ContainerModule } from 'inversify';
import { FixedLogger } from './common/fixed-logger';
import { CustomCopyPasteHandler, LastContainableElementTracker } from './features/copy-paste/copy-paste';
import { EditLabelUIAutocomplete } from './features/edit-label';
import editorPanelModule from './features/editor-panel/di.config';
import outlineModule from './features/outline/di.config';
import propertyPaletteModule from './features/property-palette/di.config';
import { FixedFeedbackActionDispatcher } from './features/tool-feedback/feedback-action-dispatcher';
import umlToolPaletteModule from './features/tool-palette/di.config';
import { UmlGraphView } from './graph/graph.view';
import { SVGIdCreatorService } from './graph/svg-id-creator.service';
import { umlDiagramModules } from './uml/index';
import { IconLabelCompartmentSelectionFeedback } from './views/feedback.postprocessor';

export default function createContainer(widgetId: string): Container {
    const coreDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };

        rebind(TYPES.ILogger).to(FixedLogger).inSingletonScope();
        rebind(TYPES.LogLevel).toConstantValue(LogLevel.info);
        rebind(TYPES.ICopyPasteHandler).to(CustomCopyPasteHandler);
        rebind(TYPES.IFeedbackActionDispatcher).to(FixedFeedbackActionDispatcher).inSingletonScope();

        rebind(EditLabelUI).to(EditLabelUIAutocomplete);

        bind(LastContainableElementTracker).toSelf().inSingletonScope();
        bind(TYPES.MouseListener).toService(LastContainableElementTracker);
        bind(TYPES.IVNodePostprocessor).to(IconLabelCompartmentSelectionFeedback);
        bind(SVGIdCreatorService).toSelf().inSingletonScope();

        configureDefaultModelElements(context);

        configureModelElement(context, DefaultTypes.GRAPH, GLSPGraph, UmlGraphView);

        configureViewerOptions(context, {
            needsClientLayout: true,
            baseDiv: widgetId
        });
    });

    const container = createDiagramContainer(
        saveModule,
        coreDiagramModule,
        editorPanelModule,
        umlToolPaletteModule,
        outlineModule,
        propertyPaletteModule,
        ...umlDiagramModules
    );

    container.unload(toolPaletteModule);

    overrideViewerOptions(container, {
        baseDiv: widgetId,
        hiddenDiv: widgetId + '_hidden'
    });
    return container;
}
