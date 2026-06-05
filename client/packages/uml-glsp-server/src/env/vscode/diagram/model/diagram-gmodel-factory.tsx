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
    isAbstractClass,
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
    isEnumeration,
    isExecutionEnvironment,
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
    isTransition,
    isUsage,
    isUseCase,
    type Class
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
import { createEnumerationElement } from '../../elements/enumeration.element.js';
import { createExecutionEnvironmentElement } from '../../elements/execution-environment.element.js';
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
import { createTransitionRelation } from '../../elements/transition.element.js';
import { createUsageRelation } from '../../elements/usage-relation.element.js';
import { createUseCaseElement } from '../../elements/use-case.element.js';
import { DiagramModelState } from '../../features/index.js';
import { DiagramLanguageMetadata } from '../../features/model/diagram-language-metadata.js';
import { DiagramModelIndex } from '../../features/model/diagram-model-index.js';

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

        const nodes = diagram.entities.map(e => this.createNodeElement(e)).filter(Boolean) as GModelElement[];
        const edges = diagram.relations
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

    protected buildCtx<T>(node: T): ElementContext<T> {
        return {
            modelIndex: this.modelIndex,
            node,
            diagramType: this.modelState.diagramType!,
            elementType: this.metadata.convertToElementType((node as any).$type)
        };
    }

    protected createNodeElement(element: unknown): GModelElement | undefined {
        // AbstractClass must come before Class (AbstractClass extends Class)
        if (isAbstractClass(element)) return createClassElement(this.buildCtx(element as Class));
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
        return undefined;
    }

    protected createEdgeElement(edge: unknown): GEdge | undefined {
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
