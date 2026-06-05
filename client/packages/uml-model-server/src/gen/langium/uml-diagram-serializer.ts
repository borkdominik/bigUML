/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

// @ts-nocheck
import { DiagramSerializer, Serializer } from '../../src/langium-connector/serializer.js';
import {
    Diagram,
    isDiagram,
    UseCaseDiagram,
    isUseCaseDiagram,
    UseCase,
    isUseCase,
    Size,
    isSize,
    Position,
    isPosition,
    Subject,
    isSubject,
    Include,
    isInclude,
    Relation,
    isRelation,
    Generalization,
    isGeneralization,
    Extend,
    isExtend,
    Association,
    isAssociation,
    Property,
    isProperty,
    DataType,
    isDataType,
    PrimitiveType,
    isPrimitiveType,
    Operation,
    isOperation,
    Parameter,
    isParameter,
    Interface,
    isInterface,
    Enumeration,
    isEnumeration,
    EnumerationLiteral,
    isEnumerationLiteral,
    Class,
    isClass,
    Actor,
    isActor,
    StateMachineDiagram,
    isStateMachineDiagram,
    Transition,
    isTransition,
    StateMachine,
    isStateMachine,
    Region,
    isRegion,
    State,
    isState,
    ShallowHistory,
    isShallowHistory,
    Join,
    isJoin,
    InitialState,
    isInitialState,
    Fork,
    isFork,
    FinalState,
    isFinalState,
    DeepHistory,
    isDeepHistory,
    Choice,
    isChoice,
    PackageDiagram,
    isPackageDiagram,
    Usage,
    isUsage,
    PackageMerge,
    isPackageMerge,
    PackageImport,
    isPackageImport,
    Package,
    isPackage,
    ElementImport,
    isElementImport,
    Dependency,
    isDependency,
    Abstraction,
    isAbstraction,
    InformationFlowDiagram,
    isInformationFlowDiagram,
    InformationFlow,
    isInformationFlow,
    DeploymentDiagram,
    isDeploymentDiagram,
    Manifestation,
    isManifestation,
    ExecutionEnvironment,
    isExecutionEnvironment,
    DeploymentSpecification,
    isDeploymentSpecification,
    Artifact,
    isArtifact,
    Device,
    isDevice,
    DeploymentNode,
    isDeploymentNode,
    DeploymentPackage,
    isDeploymentPackage,
    DeploymentModel,
    isDeploymentModel,
    Deployment,
    isDeployment,
    CommunicationPath,
    isCommunicationPath,
    CommunicationDiagram,
    isCommunicationDiagram,
    Message,
    isMessage,
    Lifeline,
    isLifeline,
    Interaction,
    isInteraction,
    ClassDiagram,
    isClassDiagram,
    Substitution,
    isSubstitution,
    Slot,
    isSlot,
    LiteralSpecification,
    isLiteralSpecification,
    Realization,
    isRealization,
    InterfaceRealization,
    isInterfaceRealization,
    InstanceSpecification,
    isInstanceSpecification,
    AbstractClass,
    isAbstractClass,
    ActivityDiagram,
    isActivityDiagram,
    SendSignalAction,
    isSendSignalAction,
    OutputPin,
    isOutputPin,
    OpaqueAction,
    isOpaqueAction,
    InputPin,
    isInputPin,
    MergeNode,
    isMergeNode,
    JoinNode,
    isJoinNode,
    InitialNode,
    isInitialNode,
    ForkNode,
    isForkNode,
    FlowFinalNode,
    isFlowFinalNode,
    DecisionNode,
    isDecisionNode,
    ControlFlow,
    isControlFlow,
    CentralBufferNode,
    isCentralBufferNode,
    ActivityPartition,
    isActivityPartition,
    ActivityParameterNode,
    isActivityParameterNode,
    ActivityFinalNode,
    isActivityFinalNode,
    Activity,
    isActivity,
    AcceptEventAction,
    isAcceptEventAction,
    DiagramType,
    isDiagramType,
    UseCaseDiagramElements,
    isUseCaseDiagramElements,
    UseCaseDiagramNodes,
    isUseCaseDiagramNodes,
    UseCaseDiagramEdges,
    isUseCaseDiagramEdges,
    Visibility,
    isVisibility,
    AggregationType,
    isAggregationType,
    DataTypeReference,
    isDataTypeReference,
    Concurrency,
    isConcurrency,
    ParameterDirection,
    isParameterDirection,
    EffectType,
    isEffectType,
    StateMachineDiagramElements,
    isStateMachineDiagramElements,
    StateMachineDiagramNodes,
    isStateMachineDiagramNodes,
    StateMachineDiagramEdges,
    isStateMachineDiagramEdges,
    TransitionKind,
    isTransitionKind,
    PackageDiagramElements,
    isPackageDiagramElements,
    PackageDiagramNodes,
    isPackageDiagramNodes,
    PackageDiagramEdges,
    isPackageDiagramEdges,
    InformationFlowDiagramElements,
    isInformationFlowDiagramElements,
    InformationFlowDiagramNodes,
    isInformationFlowDiagramNodes,
    InformationFlowDiagramEdges,
    isInformationFlowDiagramEdges,
    DeploymentDiagramElements,
    isDeploymentDiagramElements,
    DeploymentDiagramNodes,
    isDeploymentDiagramNodes,
    DeploymentDiagramEdges,
    isDeploymentDiagramEdges,
    CommunicationDiagramElements,
    isCommunicationDiagramElements,
    CommunicationDiagramNodes,
    isCommunicationDiagramNodes,
    CommunicationDiagramEdges,
    isCommunicationDiagramEdges,
    ClassDiagramElements,
    isClassDiagramElements,
    ClassDiagramNodes,
    isClassDiagramNodes,
    ClassDiagramEdges,
    isClassDiagramEdges,
    SlotDefiningFeature,
    isSlotDefiningFeature,
    ActivityDiagramElements,
    isActivityDiagramElements,
    ActivityDiagramNodes,
    isActivityDiagramNodes,
    ActivityDiagramEdges,
    isActivityDiagramEdges,
    Element,
    isElement,
    ElementWithSizeAndPosition,
    isElementWithSizeAndPosition,
    Node,
    isNode,
    Edge,
    isEdge,
    Unbounded,
    isUnbounded,
    MetaInfo,
    isMetaInfo,
    UnionType_0,
    isUnionType_0,
    UnionType_1,
    isUnionType_1
} from '../langium/language/ast.js';
import { UmlDiagramServices } from '../../src/langium/uml-diagram-module.js';
import { AstNode } from 'langium';

export class UmlDiagramSerializer implements Serializer<Diagram>, DiagramSerializer<Diagram> {
    constructor(protected services: UmlDiagramServices) {}

    serialize(root: AstNode): string {
        let str: Array<string> = [];
        if (isDiagram(root)) {
            str.push('"diagram": ' + this.serializeDiagramType(root.diagram));
            str.push('"metaInfos": [\n' + root.metaInfos.map(element => '' + this.serializeMetaInfo(element)).join(',\n') + '\n]');
        }
        str = str.filter(element => !!element);
        const json = JSON.parse('{\n' + str.join(',\n') + '\n}');
        return JSON.stringify(json, undefined, '\t');
    }

