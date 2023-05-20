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

            // STATEMACHINE DIAGRAM
            configureModelElement(
                context,
                UmlTypes.ICON_STATE_MACHINE,
                IconStateMachine,
                IconView
            );
            configureModelElement(
                context,
                UmlTypes.STATE_MACHINE,
                LabeledNode,
                StateMachineNodeView
            );
            configureModelElement(
                context,
                UmlTypes.REGION,
                LabeledNode,
                InterruptibleRegionNodeView
            );
            configureModelElement(
                context,
                UmlTypes.ICON_STATE,
                IconState,
                IconView
            );
            configureModelElement(
                context,
                UmlTypes.STATE,
                LabeledNode,
                StateNodeView
            );
            configureModelElement(
                context,
                UmlTypes.LABEL_VERTEX_NAME,
                SEditableLabel,
                SLabelView
            );
            configureModelElement(
                context,
                UmlTypes.INITIAL_STATE,
                LabeledNode,
                InitialStateNodeView
            );
            configureModelElement(
                context,
                UmlTypes.DEEP_HISTORY,
                LabeledNode,
                DeepHistoryNodeView
            );
            configureModelElement(
                context,
                UmlTypes.SHALLOW_HISTORY,
                LabeledNode,
                ShallowHistoryNodeView
            );
            configureModelElement(
                context,
                UmlTypes.JOIN,
                LabeledNode,
                JoinNodeView
            );
            configureModelElement(
                context,
                UmlTypes.FORK,
                RectangularNode,
                ForkNodeView
            );
            configureModelElement(
                context,
                UmlTypes.JUNCTION,
                RectangularNode,
                JunctionNodeView
            );
            configureModelElement(
                context,
                UmlTypes.CHOICE,
                LabeledNode,
                ChoiceNodeView
            );
            configureModelElement(
                context,
                UmlTypes.FINAL_STATE,
                LabeledNode,
                FinalStateNodeView
            );
            configureModelElement(
                context,
                UmlTypes.TRANSITION,
                SEdge,
                TransitionEdgeView
            );
            configureModelElement(
                context,
                UmlTypes.LABEL_TRANSITION_NAME,
                SEditableLabel,
                SLabelView
            );
            configureModelElement(
                context,
                UmlTypes.LABEL_TRANSITION_GUARD,
                SEditableLabel,
                TransitionGuardView
            );
            configureModelElement(
                context,
                UmlTypes.LABEL_TRANSITION_EFFECT,
                SEditableLabel,
                TransitionEffectView
            );
            configureModelElement(
                context,
                UmlTypes.LABEL_TRANSITION_TRIGGER,
                SEditableLabel,
                SLabelView
            );
            configureModelElement(
                context,
                UmlTypes.ENTRY_POINT,
                LabeledNode,
                EntryPointNodeView
            );
            configureModelElement(
                context,
                UmlTypes.EXIT_POINT,
                LabeledNode,
                ExitPointNodeView
            );
            configureModelElement(
                context,
                UmlTypes.STATE_ENTRY_ACTIVITY,
                SLabelNodeProperty,
                StateActivityNodeView
            );
            configureModelElement(
                context,
                UmlTypes.STATE_DO_ACTIVITY,
                SLabelNodeProperty,
                StateActivityNodeView
            );
            configureModelElement(
                context,
                UmlTypes.STATE_EXIT_ACTIVITY,
                SLabelNodeProperty,
                StateActivityNodeView
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
