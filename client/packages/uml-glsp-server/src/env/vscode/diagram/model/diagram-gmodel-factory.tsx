/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import {
    isAbstraction,
    isAcceptEventAction,
    isActivity,
    isActivityFinalNode,
    isActivityParameterNode,
    isActivityPartition,
    isActor,
    isArtifact,
    isAssociation,
    isCentralBufferNode,
    isChoice,
    isClass,
    isCommunicationPath,
    isControlFlow,
    isDataType,
    isDecisionNode,
    isDeepHistory,
    isDependency,
    isDeployment,
    isDeploymentModel,
    isDeploymentNode,
    isDeploymentPackage,
    isDeploymentSpecification,
    isDevice,
    isElementImport,
    isEntryPoint,
    isEnumeration,
    isExecutionEnvironment,
    isExitPoint,
    isExtend,
    isFinalState,
    isFlowFinalNode,
    isFork,
    isForkNode,
    isGeneralization,
    isInclude,
    isInformationFlow,
    isInitialNode,
    isInitialState,
    isInputPin,
    isInstanceSpecification,
    isInteraction,
    isInterface,
    isInterfaceRealization,
    isJoin,
    isJoinNode,
    isLifeline,
    isLiteralSpecification,
    isManifestation,
    isMergeNode,
    isMessage,
    isNote,
    isOpaqueAction,
    isOutputPin,
    isPackage,
    isPackageImport,
    isPackageMerge,
    isParameter,
    isPrimitiveType,
    isRealization,
    isRegion,
    isSendSignalAction,
    isShallowHistory,
    isState,
    isStateMachine,
    isSubject,
    isSubstitution,
    isTerminate,
    isTextLabel,
    isTransition,
    isUsage,
    isUseCase,
    type Region
} from '@borkdominik-biguml/uml-model-server/grammar';
import type { GEdge, GGraph, GModelElement, GModelFactory } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { GGraphElement } from '../../../jsx/index.js';
import { createAbstractionRelation } from '../../elements/abstraction-relation.element.js';
import { createAcceptEventActionElement } from '../../elements/accept-event-action.element.js';
import { createActivityFinalNodeElement } from '../../elements/activity-final-node.element.js';
import { createActivityParameterNodeElement } from '../../elements/activity-parameter-node.element.js';
import { createActivityPartitionElement } from '../../elements/activity-partition.element.js';
import { createActivityElement } from '../../elements/activity.element.js';
import { createActorElement } from '../../elements/actor.element.js';
import { createArtifactElement } from '../../elements/artifact.element.js';
import { createAssociationRelation } from '../../elements/association-relation.element.js';
import { createCentralBufferNodeElement } from '../../elements/central-buffer-node.element.js';
import { createChoiceElement } from '../../elements/choice.element.js';
import { createClassElement } from '../../elements/class.element.js';
import { createCommunicationPathRelation } from '../../elements/communication-path.element.js';
import { createControlFlowRelation } from '../../elements/control-flow.element.js';
import type { ElementContext } from '../../elements/core/element-context.js';
import { createDataTypeElement } from '../../elements/data-type.element.js';
import { createDecisionNodeElement } from '../../elements/decision-node.element.js';
import { createDeepHistoryElement } from '../../elements/deep-history.element.js';
import { createDependencyRelation } from '../../elements/dependency-relation.element.js';
import { createDeploymentModelElement } from '../../elements/deployment-model.element.js';
import { createDeploymentNodeElement } from '../../elements/deployment-node.element.js';
import { createDeploymentPackageElement } from '../../elements/deployment-package.element.js';
import { createDeploymentRelation } from '../../elements/deployment-relation.element.js';
import { createDeploymentSpecificationElement } from '../../elements/deployment-specification.element.js';
import { createDeviceElement } from '../../elements/device.element.js';
import { createElementImportRelation } from '../../elements/element-import.element.js';
import { createEntryPointElement } from '../../elements/entry-point.element.js';
import { createEnumerationElement } from '../../elements/enumeration.element.js';
import { createExecutionEnvironmentElement } from '../../elements/execution-environment.element.js';
import { createExitPointElement } from '../../elements/exit-point.element.js';
import { createExtendRelation } from '../../elements/extend-relation.element.js';
import { createFinalStateElement } from '../../elements/final-state.element.js';
import { createFlowFinalNodeElement } from '../../elements/flow-final-node.element.js';
import { createForkNodeElement } from '../../elements/fork-node.element.js';
import { createForkElement } from '../../elements/fork.element.js';
import { createGeneralizationRelation } from '../../elements/generalization-relation.element.js';
import { createIncludeRelation } from '../../elements/include-relation.element.js';
import { createInformationFlowRelation } from '../../elements/information-flow.element.js';
import { createInitialNodeElement } from '../../elements/initial-node.element.js';
import { createInitialStateElement } from '../../elements/initial-state.element.js';
import { createInputPinElement } from '../../elements/input-pin.element.js';
import { createInstanceSpecificationElement } from '../../elements/instance-specification.element.js';
import { createInteractionElement } from '../../elements/interaction.element.js';
import { createInterfaceRealizationRelation } from '../../elements/interface-realization-relation.element.js';
import { createInterfaceElement } from '../../elements/interface.element.js';
import { createJoinNodeElement } from '../../elements/join-node.element.js';
import { createJoinElement } from '../../elements/join.element.js';
import { createLifelineElement } from '../../elements/lifeline.element.js';
import { createLiteralSpecificationElement } from '../../elements/literal-specification.element.js';
import { createManifestationRelation } from '../../elements/manifestation.element.js';
import { createMergeNodeElement } from '../../elements/merge-node.element.js';
import { createMessageRelation } from '../../elements/message.element.js';
import { createNoteElement } from '../../elements/note.element.js';
import { createOpaqueActionElement } from '../../elements/opaque-action.element.js';
import { createOutputPinElement } from '../../elements/output-pin.element.js';
import { createPackageImportRelation } from '../../elements/package-import-relation.element.js';
import { createPackageMergeRelation } from '../../elements/package-merge-relation.element.js';
import { createPackageElement } from '../../elements/package.element.js';
import { createParameterElement } from '../../elements/parameter.element.js';
import { createPrimitiveTypeElement } from '../../elements/primitive-type.element.js';
import { createRealizationRelation } from '../../elements/realization-relation.element.js';
import { createRegionElement } from '../../elements/region.element.js';
import { createSendSignalActionElement } from '../../elements/send-signal-action.element.js';
import { createShallowHistoryElement } from '../../elements/shallow-history.element.js';
import { createStateMachineElement } from '../../elements/state-machine.element.js';
import { createStateElement } from '../../elements/state.element.js';
import { createSubjectElement } from '../../elements/subject.element.js';
import { createSubstitutionRelation } from '../../elements/substitution-relation.element.js';
import { createTerminateElement } from '../../elements/terminate.element.js';
import { createTextLabelElement } from '../../elements/text-label.element.js';
import { createTransitionRelation } from '../../elements/transition.element.js';
import { createUsageRelation } from '../../elements/usage-relation.element.js';
import { createUseCaseElement } from '../../elements/use-case.element.js';
import { DiagramModelState } from '../../features/index.js';
import { DiagramLanguageMetadata } from '../../features/model/diagram-language-metadata.js';
import { DiagramModelIndex } from '../../features/model/diagram-model-index.js';

