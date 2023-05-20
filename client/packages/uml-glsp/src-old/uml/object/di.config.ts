/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import '@eclipse-glsp/client/css/glsp-sprotty.css';
import 'sprotty/css/edit-label.css';

/*
export default function createContainer(widgetId: string): Container {
    const classDiagramModule = new ContainerModule(
        (bind, unbind, isBound, rebind) => {
            rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
            rebind(TYPES.LogLevel).toConstantValue(LogLevel.info);
            rebind(EditLabelUI).to(EditLabelUIAutocomplete);
            bind(TYPES.IVNodePostprocessor).to(
                IconLabelCompartmentSelectionFeedback
            );

            const context = { bind, unbind, isBound, rebind };
            // bind(TYPES.IVNodePostprocessor).to(LabelSelectionFeedback);
            configureDefaultModelElements(context);
            configureModelElement(
                context,
                UmlTypes.LABEL_NAME,
                SEditableLabel,
                SLabelView
            );
            configureModelElement(
                context,
                UmlTypes.LABEL_EDGE_NAME,
                SEditableLabel,
                SLabelView
            );
            configureModelElement(
                context,
                UmlTypes.LABEL_EDGE_MULTIPLICITY,
                SEditableLabel,
                SLabelView
            );
            configureModelElement(
                context,
                UmlTypes.LABEL_TEXT,
                SLabel,
                SLabelView
            );
            // configureModelElement(context, UmlTypes.LABEL_ICON, SLabel, SLabelView);
            configureModelElement(
                context,
                BaseTypes.COMPARTMENT,
                SCompartment,
                SCompartmentView
            );
            configureModelElement(
                context,
                BaseTypes.COMPARTMENT_HEADER,
                SCompartment,
                SCompartmentView
            );
            configureModelElement(
                context,
                BaseTypes.ROUTING_POINT,
                SRoutingHandle,
                SRoutingHandleView
            );
            configureModelElement(
                context,
                BaseTypes.VOLATILE_ROUTING_POINT,
                SRoutingHandle,
                SRoutingHandleView
            );
            configureModelElement(
                context,
                UmlTypes.STRUCTURE,
                SCompartment,
                StructureCompartmentView
            );

            // OBJECT DIAGRAM
            // configureModelElement(context, UmlTypes.ICON_OBJECT, IconObject, IconView);
            configureModelElement(
                context,
                UmlTypes.OBJECT,
                LabeledNode,
                ObjectNodeView
            );
            configureModelElement(
                context,
                UmlTypes.LINK,
                SEdge,
                PolylineEdgeView
            );
            configureModelElement(
                context,
                UmlTypes.ATTRIBUTE,
                SLabelNodeProperty,
                LabelNodeView
            );

            configureViewerOptions(context, {
                needsClientLayout: true,
                baseDiv: widgetId,
            });
        }
    );

    const container = createClientContainer(
        classDiagramModule,
        umlToolPaletteModule,
        saveModule,
        copyPasteContextMenuModule,
        validationModule
    );
    container.unload(toolPaletteModule);
    overrideViewerOptions(container, {
        baseDiv: widgetId,
        hiddenDiv: widgetId + "_hidden",
    });

    return container;
}
*/
