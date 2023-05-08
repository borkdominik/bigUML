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

            // ACTIVITY DIAGRAM
            configureModelElement(
                context,
                UmlTypes.ACTIVITY,
                PackageNode,
                ActivityNodeView
            );
            configureModelElement(
                context,
                UmlTypes.ICON_ACTIVITY,
                IconActivity,
                IconView
            );
            // configureModelElement(context, UmlTypes.PARTITION, LabeledNode, PartitionNodeView);
            configureModelElement(
                context,
                UmlTypes.PARTITION,
                LabeledNode,
                PackageNodeView
            );
            configureModelElement(
                context,
                UmlTypes.ACTION,
                LabeledNode,
                ActionNodeView
            );
            configureModelElement(
                context,
                UmlTypes.ICON_ACTION,
                IconAction,
                IconView
            );
            configureModelElement(
                context,
                UmlTypes.ACCEPTEVENT,
                LabeledNode,
                AcceptEventNodeView
            );
            configureModelElement(
                context,
                UmlTypes.TIMEEVENT,
                LabeledNode,
                AcceptTimeEventNodeView
            );
            configureModelElement(
                context,
                UmlTypes.SENDSIGNAL,
                LabeledNode,
                SendSignalNodeView
            );
            configureModelElement(
                context,
                UmlTypes.CALL,
                LabeledNode,
                CallNodeView
            );
            configureModelElement(
                context,
                UmlTypes.CALL_REF,
                SEditableLabel,
                SLabelView
            );
            configureModelElement(
                context,
                UmlTypes.CONTROLFLOW,
                SEdge,
                FlowEdgeView
            );
            configureModelElement(
                context,
                UmlTypes.INITIALNODE,
                ControlNode,
                InitialNodeView
            );
            configureModelElement(
                context,
                UmlTypes.FINALNODE,
                ControlNode,
                FinalNodeView
            );
            configureModelElement(
                context,
                UmlTypes.FLOWFINALNODE,
                ControlNode,
                FlowFinalNodeView
            );
            configureModelElement(
                context,
                UmlTypes.DECISIONMERGENODE,
                ControlNode,
                DiamondNodeView
            );
            configureModelElement(
                context,
                UmlTypes.FORKJOINNODE,
                ControlNode,
                ForkOrJoinNodeView
            );
            configureModelElement(
                context,
                UmlTypes.PARAMETER,
                LabeledNode,
                ParameterNodeView
            );
            configureModelElement(
                context,
                UmlTypes.PIN,
                LabeledNode,
                PinNodeView
            );
            configureModelElement(
                context,
                UmlTypes.PIN_PORT,
                ControlNode,
                PinPortView
            );
            configureModelElement(
                context,
                UmlTypes.CENTRALBUFFER,
                LabeledNode,
                ObjectNodeView
            );
            configureModelElement(
                context,
                UmlTypes.DATASTORE,
                LabeledNode,
                ObjectNodeView
            );
            configureModelElement(
                context,
                UmlTypes.COMMENT,
                LabeledNode,
                CommentNodeView
            );
            configureModelElement(
                context,
                UmlTypes.COMMENT_LINK,
                SEdge,
                CommentLinkEdgeView
            );
            configureModelElement(
                context,
                UmlTypes.LABEL_FLOW_GUARD,
                SEditableLabel,
                SLabelView
            );
            configureModelElement(
                context,
                UmlTypes.LABEL_FLOW_WEIGHT,
                SEditableLabel,
                SLabelView
            );
            configureModelElement(
                context,
                UmlTypes.EXCEPTIONHANDLER,
                SEdge,
                PolylineEdgeView
            );
            configureModelElement(
                context,
                UmlTypes.INTERRUPTIBLEREGION,
                LabeledNode,
                InterruptibleRegionNodeView
            );
            configureModelElement(
                context,
                UmlTypes.CONDITION,
                LabeledNode,
                ConditionNodeView
            );
            configureViewerOptions(context, {
                needsClientLayout: true,
                baseDiv: widgetId
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
        hiddenDiv: widgetId + "_hidden"
    });

    return container;
}
*/