/** Nodes that are drawn as a boundary around other, flatly listed nodes of the same diagram. */
function isCanvasContainer(element: unknown): boolean {
    return isSubject(element) || isStateMachine(element) || isRegion(element) || isActivity(element) || isActivityPartition(element);
}

@injectable()
export class UmlDiagramGModelFactory implements GModelFactory {
    @inject(DiagramModelState)
    protected readonly modelState: DiagramModelState;

    @inject(DiagramModelIndex)
    protected readonly modelIndex: DiagramModelIndex;

    @inject(DiagramLanguageMetadata)
    protected readonly metadata: DiagramLanguageMetadata;

    createModel(): void {
        const newRoot = this.createGraph();
        if (newRoot) {
            this.modelState.updateRoot(newRoot);
        }
    }

    protected createGraph(): GGraph | undefined {
        const diagram = this.modelState.semanticRoot.diagram;

        const collectedNodes: unknown[] = [];
        const collectedEdges: unknown[] = [...diagram.relations];
        diagram.entities.forEach(entity => this.collectSemanticElements(entity, collectedNodes, collectedEdges));

        // Subjects, state machine frames and regions act as containers drawn around other nodes, so
        // they must always paint behind them, regardless of the order in which they were created
        // relative to the nodes they contain. The sort is stable, so a container nested in another one
        // keeps the depth-first order `collectSemanticElements` put it in - a region still paints in
        // front of the frame that owns it, and behind the states that sit on it.
        const entities = collectedNodes.sort((a, b) => Number(isCanvasContainer(b)) - Number(isCanvasContainer(a)));
        const nodes = entities.map(e => this.createNodeElement(e)).filter(Boolean) as GModelElement[];
        const edges = collectedEdges
            .filter((r: any) => r.source?.ref && r.target?.ref)
            .map(e => this.createEdgeElement(e))
            .filter(Boolean) as GEdge[];

        return (
            <GGraphElement id={this.modelState.semanticUri}>
                {nodes}
                {edges}
            </GGraphElement>
        ) as GGraph;
    }

