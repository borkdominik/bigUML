/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import { Language } from '@borkdominik-biguml/uml-language-tooling';
import 'reflect-metadata';
import { Edge, Node, Unbounded, type Visibility } from './element.def.js';

// @ts-nocheck

@Glsp.defaults
export class DeploymentDiagram {
    diagramType: 'DEPLOYMENT';
    entities?: Array<DeploymentDiagramNodes>;
    relations?: Array<DeploymentDiagramEdges>;
}

type DeploymentDiagramElements = DeploymentDiagramNodes | DeploymentDiagramEdges;

type DeploymentDiagramNodes =
    | Artifact
    | DeploymentSpecification
    | Device
    | ExecutionEnvironment
    | DeploymentModel
    | DeploymentNode
    | DeploymentPackage
    | Property
    | Operation
    | Parameter;

type DeploymentDiagramEdges = CommunicationPath | Dependency | Manifestation | Deployment | Generalization;

/**
 * CONTAINERS
 */

@Glsp.toolPalette({
    section: 'Container',
    label: 'Artifact',
    icon: 'uml-artifact-icon'
})
@Glsp.defaults
export class Artifact extends Node {
    name: string;
    visibility?: Visibility;
    properties?: Array<Property>;
    operations?: Array<Operation>;
    nestedArtifacts?: Array<Artifact>;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'Deployment Specification',
    icon: 'uml-deployment-specification-icon'
})
@Glsp.defaults
export class DeploymentSpecification extends Node {
    name: string;
    visibility?: Visibility;
    properties?: Array<Property>;
    operations?: Array<Operation>;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'Device',
    icon: 'uml-device-icon'
})
@Glsp.defaults
export class Device extends Node {
    name: string;
    visibility?: Visibility;
    nodes?: Array<DeploymentNode>;
    executionEnvironments?: Array<ExecutionEnvironment>;
    deploymentSpecifications?: Array<DeploymentSpecification>;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'Execution Environment',
    icon: 'uml-execution-environment-icon'
})
@Glsp.defaults
export class ExecutionEnvironment extends Node {
    name: string;
    visibility?: Visibility;
    nestedEnvironments?: Array<ExecutionEnvironment>;
    artifacts?: Array<Artifact>;
    deploymentSpecifications?: Array<DeploymentSpecification>;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'Model',
    icon: 'uml-model-icon'
})
@Glsp.defaults
export class DeploymentModel extends Node {
    name: string;
    uri?: string;
    visibility?: Visibility;
    entities?: Array<DeploymentDiagramNodes>;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'Node',
    icon: 'uml-node-icon'
})
@Glsp.defaults
export class DeploymentNode extends Node {
    name: string;
    visibility?: Visibility;
    nestedNodes?: Array<DeploymentNode>;
    artifacts?: Array<Artifact>;
    devices?: Array<Device>;
    deploymentSpecifications?: Array<DeploymentSpecification>;
    executionEnvironments?: Array<ExecutionEnvironment>;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'Package',
    icon: 'uml-package-icon'
})
@Glsp.defaults
export class DeploymentPackage extends Node {
    name: string;
    uri?: string;
    visibility?: Visibility;
    entities?: Array<Node>;
}

/**
 * FEATURES
 */

@Glsp.toolPalette({
    section: 'Feature',
    label: 'Property',
    icon: 'uml-property-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class Property extends Unbounded {
    name: string;
    isDerived?: boolean = false;
    isOrdered?: boolean = false;
    isStatic?: boolean = false;
    isDerivedUnion?: boolean = false;
    isReadOnly?: boolean = false;
    isNavigable?: boolean = false;
    isUnique?: boolean = false;
    visibility?: Visibility = 'PUBLIC';
    multiplicity?: string;
    aggregation?: AggregationType;
}

@Glsp.toolPalette({
    section: 'Feature',
    label: 'Operation',
    icon: 'uml-operation-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class Operation extends Unbounded {
    name: string;
    isAbstract?: boolean;
    isStatic?: boolean;
    isQuery?: boolean;
    visibility?: Visibility;
    concurrency?: Concurrency;
    parameters?: Array<Parameter>;
}

@Glsp.noBounds
@Glsp.defaults
export class Parameter extends Unbounded {
    name: string;
    isException?: boolean;
    isStream?: boolean;
    isOrdered?: boolean;
    isUnique?: boolean;
    direction?: ParameterDirection;
    effect?: EffectType;
    visibility?: Visibility;
    multiplicity?: string;
}

/**
 * EDGES
 */

export class Relation extends Edge {
    @Language.reference source: Node;
    @Language.reference target: Node;
}

@Glsp.toolPalette({
    section: 'Relation',
    label: 'Communication Path',
    icon: 'uml-communication-path-icon'
})
@Glsp.defaults
export class CommunicationPath extends Relation {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relation',
    label: 'Dependency',
    icon: 'uml-dependency-icon'
})
@Glsp.defaults
export class Dependency extends Relation {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relation',
    label: 'Manifestation',
    icon: 'uml-manifestation-icon'
})
@Glsp.defaults
export class Manifestation extends Relation {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relation',
    label: 'Deployment',
    icon: 'uml-deployment-icon'
})
@Glsp.defaults
export class Deployment extends Relation {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Relation',
    label: 'Generalization',
    icon: 'uml-generalization-icon'
})
@Glsp.defaults
export class Generalization extends Relation {
    isSubstitutable?: boolean;
}

/**
 * TYPES
 */
type AggregationType = 'NONE' | 'SHARED' | 'COMPOSITE';
type ParameterDirection = 'IN' | 'OUT' | 'INOUT' | 'RETURN';
type EffectType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
type Concurrency = 'SEQUENTIAL' | 'GUARDED' | 'CONCURRENT';