    serializeUseCaseDiagram(element: UseCaseDiagram): string {
        let str: Array<string> = [];
        str.push('"__type": "UseCaseDiagram"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.diagramType !== undefined && element.diagramType !== null) {
            str.push('"diagramType": ' + '"' + element.diagramType + '"');
        }
        if (element.entities !== undefined && element.entities !== null) {
            str.push('"entities": [' + element.entities.map(property => this.serializeUseCaseDiagramNodes(property)).join(',') + ']');
        }
        if (element.relations !== undefined && element.relations !== null) {
            str.push('"relations": [' + element.relations.map(property => this.serializeUseCaseDiagramEdges(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeUseCase(element: UseCase): string {
        let str: Array<string> = [];
        str.push('"__type": "UseCase"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeSize(element: Size): string {
        let str: Array<string> = [];
        str.push('"__type": "Size"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.height !== undefined && element.height !== null) {
            str.push('"height": ' + element.height + '');
        }
        if (element.width !== undefined && element.width !== null) {
            str.push('"width": ' + element.width + '');
        }
        if (element.element !== undefined && element.element !== null) {
            str.push(
                '"element": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "ElementWithSizeAndPosition", "__value": "' +
                    (element.element.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializePosition(element: Position): string {
        let str: Array<string> = [];
        str.push('"__type": "Position"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.x !== undefined && element.x !== null) {
            str.push('"x": ' + element.x + '');
        }
        if (element.y !== undefined && element.y !== null) {
            str.push('"y": ' + element.y + '');
        }
        if (element.element !== undefined && element.element !== null) {
            str.push(
                '"element": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "ElementWithSizeAndPosition", "__value": "' +
                    (element.element.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeSubject(element: Subject): string {
        let str: Array<string> = [];
        str.push('"__type": "Subject"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.useCases !== undefined && element.useCases !== null) {
            str.push('"useCases": [' + element.useCases.map(property => this.serializeUseCase(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeInclude(element: Include): string {
        let str: Array<string> = [];
        str.push('"__type": "Include"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeRelation(element: Relation): string {
        let str: Array<string> = [];
        if (isInclude(element)) {
            return this.serializeInclude(element);
        }
        if (isGeneralization(element)) {
            return this.serializeGeneralization(element);
        }
        if (isExtend(element)) {
            return this.serializeExtend(element);
        }
        if (isAssociation(element)) {
            return this.serializeAssociation(element);
        }
        if (isUsage(element)) {
            return this.serializeUsage(element);
        }
        if (isPackageMerge(element)) {
            return this.serializePackageMerge(element);
        }
        if (isPackageImport(element)) {
            return this.serializePackageImport(element);
        }
        if (isElementImport(element)) {
            return this.serializeElementImport(element);
        }
        if (isDependency(element)) {
            return this.serializeDependency(element);
        }
        if (isAbstraction(element)) {
            return this.serializeAbstraction(element);
        }
        if (isManifestation(element)) {
            return this.serializeManifestation(element);
        }
        if (isDeployment(element)) {
            return this.serializeDeployment(element);
        }
        if (isCommunicationPath(element)) {
            return this.serializeCommunicationPath(element);
        }
        if (isSubstitution(element)) {
            return this.serializeSubstitution(element);
        }
        if (isRealization(element)) {
            return this.serializeRealization(element);
        }
        if (isInterfaceRealization(element)) {
            return this.serializeInterfaceRealization(element);
        }
        str.push('"__type": "Relation"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeGeneralization(element: Generalization): string {
        let str: Array<string> = [];
        str.push('"__type": "Generalization"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.isSubstitutable !== undefined && element.isSubstitutable !== null) {
            str.push('"isSubstitutable": ' + element.isSubstitutable + '');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeExtend(element: Extend): string {
        let str: Array<string> = [];
        str.push('"__type": "Extend"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeAssociation(element: Association): string {
        let str: Array<string> = [];
        str.push('"__type": "Association"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.sourceMultiplicity !== undefined && element.sourceMultiplicity !== null) {
            str.push('"sourceMultiplicity": ' + '"' + element.sourceMultiplicity + '"');
        }
        if (element.targetMultiplicity !== undefined && element.targetMultiplicity !== null) {
            str.push('"targetMultiplicity": ' + '"' + element.targetMultiplicity + '"');
        }
        if (element.sourceName !== undefined && element.sourceName !== null) {
            str.push('"sourceName": ' + '"' + element.sourceName + '"');
        }
        if (element.targetName !== undefined && element.targetName !== null) {
            str.push('"targetName": ' + '"' + element.targetName + '"');
        }
        if (element.sourceAggregation !== undefined && element.sourceAggregation !== null) {
            str.push('"sourceAggregation": ' + this.serializeAggregationType(element.sourceAggregation));
        }
        if (element.targetAggregation !== undefined && element.targetAggregation !== null) {
            str.push('"targetAggregation": ' + this.serializeAggregationType(element.targetAggregation));
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeProperty(element: Property): string {
        let str: Array<string> = [];
        str.push('"__type": "Property"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.isDerived !== undefined && element.isDerived !== null) {
            str.push('"isDerived": ' + element.isDerived + '');
        }
        if (element.isOrdered !== undefined && element.isOrdered !== null) {
            str.push('"isOrdered": ' + element.isOrdered + '');
        }
        if (element.isStatic !== undefined && element.isStatic !== null) {
            str.push('"isStatic": ' + element.isStatic + '');
        }
        if (element.isDerivedUnion !== undefined && element.isDerivedUnion !== null) {
            str.push('"isDerivedUnion": ' + element.isDerivedUnion + '');
        }
        if (element.isReadOnly !== undefined && element.isReadOnly !== null) {
            str.push('"isReadOnly": ' + element.isReadOnly + '');
        }
        if (element.isNavigable !== undefined && element.isNavigable !== null) {
            str.push('"isNavigable": ' + element.isNavigable + '');
        }
        if (element.isUnique !== undefined && element.isUnique !== null) {
            str.push('"isUnique": ' + element.isUnique + '');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.multiplicity !== undefined && element.multiplicity !== null) {
            str.push('"multiplicity": ' + '"' + element.multiplicity + '"');
        }
        if (element.propertyType !== undefined && element.propertyType !== null) {
            str.push(
                '"propertyType": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "DataTypeReference", "__value": "' +
                    (element.propertyType.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.aggregation !== undefined && element.aggregation !== null) {
            str.push('"aggregation": ' + this.serializeAggregationType(element.aggregation));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDataType(element: DataType): string {
        let str: Array<string> = [];
        str.push('"__type": "DataType"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.properties !== undefined && element.properties !== null) {
            str.push('"properties": [' + element.properties.map(property => this.serializeProperty(property)).join(',') + ']');
        }
        if (element.operations !== undefined && element.operations !== null) {
            str.push('"operations": [' + element.operations.map(property => this.serializeOperation(property)).join(',') + ']');
        }
        if (element.isAbstract !== undefined && element.isAbstract !== null) {
            str.push('"isAbstract": ' + element.isAbstract + '');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializePrimitiveType(element: PrimitiveType): string {
        let str: Array<string> = [];
        str.push('"__type": "PrimitiveType"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeOperation(element: Operation): string {
        let str: Array<string> = [];
        str.push('"__type": "Operation"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.isAbstract !== undefined && element.isAbstract !== null) {
            str.push('"isAbstract": ' + element.isAbstract + '');
        }
        if (element.isStatic !== undefined && element.isStatic !== null) {
            str.push('"isStatic": ' + element.isStatic + '');
        }
        if (element.isQuery !== undefined && element.isQuery !== null) {
            str.push('"isQuery": ' + element.isQuery + '');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.concurrency !== undefined && element.concurrency !== null) {
            str.push('"concurrency": ' + this.serializeConcurrency(element.concurrency));
        }
        if (element.parameters !== undefined && element.parameters !== null) {
            str.push('"parameters": [' + element.parameters.map(property => this.serializeParameter(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeParameter(element: Parameter): string {
        let str: Array<string> = [];
        str.push('"__type": "Parameter"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.isException !== undefined && element.isException !== null) {
            str.push('"isException": ' + element.isException + '');
        }
        if (element.isStream !== undefined && element.isStream !== null) {
            str.push('"isStream": ' + element.isStream + '');
        }
        if (element.isOrdered !== undefined && element.isOrdered !== null) {
            str.push('"isOrdered": ' + element.isOrdered + '');
        }
        if (element.isUnique !== undefined && element.isUnique !== null) {
            str.push('"isUnique": ' + element.isUnique + '');
        }
        if (element.direction !== undefined && element.direction !== null) {
            str.push('"direction": ' + this.serializeParameterDirection(element.direction));
        }
        if (element.effect !== undefined && element.effect !== null) {
            str.push('"effect": ' + this.serializeEffectType(element.effect));
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.parameterType !== undefined && element.parameterType !== null) {
            str.push(
                '"parameterType": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "DataTypeReference", "__value": "' +
                    (element.parameterType.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.multiplicity !== undefined && element.multiplicity !== null) {
            str.push('"multiplicity": ' + '"' + element.multiplicity + '"');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeInterface(element: Interface): string {
        let str: Array<string> = [];
        str.push('"__type": "Interface"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.properties !== undefined && element.properties !== null) {
            str.push('"properties": [' + element.properties.map(property => this.serializeProperty(property)).join(',') + ']');
        }
        if (element.operations !== undefined && element.operations !== null) {
            str.push('"operations": [' + element.operations.map(property => this.serializeOperation(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeEnumeration(element: Enumeration): string {
        let str: Array<string> = [];
        str.push('"__type": "Enumeration"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.isAbstract !== undefined && element.isAbstract !== null) {
            str.push('"isAbstract": ' + element.isAbstract + '');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.values !== undefined && element.values !== null) {
            str.push('"values": [' + element.values.map(property => this.serializeEnumerationLiteral(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeEnumerationLiteral(element: EnumerationLiteral): string {
        let str: Array<string> = [];
        str.push('"__type": "EnumerationLiteral"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.value !== undefined && element.value !== null) {
            str.push('"value": ' + '"' + element.value + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeClass(element: Class): string {
        let str: Array<string> = [];
        if (isAbstractClass(element)) {
            return this.serializeAbstractClass(element);
        }
        str.push('"__type": "Class"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.isAbstract !== undefined && element.isAbstract !== null) {
            str.push('"isAbstract": ' + element.isAbstract + '');
        }
        if (element.properties !== undefined && element.properties !== null) {
            str.push('"properties": [' + element.properties.map(property => this.serializeProperty(property)).join(',') + ']');
        }
        if (element.operations !== undefined && element.operations !== null) {
            str.push('"operations": [' + element.operations.map(property => this.serializeOperation(property)).join(',') + ']');
        }
        if (element.isActive !== undefined && element.isActive !== null) {
            str.push('"isActive": ' + element.isActive + '');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeActor(element: Actor): string {
        let str: Array<string> = [];
        str.push('"__type": "Actor"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeStateMachineDiagram(element: StateMachineDiagram): string {
        let str: Array<string> = [];
        str.push('"__type": "StateMachineDiagram"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.diagramType !== undefined && element.diagramType !== null) {
            str.push('"diagramType": ' + '"' + element.diagramType + '"');
        }
        if (element.entities !== undefined && element.entities !== null) {
            str.push('"entities": [' + element.entities.map(property => this.serializeStateMachineDiagramNodes(property)).join(',') + ']');
        }
        if (element.relations !== undefined && element.relations !== null) {
            str.push(
                '"relations": [' + element.relations.map(property => this.serializeStateMachineDiagramEdges(property)).join(',') + ']'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeTransition(element: Transition): string {
        let str: Array<string> = [];
        str.push('"__type": "Transition"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.kind !== undefined && element.kind !== null) {
            str.push('"kind": ' + this.serializeTransitionKind(element.kind));
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "UnionType_0", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeStateMachine(element: StateMachine): string {
        let str: Array<string> = [];
        str.push('"__type": "StateMachine"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.regions !== undefined && element.regions !== null) {
            str.push('"regions": [' + element.regions.map(property => this.serializeRegion(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeRegion(element: Region): string {
        let str: Array<string> = [];
        str.push('"__type": "Region"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.subvertices !== undefined && element.subvertices !== null) {
            str.push('"subvertices": [' + element.subvertices.map(property => this.serializeNode(property)).join(',') + ']');
        }
        if (element.transitions !== undefined && element.transitions !== null) {
            str.push('"transitions": [' + element.transitions.map(property => this.serializeTransition(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeState(element: State): string {
        let str: Array<string> = [];
        str.push('"__type": "State"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.regions !== undefined && element.regions !== null) {
            str.push('"regions": [' + element.regions.map(property => this.serializeRegion(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeShallowHistory(element: ShallowHistory): string {
        let str: Array<string> = [];
        str.push('"__type": "ShallowHistory"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeJoin(element: Join): string {
        let str: Array<string> = [];
        str.push('"__type": "Join"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeInitialState(element: InitialState): string {
        let str: Array<string> = [];
        str.push('"__type": "InitialState"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeFork(element: Fork): string {
        let str: Array<string> = [];
        str.push('"__type": "Fork"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeFinalState(element: FinalState): string {
        let str: Array<string> = [];
        str.push('"__type": "FinalState"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDeepHistory(element: DeepHistory): string {
        let str: Array<string> = [];
        str.push('"__type": "DeepHistory"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeChoice(element: Choice): string {
        let str: Array<string> = [];
        str.push('"__type": "Choice"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializePackageDiagram(element: PackageDiagram): string {
        let str: Array<string> = [];
        str.push('"__type": "PackageDiagram"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.diagramType !== undefined && element.diagramType !== null) {
            str.push('"diagramType": ' + '"' + element.diagramType + '"');
        }
        if (element.entities !== undefined && element.entities !== null) {
            str.push('"entities": [' + element.entities.map(property => this.serializePackageDiagramNodes(property)).join(',') + ']');
        }
        if (element.relations !== undefined && element.relations !== null) {
            str.push('"relations": [' + element.relations.map(property => this.serializePackageDiagramEdges(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeUsage(element: Usage): string {
        let str: Array<string> = [];
        str.push('"__type": "Usage"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializePackageMerge(element: PackageMerge): string {
        let str: Array<string> = [];
        str.push('"__type": "PackageMerge"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializePackageImport(element: PackageImport): string {
        let str: Array<string> = [];
        str.push('"__type": "PackageImport"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializePackage(element: Package): string {
        let str: Array<string> = [];
        str.push('"__type": "Package"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.uri !== undefined && element.uri !== null) {
            str.push('"uri": ' + '"' + element.uri + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.entities !== undefined && element.entities !== null) {
            str.push('"entities": [' + element.entities.map(property => this.serializeNode(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeElementImport(element: ElementImport): string {
        let str: Array<string> = [];
        str.push('"__type": "ElementImport"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.alias !== undefined && element.alias !== null) {
            str.push('"alias": ' + '"' + element.alias + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDependency(element: Dependency): string {
        let str: Array<string> = [];
        str.push('"__type": "Dependency"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeAbstraction(element: Abstraction): string {
        let str: Array<string> = [];
        str.push('"__type": "Abstraction"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeInformationFlowDiagram(element: InformationFlowDiagram): string {
        let str: Array<string> = [];
        str.push('"__type": "InformationFlowDiagram"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.diagramType !== undefined && element.diagramType !== null) {
            str.push('"diagramType": ' + '"' + element.diagramType + '"');
        }
        if (element.entities !== undefined && element.entities !== null) {
            str.push(
                '"entities": [' + element.entities.map(property => this.serializeInformationFlowDiagramNodes(property)).join(',') + ']'
            );
        }
        if (element.relations !== undefined && element.relations !== null) {
            str.push(
                '"relations": [' + element.relations.map(property => this.serializeInformationFlowDiagramEdges(property)).join(',') + ']'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeInformationFlow(element: InformationFlow): string {
        let str: Array<string> = [];
        str.push('"__type": "InformationFlow"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "UnionType_1", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Actor", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDeploymentDiagram(element: DeploymentDiagram): string {
        let str: Array<string> = [];
        str.push('"__type": "DeploymentDiagram"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.diagramType !== undefined && element.diagramType !== null) {
            str.push('"diagramType": ' + '"' + element.diagramType + '"');
        }
        if (element.entities !== undefined && element.entities !== null) {
            str.push('"entities": [' + element.entities.map(property => this.serializeDeploymentDiagramNodes(property)).join(',') + ']');
        }
        if (element.relations !== undefined && element.relations !== null) {
            str.push('"relations": [' + element.relations.map(property => this.serializeDeploymentDiagramEdges(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeManifestation(element: Manifestation): string {
        let str: Array<string> = [];
        str.push('"__type": "Manifestation"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeExecutionEnvironment(element: ExecutionEnvironment): string {
        let str: Array<string> = [];
        str.push('"__type": "ExecutionEnvironment"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.nestedEnvironments !== undefined && element.nestedEnvironments !== null) {
            str.push(
                '"nestedEnvironments": [' +
                    element.nestedEnvironments.map(property => this.serializeExecutionEnvironment(property)).join(',') +
                    ']'
            );
        }
        if (element.artifacts !== undefined && element.artifacts !== null) {
            str.push('"artifacts": [' + element.artifacts.map(property => this.serializeArtifact(property)).join(',') + ']');
        }
        if (element.deploymentSpecifications !== undefined && element.deploymentSpecifications !== null) {
            str.push(
                '"deploymentSpecifications": [' +
                    element.deploymentSpecifications.map(property => this.serializeDeploymentSpecification(property)).join(',') +
                    ']'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDeploymentSpecification(element: DeploymentSpecification): string {
        let str: Array<string> = [];
        str.push('"__type": "DeploymentSpecification"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.properties !== undefined && element.properties !== null) {
            str.push('"properties": [' + element.properties.map(property => this.serializeProperty(property)).join(',') + ']');
        }
        if (element.operations !== undefined && element.operations !== null) {
            str.push('"operations": [' + element.operations.map(property => this.serializeOperation(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeArtifact(element: Artifact): string {
        let str: Array<string> = [];
        str.push('"__type": "Artifact"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.properties !== undefined && element.properties !== null) {
            str.push('"properties": [' + element.properties.map(property => this.serializeProperty(property)).join(',') + ']');
        }
        if (element.operations !== undefined && element.operations !== null) {
            str.push('"operations": [' + element.operations.map(property => this.serializeOperation(property)).join(',') + ']');
        }
        if (element.nestedArtifacts !== undefined && element.nestedArtifacts !== null) {
            str.push('"nestedArtifacts": [' + element.nestedArtifacts.map(property => this.serializeArtifact(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDevice(element: Device): string {
        let str: Array<string> = [];
        str.push('"__type": "Device"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.nodes !== undefined && element.nodes !== null) {
            str.push('"nodes": [' + element.nodes.map(property => this.serializeDeploymentNode(property)).join(',') + ']');
        }
        if (element.executionEnvironments !== undefined && element.executionEnvironments !== null) {
            str.push(
                '"executionEnvironments": [' +
                    element.executionEnvironments.map(property => this.serializeExecutionEnvironment(property)).join(',') +
                    ']'
            );
        }
        if (element.deploymentSpecifications !== undefined && element.deploymentSpecifications !== null) {
            str.push(
                '"deploymentSpecifications": [' +
                    element.deploymentSpecifications.map(property => this.serializeDeploymentSpecification(property)).join(',') +
                    ']'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDeploymentNode(element: DeploymentNode): string {
        let str: Array<string> = [];
        str.push('"__type": "DeploymentNode"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.nestedNodes !== undefined && element.nestedNodes !== null) {
            str.push('"nestedNodes": [' + element.nestedNodes.map(property => this.serializeDeploymentNode(property)).join(',') + ']');
        }
        if (element.artifacts !== undefined && element.artifacts !== null) {
            str.push('"artifacts": [' + element.artifacts.map(property => this.serializeArtifact(property)).join(',') + ']');
        }
        if (element.devices !== undefined && element.devices !== null) {
            str.push('"devices": [' + element.devices.map(property => this.serializeDevice(property)).join(',') + ']');
        }
        if (element.deploymentSpecifications !== undefined && element.deploymentSpecifications !== null) {
            str.push(
                '"deploymentSpecifications": [' +
                    element.deploymentSpecifications.map(property => this.serializeDeploymentSpecification(property)).join(',') +
                    ']'
            );
        }
        if (element.executionEnvironments !== undefined && element.executionEnvironments !== null) {
            str.push(
                '"executionEnvironments": [' +
                    element.executionEnvironments.map(property => this.serializeExecutionEnvironment(property)).join(',') +
                    ']'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDeploymentPackage(element: DeploymentPackage): string {
        let str: Array<string> = [];
        str.push('"__type": "DeploymentPackage"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.uri !== undefined && element.uri !== null) {
            str.push('"uri": ' + '"' + element.uri + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.entities !== undefined && element.entities !== null) {
            str.push('"entities": [' + element.entities.map(property => this.serializeNode(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDeploymentModel(element: DeploymentModel): string {
        let str: Array<string> = [];
        str.push('"__type": "DeploymentModel"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.uri !== undefined && element.uri !== null) {
            str.push('"uri": ' + '"' + element.uri + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.entities !== undefined && element.entities !== null) {
            str.push('"entities": [' + element.entities.map(property => this.serializeNode(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDeployment(element: Deployment): string {
        let str: Array<string> = [];
        str.push('"__type": "Deployment"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeCommunicationPath(element: CommunicationPath): string {
        let str: Array<string> = [];
        str.push('"__type": "CommunicationPath"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeCommunicationDiagram(element: CommunicationDiagram): string {
        let str: Array<string> = [];
        str.push('"__type": "CommunicationDiagram"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.diagramType !== undefined && element.diagramType !== null) {
            str.push('"diagramType": ' + '"' + element.diagramType + '"');
        }
        if (element.entities !== undefined && element.entities !== null) {
            str.push('"entities": [' + element.entities.map(property => this.serializeCommunicationDiagramNodes(property)).join(',') + ']');
        }
        if (element.relations !== undefined && element.relations !== null) {
            str.push(
                '"relations": [' + element.relations.map(property => this.serializeCommunicationDiagramEdges(property)).join(',') + ']'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeMessage(element: Message): string {
        let str: Array<string> = [];
        str.push('"__type": "Message"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Lifeline", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Lifeline", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeLifeline(element: Lifeline): string {
        let str: Array<string> = [];
        str.push('"__type": "Lifeline"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeInteraction(element: Interaction): string {
        let str: Array<string> = [];
        str.push('"__type": "Interaction"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.lifelines !== undefined && element.lifelines !== null) {
            str.push('"lifelines": [' + element.lifelines.map(property => this.serializeLifeline(property)).join(',') + ']');
        }
        if (element.messages !== undefined && element.messages !== null) {
            str.push('"messages": [' + element.messages.map(property => this.serializeMessage(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeClassDiagram(element: ClassDiagram): string {
        let str: Array<string> = [];
        str.push('"__type": "ClassDiagram"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.diagramType !== undefined && element.diagramType !== null) {
            str.push('"diagramType": ' + '"' + element.diagramType + '"');
        }
        if (element.entities !== undefined && element.entities !== null) {
            str.push('"entities": [' + element.entities.map(property => this.serializeClassDiagramNodes(property)).join(',') + ']');
        }
        if (element.relations !== undefined && element.relations !== null) {
            str.push('"relations": [' + element.relations.map(property => this.serializeClassDiagramEdges(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeSubstitution(element: Substitution): string {
        let str: Array<string> = [];
        str.push('"__type": "Substitution"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeSlot(element: Slot): string {
        let str: Array<string> = [];
        str.push('"__type": "Slot"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.definingFeature !== undefined && element.definingFeature !== null) {
            str.push(
                '"definingFeature": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "SlotDefiningFeature", "__value": "' +
                    (element.definingFeature.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.values !== undefined && element.values !== null) {
            str.push('"values": [' + element.values.map(property => this.serializeLiteralSpecification(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeLiteralSpecification(element: LiteralSpecification): string {
        let str: Array<string> = [];
        str.push('"__type": "LiteralSpecification"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.value !== undefined && element.value !== null) {
            str.push('"value": ' + '"' + element.value + '"');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeRealization(element: Realization): string {
        let str: Array<string> = [];
        str.push('"__type": "Realization"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeInterfaceRealization(element: InterfaceRealization): string {
        let str: Array<string> = [];
        str.push('"__type": "InterfaceRealization"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeInstanceSpecification(element: InstanceSpecification): string {
        let str: Array<string> = [];
        str.push('"__type": "InstanceSpecification"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.slots !== undefined && element.slots !== null) {
            str.push('"slots": [' + element.slots.map(property => this.serializeSlot(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeAbstractClass(element: AbstractClass): string {
        let str: Array<string> = [];
        str.push('"__type": "AbstractClass"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.isAbstract !== undefined && element.isAbstract !== null) {
            str.push('"isAbstract": ' + element.isAbstract + '');
        }
        if (element.properties !== undefined && element.properties !== null) {
            str.push('"properties": [' + element.properties.map(property => this.serializeProperty(property)).join(',') + ']');
        }
        if (element.operations !== undefined && element.operations !== null) {
            str.push('"operations": [' + element.operations.map(property => this.serializeOperation(property)).join(',') + ']');
        }
        if (element.isActive !== undefined && element.isActive !== null) {
            str.push('"isActive": ' + element.isActive + '');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.label !== undefined && element.label !== null) {
            str.push('"label": ' + '"' + element.label + '"');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeActivityDiagram(element: ActivityDiagram): string {
        let str: Array<string> = [];
        str.push('"__type": "ActivityDiagram"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.diagramType !== undefined && element.diagramType !== null) {
            str.push('"diagramType": ' + '"' + element.diagramType + '"');
        }
        if (element.entities !== undefined && element.entities !== null) {
            str.push('"entities": [' + element.entities.map(property => this.serializeActivityDiagramNodes(property)).join(',') + ']');
        }
        if (element.relations !== undefined && element.relations !== null) {
            str.push('"relations": [' + element.relations.map(property => this.serializeActivityDiagramEdges(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeSendSignalAction(element: SendSignalAction): string {
        let str: Array<string> = [];
        str.push('"__type": "SendSignalAction"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeOutputPin(element: OutputPin): string {
        let str: Array<string> = [];
        str.push('"__type": "OutputPin"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeOpaqueAction(element: OpaqueAction): string {
        let str: Array<string> = [];
        str.push('"__type": "OpaqueAction"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.inputPins !== undefined && element.inputPins !== null) {
            str.push('"inputPins": [' + element.inputPins.map(property => this.serializeInputPin(property)).join(',') + ']');
        }
        if (element.outputPins !== undefined && element.outputPins !== null) {
            str.push('"outputPins": [' + element.outputPins.map(property => this.serializeOutputPin(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeInputPin(element: InputPin): string {
        let str: Array<string> = [];
        str.push('"__type": "InputPin"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeMergeNode(element: MergeNode): string {
        let str: Array<string> = [];
        str.push('"__type": "MergeNode"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeJoinNode(element: JoinNode): string {
        let str: Array<string> = [];
        str.push('"__type": "JoinNode"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeInitialNode(element: InitialNode): string {
        let str: Array<string> = [];
        str.push('"__type": "InitialNode"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeForkNode(element: ForkNode): string {
        let str: Array<string> = [];
        str.push('"__type": "ForkNode"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeFlowFinalNode(element: FlowFinalNode): string {
        let str: Array<string> = [];
        str.push('"__type": "FlowFinalNode"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDecisionNode(element: DecisionNode): string {
        let str: Array<string> = [];
        str.push('"__type": "DecisionNode"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeControlFlow(element: ControlFlow): string {
        let str: Array<string> = [];
        str.push('"__type": "ControlFlow"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.guard !== undefined && element.guard !== null) {
            str.push('"guard": ' + '"' + element.guard + '"');
        }
        if (element.weight !== undefined && element.weight !== null) {
            str.push('"weight": ' + element.weight + '');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Node", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeCentralBufferNode(element: CentralBufferNode): string {
        let str: Array<string> = [];
        str.push('"__type": "CentralBufferNode"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeActivityPartition(element: ActivityPartition): string {
        let str: Array<string> = [];
        str.push('"__type": "ActivityPartition"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.subpartitions !== undefined && element.subpartitions !== null) {
            str.push(
                '"subpartitions": [' + element.subpartitions.map(property => this.serializeActivityPartition(property)).join(',') + ']'
            );
        }
        if (element.nodes !== undefined && element.nodes !== null) {
            str.push('"nodes": [' + element.nodes.map(property => this.serializeNode(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeActivityParameterNode(element: ActivityParameterNode): string {
        let str: Array<string> = [];
        str.push('"__type": "ActivityParameterNode"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeActivityFinalNode(element: ActivityFinalNode): string {
        let str: Array<string> = [];
        str.push('"__type": "ActivityFinalNode"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeActivity(element: Activity): string {
        let str: Array<string> = [];
        str.push('"__type": "Activity"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.partitions !== undefined && element.partitions !== null) {
            str.push('"partitions": [' + element.partitions.map(property => this.serializeActivityPartition(property)).join(',') + ']');
        }
        if (element.nodes !== undefined && element.nodes !== null) {
            str.push('"nodes": [' + element.nodes.map(property => this.serializeNode(property)).join(',') + ']');
        }
        if (element.edges !== undefined && element.edges !== null) {
            str.push('"edges": [' + element.edges.map(property => this.serializeControlFlow(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeAcceptEventAction(element: AcceptEventAction): string {
        let str: Array<string> = [];
        str.push('"__type": "AcceptEventAction"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDiagram(element: Diagram): string {
        let str: Array<string> = [];
        if (element.diagram !== undefined && element.diagram !== null) {
            str.push('"diagram": ' + this.serializeDiagramType(element.diagram));
        }
        if (element.metaInfos !== undefined && element.metaInfos !== null) {
            str.push('"metaInfos": [' + element.metaInfos.map(property => this.serializeMetaInfo(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDiagramType(element: DiagramType): any {
        if (isActivityDiagram(element)) {
            return this.serializeActivityDiagram(element);
        }
        if (isClassDiagram(element)) {
            return this.serializeClassDiagram(element);
        }
        if (isCommunicationDiagram(element)) {
            return this.serializeCommunicationDiagram(element);
        }
        if (isDeploymentDiagram(element)) {
            return this.serializeDeploymentDiagram(element);
        }
        if (isInformationFlowDiagram(element)) {
            return this.serializeInformationFlowDiagram(element);
        }
        if (isPackageDiagram(element)) {
            return this.serializePackageDiagram(element);
        }
        if (isStateMachineDiagram(element)) {
            return this.serializeStateMachineDiagram(element);
        }
        if (isUseCaseDiagram(element)) {
            return this.serializeUseCaseDiagram(element);
        }
    }

    serializeUseCaseDiagramElements(element: UseCaseDiagramElements): any {
        if (isUseCaseDiagramNodes(element)) {
            return this.serializeUseCaseDiagramNodes(element);
        }
        if (isUseCaseDiagramEdges(element)) {
            return this.serializeUseCaseDiagramEdges(element);
        }
    }

    serializeUseCaseDiagramNodes(element: UseCaseDiagramNodes): any {
        if (isUseCase(element)) {
            return this.serializeUseCase(element);
        }
        if (isActor(element)) {
            return this.serializeActor(element);
        }
        if (isSubject(element)) {
            return this.serializeSubject(element);
        }
    }

    serializeUseCaseDiagramEdges(element: UseCaseDiagramEdges): any {
        if (isInclude(element)) {
            return this.serializeInclude(element);
        }
        if (isExtend(element)) {
            return this.serializeExtend(element);
        }
        if (isAssociation(element)) {
            return this.serializeAssociation(element);
        }
        if (isGeneralization(element)) {
            return this.serializeGeneralization(element);
        }
    }

    serializeVisibility(element: Visibility): any {
        return '"' + element + '"';
    }

    serializeAggregationType(element: AggregationType): any {
        return '"' + element + '"';
    }

    serializeDataTypeReference(element: DataTypeReference): any {
        if (isDataType(element)) {
            return this.serializeDataType(element);
        }
        if (isEnumeration(element)) {
            return this.serializeEnumeration(element);
        }
        if (isClass(element)) {
            return this.serializeClass(element);
        }
        if (isInterface(element)) {
            return this.serializeInterface(element);
        }
        if (isPrimitiveType(element)) {
            return this.serializePrimitiveType(element);
        }
    }

    serializeConcurrency(element: Concurrency): any {
        return '"' + element + '"';
    }

    serializeParameterDirection(element: ParameterDirection): any {
        return '"' + element + '"';
    }

    serializeEffectType(element: EffectType): any {
        return '"' + element + '"';
    }

    serializeStateMachineDiagramElements(element: StateMachineDiagramElements): any {
        if (isStateMachineDiagramNodes(element)) {
            return this.serializeStateMachineDiagramNodes(element);
        }
        if (isStateMachineDiagramEdges(element)) {
            return this.serializeStateMachineDiagramEdges(element);
        }
    }

    serializeStateMachineDiagramNodes(element: StateMachineDiagramNodes): any {
        if (isStateMachine(element)) {
            return this.serializeStateMachine(element);
        }
        if (isRegion(element)) {
            return this.serializeRegion(element);
        }
        if (isState(element)) {
            return this.serializeState(element);
        }
        if (isFinalState(element)) {
            return this.serializeFinalState(element);
        }
        if (isInitialState(element)) {
            return this.serializeInitialState(element);
        }
        if (isChoice(element)) {
            return this.serializeChoice(element);
        }
        if (isJoin(element)) {
            return this.serializeJoin(element);
        }
        if (isFork(element)) {
            return this.serializeFork(element);
        }
        if (isDeepHistory(element)) {
            return this.serializeDeepHistory(element);
        }
        if (isShallowHistory(element)) {
            return this.serializeShallowHistory(element);
        }
    }

    serializeStateMachineDiagramEdges(element: StateMachineDiagramEdges): any {
        if (isTransition(element)) {
            return this.serializeTransition(element);
        }
    }

    serializeTransitionKind(element: TransitionKind): any {
        return '"' + element + '"';
    }

    serializePackageDiagramElements(element: PackageDiagramElements): any {
        if (isPackageDiagramNodes(element)) {
            return this.serializePackageDiagramNodes(element);
        }
        if (isPackageDiagramEdges(element)) {
            return this.serializePackageDiagramEdges(element);
        }
    }

    serializePackageDiagramNodes(element: PackageDiagramNodes): any {
        if (isPackage(element)) {
            return this.serializePackage(element);
        }
        if (isClass(element)) {
            return this.serializeClass(element);
        }
        if (isProperty(element)) {
            return this.serializeProperty(element);
        }
        if (isOperation(element)) {
            return this.serializeOperation(element);
        }
        if (isParameter(element)) {
            return this.serializeParameter(element);
        }
    }

    serializePackageDiagramEdges(element: PackageDiagramEdges): any {
        if (isPackageImport(element)) {
            return this.serializePackageImport(element);
        }
        if (isPackageMerge(element)) {
            return this.serializePackageMerge(element);
        }
        if (isElementImport(element)) {
            return this.serializeElementImport(element);
        }
        if (isDependency(element)) {
            return this.serializeDependency(element);
        }
        if (isAbstraction(element)) {
            return this.serializeAbstraction(element);
        }
        if (isUsage(element)) {
            return this.serializeUsage(element);
        }
    }

    serializeInformationFlowDiagramElements(element: InformationFlowDiagramElements): any {
        if (isInformationFlowDiagramNodes(element)) {
            return this.serializeInformationFlowDiagramNodes(element);
        }
        if (isInformationFlowDiagramEdges(element)) {
            return this.serializeInformationFlowDiagramEdges(element);
        }
    }

    serializeInformationFlowDiagramNodes(element: InformationFlowDiagramNodes): any {
        if (isActor(element)) {
            return this.serializeActor(element);
        }
        if (isClass(element)) {
            return this.serializeClass(element);
        }
        if (isProperty(element)) {
            return this.serializeProperty(element);
        }
        if (isOperation(element)) {
            return this.serializeOperation(element);
        }
        if (isParameter(element)) {
            return this.serializeParameter(element);
        }
    }

    serializeInformationFlowDiagramEdges(element: InformationFlowDiagramEdges): any {
        if (isInformationFlow(element)) {
            return this.serializeInformationFlow(element);
        }
    }

    serializeDeploymentDiagramElements(element: DeploymentDiagramElements): any {
        if (isDeploymentDiagramNodes(element)) {
            return this.serializeDeploymentDiagramNodes(element);
        }
        if (isDeploymentDiagramEdges(element)) {
            return this.serializeDeploymentDiagramEdges(element);
        }
    }

    serializeDeploymentDiagramNodes(element: DeploymentDiagramNodes): any {
        if (isArtifact(element)) {
            return this.serializeArtifact(element);
        }
        if (isDeploymentSpecification(element)) {
            return this.serializeDeploymentSpecification(element);
        }
        if (isDevice(element)) {
            return this.serializeDevice(element);
        }
        if (isExecutionEnvironment(element)) {
            return this.serializeExecutionEnvironment(element);
        }
        if (isDeploymentModel(element)) {
            return this.serializeDeploymentModel(element);
        }
        if (isDeploymentNode(element)) {
            return this.serializeDeploymentNode(element);
        }
        if (isDeploymentPackage(element)) {
            return this.serializeDeploymentPackage(element);
        }
        if (isProperty(element)) {
            return this.serializeProperty(element);
        }
        if (isOperation(element)) {
            return this.serializeOperation(element);
        }
        if (isParameter(element)) {
            return this.serializeParameter(element);
        }
    }

    serializeDeploymentDiagramEdges(element: DeploymentDiagramEdges): any {
        if (isCommunicationPath(element)) {
            return this.serializeCommunicationPath(element);
        }
        if (isDependency(element)) {
            return this.serializeDependency(element);
        }
        if (isManifestation(element)) {
            return this.serializeManifestation(element);
        }
        if (isDeployment(element)) {
            return this.serializeDeployment(element);
        }
        if (isGeneralization(element)) {
            return this.serializeGeneralization(element);
        }
    }

    serializeCommunicationDiagramElements(element: CommunicationDiagramElements): any {
        if (isCommunicationDiagramNodes(element)) {
            return this.serializeCommunicationDiagramNodes(element);
        }
        if (isCommunicationDiagramEdges(element)) {
            return this.serializeCommunicationDiagramEdges(element);
        }
    }

    serializeCommunicationDiagramNodes(element: CommunicationDiagramNodes): any {
        if (isInteraction(element)) {
            return this.serializeInteraction(element);
        }
        if (isLifeline(element)) {
            return this.serializeLifeline(element);
        }
    }

    serializeCommunicationDiagramEdges(element: CommunicationDiagramEdges): any {
        if (isMessage(element)) {
            return this.serializeMessage(element);
        }
    }

    serializeClassDiagramElements(element: ClassDiagramElements): any {
        if (isClassDiagramNodes(element)) {
            return this.serializeClassDiagramNodes(element);
        }
        if (isClassDiagramEdges(element)) {
            return this.serializeClassDiagramEdges(element);
        }
    }

    serializeClassDiagramNodes(element: ClassDiagramNodes): any {
        if (isEnumeration(element)) {
            return this.serializeEnumeration(element);
        }
        if (isEnumerationLiteral(element)) {
            return this.serializeEnumerationLiteral(element);
        }
        if (isClass(element)) {
            return this.serializeClass(element);
        }
        if (isAbstractClass(element)) {
            return this.serializeAbstractClass(element);
        }
        if (isInterface(element)) {
            return this.serializeInterface(element);
        }
        if (isPackage(element)) {
            return this.serializePackage(element);
        }
        if (isProperty(element)) {
            return this.serializeProperty(element);
        }
        if (isOperation(element)) {
            return this.serializeOperation(element);
        }
        if (isParameter(element)) {
            return this.serializeParameter(element);
        }
        if (isDataType(element)) {
            return this.serializeDataType(element);
        }
        if (isPrimitiveType(element)) {
            return this.serializePrimitiveType(element);
        }
        if (isInstanceSpecification(element)) {
            return this.serializeInstanceSpecification(element);
        }
        if (isSlot(element)) {
            return this.serializeSlot(element);
        }
        if (isLiteralSpecification(element)) {
            return this.serializeLiteralSpecification(element);
        }
    }

    serializeClassDiagramEdges(element: ClassDiagramEdges): any {
        if (isAbstraction(element)) {
            return this.serializeAbstraction(element);
        }
        if (isDependency(element)) {
            return this.serializeDependency(element);
        }
        if (isAssociation(element)) {
            return this.serializeAssociation(element);
        }
        if (isElementImport(element)) {
            return this.serializeElementImport(element);
        }
        if (isInterfaceRealization(element)) {
            return this.serializeInterfaceRealization(element);
        }
        if (isGeneralization(element)) {
            return this.serializeGeneralization(element);
        }
        if (isPackageImport(element)) {
            return this.serializePackageImport(element);
        }
        if (isPackageMerge(element)) {
            return this.serializePackageMerge(element);
        }
        if (isRealization(element)) {
            return this.serializeRealization(element);
        }
        if (isSubstitution(element)) {
            return this.serializeSubstitution(element);
        }
        if (isUsage(element)) {
            return this.serializeUsage(element);
        }
    }

    serializeSlotDefiningFeature(element: SlotDefiningFeature): any {
        if (isProperty(element)) {
            return this.serializeProperty(element);
        }
        if (isClass(element)) {
            return this.serializeClass(element);
        }
        if (isInterface(element)) {
            return this.serializeInterface(element);
        }
    }

    serializeActivityDiagramElements(element: ActivityDiagramElements): any {
        if (isActivityDiagramNodes(element)) {
            return this.serializeActivityDiagramNodes(element);
        }
        if (isActivityDiagramEdges(element)) {
            return this.serializeActivityDiagramEdges(element);
        }
    }

    serializeActivityDiagramNodes(element: ActivityDiagramNodes): any {
        if (isActivity(element)) {
            return this.serializeActivity(element);
        }
        if (isActivityPartition(element)) {
            return this.serializeActivityPartition(element);
        }
        if (isOpaqueAction(element)) {
            return this.serializeOpaqueAction(element);
        }
        if (isAcceptEventAction(element)) {
            return this.serializeAcceptEventAction(element);
        }
        if (isSendSignalAction(element)) {
            return this.serializeSendSignalAction(element);
        }
        if (isInitialNode(element)) {
            return this.serializeInitialNode(element);
        }
        if (isDecisionNode(element)) {
            return this.serializeDecisionNode(element);
        }
        if (isMergeNode(element)) {
            return this.serializeMergeNode(element);
        }
        if (isJoinNode(element)) {
            return this.serializeJoinNode(element);
        }
        if (isForkNode(element)) {
            return this.serializeForkNode(element);
        }
        if (isActivityFinalNode(element)) {
            return this.serializeActivityFinalNode(element);
        }
        if (isFlowFinalNode(element)) {
            return this.serializeFlowFinalNode(element);
        }
        if (isCentralBufferNode(element)) {
            return this.serializeCentralBufferNode(element);
        }
        if (isActivityParameterNode(element)) {
            return this.serializeActivityParameterNode(element);
        }
        if (isInputPin(element)) {
            return this.serializeInputPin(element);
        }
        if (isOutputPin(element)) {
            return this.serializeOutputPin(element);
        }
    }

    serializeActivityDiagramEdges(element: ActivityDiagramEdges): any {
        if (isControlFlow(element)) {
            return this.serializeControlFlow(element);
        }
    }

    serializeElement(element: Element): any {
        if (isElementWithSizeAndPosition(element)) {
            return this.serializeElementWithSizeAndPosition(element);
        }
        if (isEdge(element)) {
            return this.serializeEdge(element);
        }
        if (isUnbounded(element)) {
            return this.serializeUnbounded(element);
        }
    }

    serializeElementWithSizeAndPosition(element: ElementWithSizeAndPosition): any {
        if (isNode(element)) {
            return this.serializeNode(element);
        }
    }

    serializeNode(element: Node): any {
        if (isUseCase(element)) {
            return this.serializeUseCase(element);
        }
        if (isSubject(element)) {
            return this.serializeSubject(element);
        }
        if (isDataType(element)) {
            return this.serializeDataType(element);
        }
        if (isPrimitiveType(element)) {
            return this.serializePrimitiveType(element);
        }
        if (isOperation(element)) {
            return this.serializeOperation(element);
        }
        if (isInterface(element)) {
            return this.serializeInterface(element);
        }
        if (isEnumeration(element)) {
            return this.serializeEnumeration(element);
        }
        if (isClass(element)) {
            return this.serializeClass(element);
        }
        if (isActor(element)) {
            return this.serializeActor(element);
        }
        if (isStateMachine(element)) {
            return this.serializeStateMachine(element);
        }
        if (isRegion(element)) {
            return this.serializeRegion(element);
        }
        if (isState(element)) {
            return this.serializeState(element);
        }
        if (isShallowHistory(element)) {
            return this.serializeShallowHistory(element);
        }
        if (isJoin(element)) {
            return this.serializeJoin(element);
        }
        if (isInitialState(element)) {
            return this.serializeInitialState(element);
        }
        if (isFork(element)) {
            return this.serializeFork(element);
        }
        if (isFinalState(element)) {
            return this.serializeFinalState(element);
        }
        if (isDeepHistory(element)) {
            return this.serializeDeepHistory(element);
        }
        if (isChoice(element)) {
            return this.serializeChoice(element);
        }
        if (isPackage(element)) {
            return this.serializePackage(element);
        }
        if (isExecutionEnvironment(element)) {
            return this.serializeExecutionEnvironment(element);
        }
        if (isDeploymentSpecification(element)) {
            return this.serializeDeploymentSpecification(element);
        }
        if (isArtifact(element)) {
            return this.serializeArtifact(element);
        }
        if (isDevice(element)) {
            return this.serializeDevice(element);
        }
        if (isDeploymentNode(element)) {
            return this.serializeDeploymentNode(element);
        }
        if (isDeploymentPackage(element)) {
            return this.serializeDeploymentPackage(element);
        }
        if (isDeploymentModel(element)) {
            return this.serializeDeploymentModel(element);
        }
        if (isLifeline(element)) {
            return this.serializeLifeline(element);
        }
        if (isInteraction(element)) {
            return this.serializeInteraction(element);
        }
        if (isInstanceSpecification(element)) {
            return this.serializeInstanceSpecification(element);
        }
        if (isSendSignalAction(element)) {
            return this.serializeSendSignalAction(element);
        }
        if (isOutputPin(element)) {
            return this.serializeOutputPin(element);
        }
        if (isOpaqueAction(element)) {
            return this.serializeOpaqueAction(element);
        }
        if (isInputPin(element)) {
            return this.serializeInputPin(element);
        }
        if (isMergeNode(element)) {
            return this.serializeMergeNode(element);
        }
        if (isJoinNode(element)) {
            return this.serializeJoinNode(element);
        }
        if (isInitialNode(element)) {
            return this.serializeInitialNode(element);
        }
        if (isForkNode(element)) {
            return this.serializeForkNode(element);
        }
        if (isFlowFinalNode(element)) {
            return this.serializeFlowFinalNode(element);
        }
        if (isDecisionNode(element)) {
            return this.serializeDecisionNode(element);
        }
        if (isCentralBufferNode(element)) {
            return this.serializeCentralBufferNode(element);
        }
        if (isActivityPartition(element)) {
            return this.serializeActivityPartition(element);
        }
        if (isActivityParameterNode(element)) {
            return this.serializeActivityParameterNode(element);
        }
        if (isActivityFinalNode(element)) {
            return this.serializeActivityFinalNode(element);
        }
        if (isActivity(element)) {
            return this.serializeActivity(element);
        }
        if (isAcceptEventAction(element)) {
            return this.serializeAcceptEventAction(element);
        }
    }

    serializeEdge(element: Edge): any {
        if (isRelation(element)) {
            return this.serializeRelation(element);
        }
        if (isTransition(element)) {
            return this.serializeTransition(element);
        }
        if (isInformationFlow(element)) {
            return this.serializeInformationFlow(element);
        }
        if (isMessage(element)) {
            return this.serializeMessage(element);
        }
        if (isControlFlow(element)) {
            return this.serializeControlFlow(element);
        }
    }

    serializeUnbounded(element: Unbounded): any {
        if (isProperty(element)) {
            return this.serializeProperty(element);
        }
        if (isParameter(element)) {
            return this.serializeParameter(element);
        }
        if (isEnumerationLiteral(element)) {
            return this.serializeEnumerationLiteral(element);
        }
        if (isSlot(element)) {
            return this.serializeSlot(element);
        }
        if (isLiteralSpecification(element)) {
            return this.serializeLiteralSpecification(element);
        }
    }

    serializeMetaInfo(element: MetaInfo): any {
        if (isSize(element)) {
            return this.serializeSize(element);
        }
        if (isPosition(element)) {
            return this.serializePosition(element);
        }
    }

    serializeUnionType_0(element: UnionType_0): any {
        if (isNode(element)) {
            return this.serializeNode(element);
        }
        if (isUnbounded(element)) {
            return this.serializeUnbounded(element);
        }
    }

    serializeUnionType_1(element: UnionType_1): any {
        if (isActor(element)) {
            return this.serializeActor(element);
        }
        if (isClass(element)) {
            return this.serializeClass(element);
        }
    }

    public asDiagram(root: Diagram): string {
        return '';
    }
}