    /**
     * Flattens the semantic model's containment into the flat list the graph is built from.
     *
     * The two do not agree on shape. The semantic model nests - a state machine owns regions, a region
     * owns the states and the transitions drawn inside it, and one of those states can own regions of
     * its own - while the graph holds every node as a direct child, placed at an absolute position, with
     * a container drawn *behind* the nodes that sit on it rather than around them.
     *
     * Only `diagram.entities` and `diagram.relations` were ever walked, so anything reachable solely
     * through a container's own properties never became a GModel element: a region and everything put
     * inside it was stored correctly and then simply never drawn.
     */
    protected collectSemanticElements(element: unknown, nodes: unknown[], edges: unknown[]): void {
        nodes.push(element);

        if (isStateMachine(element)) {
            element.regions?.forEach(region => this.collectSemanticElements(region, nodes, edges));
        }

        // A *state's* regions are the bands drawn inside the state itself (see `GStateRegionCompartment`),
        // so the region is not a node of its own here - what is drawn on the band still is. Collected as a
        // node as well, it would appear twice under the one id: once as the band and once as a frame of
        // its own, standing wherever its stored position happens to put it.
        if (isState(element)) {
            element.regions?.forEach(region => this.collectRegionContents(region, nodes, edges));
        }

        if (isRegion(element)) {
            this.collectRegionContents(element, nodes, edges);
        }

        // An interaction owns its lifelines and the messages between them the same way - and that is
        // where both are put by the property palette's create actions and by `getCreationPath`, so
        // without this a lifeline or message added there is stored correctly and never appears.
        if (isInteraction(element)) {
            element.lifelines?.forEach(lifeline => this.collectSemanticElements(lifeline, nodes, edges));
            element.messages?.forEach(message => edges.push(message));
        }
    }

    /**
     * What is drawn on a region: the states and pseudostates put inside it, and the transitions between
     * them - which are stored on the region rather than in the diagram's flat relation list, so they have
     * to be picked up here or they are never drawn either.
     */
    protected collectRegionContents(region: Region, nodes: unknown[], edges: unknown[]): void {
        region.subvertices?.forEach(subvertex => this.collectSemanticElements(subvertex, nodes, edges));
        region.transitions?.forEach(transition => edges.push(transition));
    }

    protected buildCtx<T>(node: T): ElementContext<T> {
        return {
            modelIndex: this.modelIndex,
            node,
            diagramType: this.modelState.diagramType!,
            elementType: this.metadata.convertToElementType((node as any).$type)
        };
    }

    protected createNodeElement(element: unknown): GModelElement | undefined {
        if (isClass(element)) return createClassElement(this.buildCtx(element));
        if (isInterface(element)) return createInterfaceElement(this.buildCtx(element));
        if (isDataType(element)) return createDataTypeElement(this.buildCtx(element));
        if (isEnumeration(element)) return createEnumerationElement(this.buildCtx(element));
        if (isPrimitiveType(element)) return createPrimitiveTypeElement(this.buildCtx(element));
        if (isInstanceSpecification(element)) return createInstanceSpecificationElement(this.buildCtx(element));
        if (isPackage(element)) return createPackageElement(this.buildCtx(element));
        if (isLiteralSpecification(element)) return createLiteralSpecificationElement(this.buildCtx(element));
        if (isParameter(element)) return createParameterElement(this.buildCtx(element));
        // Activity diagram nodes
        if (isActivity(element)) return createActivityElement(this.buildCtx(element));
        if (isActivityPartition(element)) return createActivityPartitionElement(this.buildCtx(element));
        if (isOpaqueAction(element)) return createOpaqueActionElement(this.buildCtx(element));
        if (isAcceptEventAction(element)) return createAcceptEventActionElement(this.buildCtx(element));
        if (isSendSignalAction(element)) return createSendSignalActionElement(this.buildCtx(element));
        if (isInitialNode(element)) return createInitialNodeElement(this.buildCtx(element));
        if (isDecisionNode(element)) return createDecisionNodeElement(this.buildCtx(element));
        if (isMergeNode(element)) return createMergeNodeElement(this.buildCtx(element));
        if (isJoinNode(element)) return createJoinNodeElement(this.buildCtx(element));
        if (isForkNode(element)) return createForkNodeElement(this.buildCtx(element));
        if (isActivityFinalNode(element)) return createActivityFinalNodeElement(this.buildCtx(element));
        if (isFlowFinalNode(element)) return createFlowFinalNodeElement(this.buildCtx(element));
        if (isCentralBufferNode(element)) return createCentralBufferNodeElement(this.buildCtx(element));
        if (isActivityParameterNode(element)) return createActivityParameterNodeElement(this.buildCtx(element));
        if (isInputPin(element)) return createInputPinElement(this.buildCtx(element));
        if (isOutputPin(element)) return createOutputPinElement(this.buildCtx(element));
        // UseCase diagram nodes
        if (isUseCase(element)) return createUseCaseElement(this.buildCtx(element));
        if (isActor(element)) return createActorElement(this.buildCtx(element));
        if (isSubject(element)) return createSubjectElement(this.buildCtx(element));
        // Communication diagram nodes
        if (isInteraction(element)) return createInteractionElement(this.buildCtx(element));
        if (isLifeline(element)) return createLifelineElement(this.buildCtx(element));
        // Deployment diagram nodes
        if (isArtifact(element)) return createArtifactElement(this.buildCtx(element));
        if (isDeploymentSpecification(element)) return createDeploymentSpecificationElement(this.buildCtx(element));
        if (isDevice(element)) return createDeviceElement(this.buildCtx(element));
        if (isExecutionEnvironment(element)) return createExecutionEnvironmentElement(this.buildCtx(element));
        if (isDeploymentModel(element)) return createDeploymentModelElement(this.buildCtx(element));
        if (isDeploymentNode(element)) return createDeploymentNodeElement(this.buildCtx(element));
        if (isDeploymentPackage(element)) return createDeploymentPackageElement(this.buildCtx(element));
        // State machine diagram nodes
        if (isStateMachine(element)) return createStateMachineElement(this.buildCtx(element));
        if (isRegion(element)) return createRegionElement(this.buildCtx(element));
        if (isState(element)) return createStateElement(this.buildCtx(element));
        if (isFinalState(element)) return createFinalStateElement(this.buildCtx(element));
        if (isInitialState(element)) return createInitialStateElement(this.buildCtx(element));
        if (isChoice(element)) return createChoiceElement(this.buildCtx(element));
        if (isJoin(element)) return createJoinElement(this.buildCtx(element));
        if (isFork(element)) return createForkElement(this.buildCtx(element));
        if (isDeepHistory(element)) return createDeepHistoryElement(this.buildCtx(element));
        if (isShallowHistory(element)) return createShallowHistoryElement(this.buildCtx(element));
        if (isExitPoint(element)) return createExitPointElement(this.buildCtx(element));
        if (isEntryPoint(element)) return createEntryPointElement(this.buildCtx(element));
        if (isTerminate(element)) return createTerminateElement(this.buildCtx(element));
        // Every diagram. A note belongs to none of the groups above because it belongs to all of them -
        // it says something about the diagram rather than being part of any one notation.
        if (isNote(element)) return createNoteElement(this.buildCtx(element));
        if (isTextLabel(element)) return createTextLabelElement(this.buildCtx(element));
        return undefined;
    }

    protected createEdgeElement(edge: unknown): GEdge | undefined {
        const gEdge = this.buildEdgeElement(edge);
        if (gEdge) {
            gEdge.routingPoints = this.modelState.getRoutingPoints(gEdge.id) ?? [];
        }
        return gEdge;
    }

    protected buildEdgeElement(edge: unknown): GEdge | undefined {
        if (isAbstraction(edge)) return createAbstractionRelation(this.buildCtx(edge));
        if (isAssociation(edge)) return createAssociationRelation(this.buildCtx(edge));
        if (isDependency(edge)) return createDependencyRelation(this.buildCtx(edge));
        if (isGeneralization(edge)) return createGeneralizationRelation(this.buildCtx(edge));
        if (isInterfaceRealization(edge)) return createInterfaceRealizationRelation(this.buildCtx(edge));
        if (isPackageImport(edge)) return createPackageImportRelation(this.buildCtx(edge));
        if (isPackageMerge(edge)) return createPackageMergeRelation(this.buildCtx(edge));
        if (isRealization(edge)) return createRealizationRelation(this.buildCtx(edge));
        if (isSubstitution(edge)) return createSubstitutionRelation(this.buildCtx(edge));
        if (isUsage(edge)) return createUsageRelation(this.buildCtx(edge));
        if (isElementImport(edge)) return createElementImportRelation(this.buildCtx(edge));
        if (isControlFlow(edge)) return createControlFlowRelation(this.buildCtx(edge));
        if (isInclude(edge)) return createIncludeRelation(this.buildCtx(edge));
        if (isExtend(edge)) return createExtendRelation(this.buildCtx(edge));
        if (isMessage(edge)) return createMessageRelation(this.buildCtx(edge));
        if (isCommunicationPath(edge)) return createCommunicationPathRelation(this.buildCtx(edge));
        if (isManifestation(edge)) return createManifestationRelation(this.buildCtx(edge));
        if (isDeployment(edge)) return createDeploymentRelation(this.buildCtx(edge));
        if (isTransition(edge)) return createTransitionRelation(this.buildCtx(edge));
        if (isInformationFlow(edge)) return createInformationFlowRelation(this.buildCtx(edge));
        return undefined;
    }
}
