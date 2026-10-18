/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
    createRandomUUID,
    findAvailableNodeName,
    type SerializeAstNode,
    type SerializedRecordNode
} from '@borkdominik-biguml/uml-model-server';
import {
    type Association,
    type Class,
    type DataType,
    type InstanceSpecification,
    type Interface,
    type LiteralSpecification,
    type Property,
    type Slot,
    isAssociation,
    isClass,
    isDataType,
    isGeneralization,
    isInstanceLink,
    isInstanceSpecification,
    isInterface,
    isInterfaceRealization,
    isProperty,
    isSlot
} from '@borkdominik-biguml/uml-model-server/grammar';
import { DiagramModelState, ModelPatchCommand, getDefaultProperties } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { ClassDiagramEdgeTypes, ClassDiagramNodeTypes } from '@borkdominik-biguml/uml-glsp-server';
import { type ActionHandler, type Command, type MaybePromise, OperationHandler } from '@eclipse-glsp/server';
import { AstUtils } from 'langium';
import { inject, injectable } from 'inversify';
import {
    CreateClassifierInstanceOperation,
    CreateInstanceLinkOperation,
    InstanceExplorerDataResponse,
    RequestInstanceExplorerDataAction,
    UpdateInstanceLinkEndOperation,
    UpdateInstanceSlotValuesOperation,
    type AvailableAssociation,
    type AvailableClassifier,
    type AvailableForInstantiation,
    type AvailableInstanceLink,
    type ClassifierGroup,
    type ClassifierType,
    type DiagnosticSummary,
    type EligibleInstance,
    type InstanceLinkSummary,
    type InstanceSummary,
    type ManyToManyLink,
    type ManyToManyRelationSection,
    type SlotSummary
} from '../common/index.js';

type SupportedClassifier = Class | Interface | DataType;

interface ClassifierInfo {
    classifier: SupportedClassifier;
    classifierType: ClassifierType;
}

interface InstanceMeta {
    node: InstanceSpecification;
    classifier?: SupportedClassifier;
    hierarchy: Set<string>;
}

interface LinkCounts {
    /** assocId -> instanceId -> # of links where the instance is on the source end */
    sources: Map<string, Map<string, number>>;
    /** assocId -> instanceId -> # of links where the instance is on the target end */
    targets: Map<string, Map<string, number>>;
    /** assocId -> set of "sourceInstanceId|targetInstanceId" pairs already linked */
    pairs: Map<string, Set<string>>;
}

const INSTANCE_HEADER_HEIGHT = 34;
const INSTANCE_SLOT_ROW_HEIGHT = 22;
const INSTANCE_MIN_WIDTH = 170;
const INSTANCE_MIN_HEIGHT = 60;
const INSTANCE_NAME_CHAR_WIDTH = 10;
const INSTANCE_NAME_PADDING = 48;
const INSTANCE_PLACEMENT_GAP = 48;
const INSTANCE_FALLBACK_CLASSIFIER_WIDTH = 120;

@injectable()
export class RequestInstanceExplorerDataActionHandler implements ActionHandler {
    actionKinds = [RequestInstanceExplorerDataAction.KIND];

    @inject(DiagramModelState)
    protected readonly modelState: DiagramModelState;

    execute(_action: RequestInstanceExplorerDataAction): MaybePromise<any[]> {
        const classifiersById = this.collectClassifiers();
        const instances = this.collectInstances(classifiersById);
        const { linksByInstance, manyToManyRelations, usedAssociationIds, linkCounts } = this.routeInstanceLinks(instances);
        const classifierGroups = new Map<string, ClassifierGroup>();
        const unclassified: InstanceSummary[] = [];

        for (const node of AstUtils.streamAst(this.modelState.semanticRoot)) {
            if (!isInstanceSpecification(node)) {
                continue;
            }

            const summary = this.summarizeInstance(node, classifiersById);
            summary.links = (linksByInstance.get(node.__id) ?? []).sort(compareLinks);
            summary.availableLinks = this.computeAvailableLinksForInstance(node, instances, linkCounts);
            if (summary.classifierId) {
                const info = classifiersById.get(summary.classifierId)!;
                let group = classifierGroups.get(summary.classifierId);
                if (!group) {
                    group = {
                        classifierId: info.classifier.__id,
                        classifierName: info.classifier.name,
                        classifierType: info.classifierType,
                        isInstantiable: isInstantiableClassifier(info.classifier),
                        instances: []
                    };
                    classifierGroups.set(summary.classifierId, group);
                }
                group.instances.push(summary);
            } else {
                unclassified.push(summary);
            }
        }

        const groups = Array.from(classifierGroups.values())
            .map(group => ({
                ...group,
                instances: group.instances.sort(compareInstances)
            }))
            .sort((left, right) => left.classifierName.localeCompare(right.classifierName));

        const availableForInstantiation = this.computeAvailableForInstantiation(
            classifiersById,
            classifierGroups,
            instances,
            usedAssociationIds
        );

        return [
            InstanceExplorerDataResponse.create({
                classifierGroups: groups,
                unclassified: unclassified.sort(compareInstances),
                manyToManyRelations: manyToManyRelations.sort((l, r) => l.name.localeCompare(r.name)),
                availableForInstantiation
            })
        ];
    }

    protected computeAvailableLinksForInstance(
        instance: InstanceSpecification,
        instances: InstanceMeta[],
        linkCounts: LinkCounts
    ): AvailableInstanceLink[] {
        const myMeta = instances.find(m => m.node.__id === instance.__id);
        if (!myMeta) {
            return [];
        }

        const result: AvailableInstanceLink[] = [];
        const seen = new Set<string>(); // dedupe entries per `${assocId}|${end}`

        for (const node of AstUtils.streamAst(this.modelState.semanticRoot)) {
            if (!isAssociation(node)) continue;

            const sourceMany = isManyMultiplicity(node.sourceMultiplicity);
            const targetMany = isManyMultiplicity(node.targetMultiplicity);
            if (sourceMany && targetMany) {
                continue; // many-to-many associations handled in the dedicated section
            }

            const sourceTypeId = isSupportedClassifier(node.source?.ref) ? node.source.ref.__id : undefined;
            const targetTypeId = isSupportedClassifier(node.target?.ref) ? node.target.ref.__id : undefined;
            if (!sourceTypeId || !targetTypeId) continue;

            // Instance can be on the source side
            if (myMeta.hierarchy.has(sourceTypeId)) {
                const entry = this.buildAvailableLinkEntry(node, 'source', myMeta, instances, linkCounts, sourceTypeId, targetTypeId);
                if (entry) {
                    const key = `${entry.associationId}|${entry.end}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        result.push(entry);
                    }
                }
            }
            // ... and/or on the target side (e.g., self-associations or overlapping hierarchies)
            if (myMeta.hierarchy.has(targetTypeId)) {
                const entry = this.buildAvailableLinkEntry(node, 'target', myMeta, instances, linkCounts, sourceTypeId, targetTypeId);
                if (entry) {
                    const key = `${entry.associationId}|${entry.end}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        result.push(entry);
                    }
                }
            }
        }

        result.sort((l, r) => l.associationName.localeCompare(r.associationName));
        return result;
    }

    protected buildAvailableLinkEntry(
        association: Association,
        end: 'source' | 'target',
        instance: InstanceMeta,
        allInstances: InstanceMeta[],
        linkCounts: LinkCounts,
        sourceTypeId: string,
        targetTypeId: string
    ): AvailableInstanceLink | undefined {
        // My side's cap on peers is the OTHER end's multiplicity upper bound.
        const myPeerCap =
            end === 'source' ? multiplicityMax(association.targetMultiplicity) : multiplicityMax(association.sourceMultiplicity);
        // Each peer's cap is THIS end's multiplicity upper bound.
        const peerCap =
            end === 'source' ? multiplicityMax(association.sourceMultiplicity) : multiplicityMax(association.targetMultiplicity);
        const peerTypeId = end === 'source' ? targetTypeId : sourceTypeId;

        const myEndBucket = end === 'source' ? linkCounts.sources : linkCounts.targets;
        const peerEndBucket = end === 'source' ? linkCounts.targets : linkCounts.sources;

        const myCount = myEndBucket.get(association.__id)?.get(instance.node.__id) ?? 0;
        if (myPeerCap !== undefined && myCount >= myPeerCap) {
            return undefined; // already at the limit on this end
        }

        const existingPairs = linkCounts.pairs.get(association.__id);

        const eligiblePeers: EligibleInstance[] = [];
        for (const peer of allInstances) {
            if (peer.node.__id === instance.node.__id) continue; // skip self-link
            if (!peer.hierarchy.has(peerTypeId)) continue;

            const peerCount = peerEndBucket.get(association.__id)?.get(peer.node.__id) ?? 0;
            if (peerCap !== undefined && peerCount >= peerCap) continue;

            const pairKey = end === 'source' ? `${instance.node.__id}|${peer.node.__id}` : `${peer.node.__id}|${instance.node.__id}`;
            if (existingPairs?.has(pairKey)) continue; // already linked to this peer via this association

            eligiblePeers.push({
                id: peer.node.__id,
                name: peer.node.name,
                classifierName: peer.classifier?.name
            });
        }

        if (eligiblePeers.length === 0) {
            return undefined;
        }

        eligiblePeers.sort((l, r) => l.name.localeCompare(r.name));

        return {
            associationId: association.__id,
            associationName: association.name || association.__id,
            end,
            direction: end === 'source' ? 'outgoing' : 'incoming',
            eligiblePeers
        };
    }

    protected computeAvailableForInstantiation(
        classifiersById: Map<string, ClassifierInfo>,
        usedClassifierGroups: Map<string, ClassifierGroup>,
        instances: InstanceMeta[],
        usedAssociationIds: Set<string>
    ): AvailableForInstantiation {
        const availableClassifiers: AvailableClassifier[] = [];
        for (const info of classifiersById.values()) {
            if (usedClassifierGroups.has(info.classifier.__id)) {
                continue;
            }
            if (!isInstantiableClassifier(info.classifier)) {
                continue;
            }
            availableClassifiers.push({
                classifierId: info.classifier.__id,
                classifierName: info.classifier.name,
                classifierType: info.classifierType
            });
        }
        availableClassifiers.sort((l, r) => l.classifierName.localeCompare(r.classifierName));

        const availableAssociations: AvailableAssociation[] = [];
        for (const node of AstUtils.streamAst(this.modelState.semanticRoot)) {
            if (!isAssociation(node)) continue;
            if (usedAssociationIds.has(node.__id)) continue;

            const { eligibleSources, eligibleTargets } = computeAssociationEligibility(node, instances);
            availableAssociations.push({
                associationId: node.__id,
                associationName: node.name || node.__id,
                relationType: node.$type,
                eligibleSources,
                eligibleTargets
            });
        }
        availableAssociations.sort((l, r) => l.associationName.localeCompare(r.associationName));

        return {
            classifiers: availableClassifiers,
            associations: availableAssociations
        };
    }

    protected routeInstanceLinks(instances: InstanceMeta[]): {
        linksByInstance: Map<string, InstanceLinkSummary[]>;
        manyToManyRelations: ManyToManyRelationSection[];
        usedAssociationIds: Set<string>;
        linkCounts: LinkCounts;
    } {
        const linksByInstance = new Map<string, InstanceLinkSummary[]>();
        const m2mByAssociation = new Map<string, ManyToManyRelationSection>();
        const usedAssociationIds = new Set<string>();
        const eligibilityCache = new Map<string, { eligibleSources: EligibleInstance[]; eligibleTargets: EligibleInstance[] }>();
        const linkCounts: LinkCounts = { sources: new Map(), targets: new Map(), pairs: new Map() };

        const incrementCount = (bucket: Map<string, Map<string, number>>, assocId: string, instanceId: string) => {
            let inner = bucket.get(assocId);
            if (!inner) {
                inner = new Map();
                bucket.set(assocId, inner);
            }
            inner.set(instanceId, (inner.get(instanceId) ?? 0) + 1);
        };
        const recordPair = (assocId: string, sourceId: string, targetId: string) => {
            let set = linkCounts.pairs.get(assocId);
            if (!set) {
                set = new Set();
                linkCounts.pairs.set(assocId, set);
            }
            set.add(`${sourceId}|${targetId}`);
        };

        const getEligibility = (association: Association) => {
            let cached = eligibilityCache.get(association.__id);
            if (!cached) {
                cached = computeAssociationEligibility(association, instances);
                eligibilityCache.set(association.__id, cached);
            }
            return cached;
        };

        for (const node of AstUtils.streamAst(this.modelState.semanticRoot)) {
            if (!isInstanceLink(node)) continue;

            const association = node.association?.ref;
            const sourceInst = node.source?.ref;
            const targetInst = node.target?.ref;
            if (!isAssociation(association) || !isInstanceSpecification(sourceInst) || !isInstanceSpecification(targetInst)) {
                continue;
            }

            usedAssociationIds.add(association.__id);
            incrementCount(linkCounts.sources, association.__id, sourceInst.__id);
            incrementCount(linkCounts.targets, association.__id, targetInst.__id);
            recordPair(association.__id, sourceInst.__id, targetInst.__id);
            const sourceMany = isManyMultiplicity(association.sourceMultiplicity);
            const targetMany = isManyMultiplicity(association.targetMultiplicity);
            const relationName = node.name || association.name || association.__id;
            const { eligibleSources, eligibleTargets } = getEligibility(association);

            if (sourceMany && targetMany) {
                const section = m2mByAssociation.get(association.__id) ?? {
                    id: association.__id,
                    name: association.name || relationName,
                    relationType: association.$type,
                    links: [] as ManyToManyLink[],
                    eligibleSources,
                    eligibleTargets
                };
                section.links.push({
                    id: node.__id,
                    sourceInstanceId: sourceInst.__id,
                    sourceInstanceName: sourceInst.name,
                    sourceClassifierName: classifierNameOf(sourceInst),
                    targetInstanceId: targetInst.__id,
                    targetInstanceName: targetInst.name,
                    targetClassifierName: classifierNameOf(targetInst),
                    eligibleSources,
                    eligibleTargets
                });
                m2mByAssociation.set(association.__id, section);
                continue;
            }

            // 1-1 and 1-N: show on BOTH ends so users see the link from either instance's perspective
            // (m2m has its own dedicated section and is handled above).
            addLink(linksByInstance, sourceInst.__id, {
                id: node.__id,
                relationName,
                direction: 'outgoing',
                peerInstanceId: targetInst.__id,
                peerInstanceName: targetInst.name,
                peerClassifierName: classifierNameOf(targetInst),
                peerEnd: 'target',
                eligiblePeers: eligibleTargets
            });
            addLink(linksByInstance, targetInst.__id, {
                id: node.__id,
                relationName,
                direction: 'incoming',
                peerInstanceId: sourceInst.__id,
                peerInstanceName: sourceInst.name,
                peerClassifierName: classifierNameOf(sourceInst),
                peerEnd: 'source',
                eligiblePeers: eligibleSources
            });
        }

        for (const section of m2mByAssociation.values()) {
            section.links.sort((l, r) => {
                const sourceCmp = l.sourceInstanceName.localeCompare(r.sourceInstanceName);
                return sourceCmp !== 0 ? sourceCmp : l.targetInstanceName.localeCompare(r.targetInstanceName);
            });
        }

        return {
            linksByInstance,
            manyToManyRelations: Array.from(m2mByAssociation.values()),
            usedAssociationIds,
            linkCounts
        };
    }

    protected collectInstances(classifiersById: Map<string, ClassifierInfo>): InstanceMeta[] {
        const result: InstanceMeta[] = [];
        for (const node of AstUtils.streamAst(this.modelState.semanticRoot)) {
            if (!isInstanceSpecification(node)) continue;

            const classifierRef = node.classifier?.ref;
            const info = classifierRef && isSupportedClassifier(classifierRef) ? classifiersById.get(classifierRef.__id) : undefined;
            const hierarchy = info
                ? new Set(collectClassifierHierarchy(info.classifier, this.modelState).map(c => c.__id))
                : new Set<string>();
            result.push({ node, classifier: info?.classifier, hierarchy });
        }
        return result;
    }

    protected collectClassifiers(): Map<string, ClassifierInfo> {
        const byId = new Map<string, ClassifierInfo>();
        for (const node of AstUtils.streamAst(this.modelState.semanticRoot)) {
            if (!isSupportedClassifier(node)) {
                continue;
            }
            byId.set(node.__id, { classifier: node, classifierType: classifierTypeOf(node) });
        }
        return byId;
    }

    protected summarizeInstance(instance: InstanceSpecification, classifiersById: Map<string, ClassifierInfo>): InstanceSummary {
        const diagnostics: DiagnosticSummary[] = [];
        const slotSummaries = instance.slots.map(slot => this.summarizeSlot(slot));

        const directClassifier = instance.classifier?.ref;
        const resolvedClassifier =
            directClassifier && isSupportedClassifier(directClassifier) ? classifiersById.get(directClassifier.__id) : undefined;

        if (!resolvedClassifier) {
            diagnostics.push({
                severity: 'warning',
                message: 'Instance has no classifier set.'
            });
        } else {
            const hierarchyIds = new Set(collectClassifierHierarchy(resolvedClassifier.classifier, this.modelState).map(c => c.__id));

            const matchedPropertyIds = new Set<string>();
            for (const slotSummary of slotSummaries) {
                const slot = this.modelState.index.findSemanticElement(slotSummary.id, isSlot);
                const feature = slot?.definingFeature?.ref;
                if (!isProperty(feature)) continue;
                matchedPropertyIds.add(feature.__id);

                const owner = owningClassifier(feature);
                if (owner && !hierarchyIds.has(owner.__id)) {
                    slotSummary.diagnostics.push({
                        severity: 'warning',
                        message: `Slot belongs to ${owner.name}, which is not in the inheritance hierarchy of ${resolvedClassifier.classifier.name}.`
                    });
                }
            }

            const missingProperties = resolvedClassifier.classifier.properties.filter(property => !matchedPropertyIds.has(property.__id));
            if (missingProperties.length > 0) {
                diagnostics.push({
                    severity: 'warning',
                    message: `Missing slots for classifier properties: ${missingProperties.map(property => property.name).join(', ')}.`
                });
            }
        }

        return {
            id: instance.__id,
            name: instance.name,
            classifierId: resolvedClassifier?.classifier.__id,
            classifierName: resolvedClassifier?.classifier.name,
            slots: slotSummaries.sort((left, right) => left.featureName.localeCompare(right.featureName)),
            links: [],
            availableLinks: [],
            diagnostics
        };
    }

    protected summarizeSlot(slot: Slot): SlotSummary {
        const diagnostics: DiagnosticSummary[] = [];
        const feature = slot.definingFeature?.ref;
        const values = slot.values.map(value => value.value ?? value.name ?? '');
        let featureName = slot.name || '(unnamed slot)';

        if (!feature) {
            diagnostics.push({
                severity: 'warning',
                message: 'Slot has no defining feature.'
            });
        } else if (isProperty(feature)) {
            featureName = feature.name || featureName;
            if (!owningClassifier(feature)) {
                diagnostics.push({
                    severity: 'warning',
                    message: 'Slot defining feature is not owned by a supported classifier.'
                });
            }

            const multiplicityDiagnostic = multiplicityDiagnosticFor(feature, values.length);
            if (multiplicityDiagnostic) {
                diagnostics.push(multiplicityDiagnostic);
            }
        } else if (isClass(feature) || isInterface(feature)) {
            featureName = feature.name || featureName;
            diagnostics.push({
                severity: 'warning',
                message: 'Slot defining feature points to a classifier directly instead of a property.'
            });
        } else {
            diagnostics.push({
                severity: 'warning',
                message: 'Slot defining feature could not be resolved.'
            });
        }

        return {
            id: slot.__id,
            featureName,
            values,
            diagnostics
        };
    }
}

@injectable()
export class CreateClassifierInstanceOperationHandler extends OperationHandler {
    override operationType = CreateClassifierInstanceOperation.KIND;

    declare readonly modelState: DiagramModelState;

    override createCommand(operation: CreateClassifierInstanceOperation): Command | undefined {
        const classifier = this.modelState.index.findIdElement(operation.classifierId);
        if (!isInstantiableClassifier(classifier)) {
            return undefined;
        }

        const instanceId = createRandomUUID('InstanceSpecification');
        const baseName = findAvailableNodeName(this.modelState.semanticRoot, `New${classifier.name}`);
        const instanceName = baseName;
        const containerPath = '/diagram/entities/-';

        const allProperties = collectClassifierHierarchy(classifier, this.modelState).flatMap(c =>
            Array.isArray(c.properties) ? c.properties : []
        );

        const instanceValue: SerializedRecordNode = {
            $type: 'InstanceSpecification',
            __id: instanceId,
            name: instanceName,
            classifier: {
                ref: { __id: classifier.__id, __documentUri: classifier.$document?.uri },
                $refText: classifier.name
            },
            slots: allProperties.map(property => createSlotValue(property))
        };

        for (const { property, defaultValue } of getDefaultProperties(ClassDiagramNodeTypes.INSTANCE_SPECIFICATION)) {
            if (property !== 'name' && property !== 'slots' && instanceValue[property] === undefined) {
                instanceValue[property] = defaultValue;
            }
        }

        const classifierPosition = this.modelState.index.findPosition(classifier.__id);
        const classifierSize = this.modelState.index.findSize(classifier.__id);
        const width = Math.max(INSTANCE_MIN_WIDTH, classifier.name.length * INSTANCE_NAME_CHAR_WIDTH + INSTANCE_NAME_PADDING);
        const height = Math.max(INSTANCE_MIN_HEIGHT, INSTANCE_HEADER_HEIGHT + allProperties.length * INSTANCE_SLOT_ROW_HEIGHT);
        const x = (classifierPosition?.x ?? 0) + (classifierSize?.width ?? INSTANCE_FALLBACK_CLASSIFIER_WIDTH) + INSTANCE_PLACEMENT_GAP;
        const y = classifierPosition?.y ?? 0;

        instanceValue.bounds = { $type: 'Bounds', x, y, width, height };

        const patch = [
            {
                op: 'add' as const,
                path: containerPath,
                value: instanceValue as SerializeAstNode<InstanceSpecification>
            }
        ];

        return new ModelPatchCommand(this.modelState, JSON.stringify(patch));
    }
}

@injectable()
export class UpdateInstanceSlotValuesOperationHandler extends OperationHandler {
    override operationType = UpdateInstanceSlotValuesOperation.KIND;

    declare readonly modelState: DiagramModelState;

    override createCommand(operation: UpdateInstanceSlotValuesOperation): Command | undefined {
        const slot = this.modelState.index.findSemanticElement(operation.slotId, isSlot);
        const slotPath = this.modelState.index.findPath(operation.slotId);
        if (!slot || !slotPath) {
            return undefined;
        }

        const serializedValues = operation.values.map((value, index) => ({
            $type: 'LiteralSpecification',
            __id: slot.values[index]?.__id ?? createRandomUUID('LiteralSpecification'),
            name: slot.values[index]?.name ?? `value${index + 1}`,
            value
        }));

        return new ModelPatchCommand(
            this.modelState,
            JSON.stringify([
                {
                    op: 'add',
                    path: `${slotPath}/values`,
                    value: serializedValues as SerializeAstNode<LiteralSpecification>[]
                }
            ])
        );
    }
}

@injectable()
export class UpdateInstanceLinkEndOperationHandler extends OperationHandler {
    override operationType = UpdateInstanceLinkEndOperation.KIND;

    declare readonly modelState: DiagramModelState;

    override createCommand(operation: UpdateInstanceLinkEndOperation): Command | undefined {
        const link = this.modelState.index.findSemanticElement(operation.linkId, isInstanceLink);
        const linkPath = this.modelState.index.findPath(operation.linkId);
        const newInstance = this.modelState.index.findSemanticElement(operation.newInstanceId, isInstanceSpecification);
        if (!link || !linkPath || !newInstance) {
            return undefined;
        }

        return new ModelPatchCommand(
            this.modelState,
            JSON.stringify([
                {
                    op: 'replace',
                    path: `${linkPath}/${operation.end}`,
                    value: {
                        ref: {
                            __id: newInstance.__id,
                            __documentUri: newInstance.$document?.uri
                        },
                        $refText: newInstance.name
                    }
                }
            ])
        );
    }
}

@injectable()
export class CreateInstanceLinkOperationHandler extends OperationHandler {
    override operationType = CreateInstanceLinkOperation.KIND;

    declare readonly modelState: DiagramModelState;

    override createCommand(operation: CreateInstanceLinkOperation): Command | undefined {
        const association = this.modelState.index.findIdElement(operation.associationId);
        const source = this.modelState.index.findSemanticElement(operation.sourceInstanceId, isInstanceSpecification);
        const target = this.modelState.index.findSemanticElement(operation.targetInstanceId, isInstanceSpecification);
        if (!isAssociation(association) || !source || !target) {
            return undefined;
        }

        const id = createRandomUUID('InstanceLink');
        const linkValue: SerializedRecordNode = {
            $type: 'InstanceLink',
            __id: id,
            name: association.name || `${source.name}-${target.name}-link`,
            association: {
                ref: { __id: association.__id, __documentUri: association.$document?.uri },
                $refText: association.name ?? association.__id
            },
            source: {
                ref: { __id: source.__id, __documentUri: source.$document?.uri },
                $refText: source.name
            },
            target: {
                ref: { __id: target.__id, __documentUri: target.$document?.uri },
                $refText: target.name
            }
        };

        for (const { property, defaultValue } of getDefaultProperties(ClassDiagramEdgeTypes.INSTANCE_LINK)) {
            if (linkValue[property] === undefined) {
                linkValue[property] = defaultValue;
            }
        }

        return new ModelPatchCommand(
            this.modelState,
            JSON.stringify([
                {
                    op: 'add',
                    path: '/diagram/relations/-',
                    value: linkValue
                }
            ])
        );
    }
}

function classifierTypeOf(classifier: SupportedClassifier): ClassifierType {
    if (isInterface(classifier)) {
        return 'Interface';
    }
    if (isDataType(classifier)) {
        return 'DataType';
    }
    return 'Class';
}

function isSupportedClassifier(value: unknown): value is SupportedClassifier {
    return isClass(value) || isInterface(value) || isDataType(value);
}

function isInstantiableClassifier(value: unknown): value is SupportedClassifier {
    // Abstract classes and interfaces cannot have instances.
    if (!isSupportedClassifier(value)) return false;
    if (isInterface(value)) return false;
    if (isClass(value) && (value as Class).isAbstract === true) return false;
    return true;
}

function owningClassifier(property: Property): SupportedClassifier | undefined {
    return isSupportedClassifier(property.$container) ? property.$container : undefined;
}

function collectClassifierHierarchy(start: SupportedClassifier, modelState: DiagramModelState): SupportedClassifier[] {
    const relations = modelState.semanticRoot.diagram.relations ?? [];
    const visited = new Set<SupportedClassifier>();
    const queue: SupportedClassifier[] = [start];
    const result: SupportedClassifier[] = [];

    while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current)) continue;
        visited.add(current);
        result.push(current);

        for (const rel of relations) {
            if (!isGeneralization(rel) && !isInterfaceRealization(rel)) continue;
            if (rel.source?.ref !== current) continue;
            const parent = rel.target?.ref;
            if (parent && isSupportedClassifier(parent)) {
                queue.push(parent);
            }
        }
    }

    return result;
}

function multiplicityDiagnosticFor(property: Property, valueCount: number): DiagnosticSummary | undefined {
    const multiplicity = property.multiplicity?.trim();
    if (!multiplicity) {
        return undefined;
    }

    const range = parseMultiplicity(multiplicity);
    if (!range) {
        return undefined;
    }

    if (valueCount < range.min) {
        return {
            severity: 'warning',
            message: `Expected at least ${range.min} value(s) for ${property.name}, but found ${valueCount}.`
        };
    }

    if (range.max !== undefined && valueCount > range.max) {
        return {
            severity: 'warning',
            message: `Expected at most ${range.max} value(s) for ${property.name}, but found ${valueCount}.`
        };
    }

    return undefined;
}

function multiplicityMax(multiplicity: string | undefined): number | undefined {
    if (!multiplicity) return 1;
    const trimmed = multiplicity.trim().toLowerCase();
    if (trimmed === '' || trimmed === 'one' || trimmed === '1' || trimmed === '0..1' || trimmed === '1..1') {
        return 1;
    }
    if (trimmed === '*' || trimmed === 'many' || trimmed === 'n') {
        return undefined; // unlimited
    }
    if (/^\d+$/.test(trimmed)) {
        return Number(trimmed);
    }
    const match = trimmed.match(/^(\d+)\.\.(\d+|\*|n)$/);
    if (match) {
        const upper = match[2];
        if (upper === '*' || upper === 'n') return undefined;
        return Number(upper);
    }
    return 1;
}

function parseMultiplicity(multiplicity: string): { min: number; max?: number } | undefined {
    if (multiplicity === '*') {
        return { min: 0 };
    }

    if (/^\d+$/.test(multiplicity)) {
        const amount = Number(multiplicity);
        return { min: amount, max: amount };
    }

    const match = multiplicity.match(/^(\d+)\.\.(\d+|\*)$/);
    if (!match) {
        return undefined;
    }

    return {
        min: Number(match[1]),
        max: match[2] === '*' ? undefined : Number(match[2])
    };
}

function compareInstances(left: InstanceSummary, right: InstanceSummary): number {
    return left.name.localeCompare(right.name);
}

function compareLinks(left: InstanceLinkSummary, right: InstanceLinkSummary): number {
    const byName = left.relationName.localeCompare(right.relationName);
    return byName !== 0 ? byName : left.peerInstanceName.localeCompare(right.peerInstanceName);
}

function addLink(map: Map<string, InstanceLinkSummary[]>, instanceId: string, link: InstanceLinkSummary): void {
    const existing = map.get(instanceId);
    if (existing) {
        existing.push(link);
    } else {
        map.set(instanceId, [link]);
    }
}

function classifierNameOf(instance: InstanceSpecification): string | undefined {
    const ref = instance.classifier?.ref;
    return ref && isSupportedClassifier(ref) ? ref.name : undefined;
}

function computeEligibleInstances(instances: InstanceMeta[], classifierId: string | undefined): EligibleInstance[] {
    if (!classifierId) {
        return [];
    }
    return instances
        .filter(meta => meta.hierarchy.has(classifierId))
        .map(meta => ({
            id: meta.node.__id,
            name: meta.node.name,
            classifierName: meta.classifier?.name
        }))
        .sort((l, r) => l.name.localeCompare(r.name));
}

function computeAssociationEligibility(
    association: Association,
    instances: InstanceMeta[]
): { eligibleSources: EligibleInstance[]; eligibleTargets: EligibleInstance[] } {
    const sourceTypeId = isSupportedClassifier(association.source?.ref) ? association.source.ref.__id : undefined;
    const targetTypeId = isSupportedClassifier(association.target?.ref) ? association.target.ref.__id : undefined;
    return {
        eligibleSources: computeEligibleInstances(instances, sourceTypeId),
        eligibleTargets: computeEligibleInstances(instances, targetTypeId)
    };
}

function isManyMultiplicity(value: string | undefined): boolean {
    if (!value) return false;
    const trimmed = value.trim().toLowerCase();
    if (trimmed === '' || trimmed === 'one' || trimmed === '1' || trimmed === '0..1' || trimmed === '1..1') {
        return false;
    }
    if (trimmed === '*' || trimmed === 'many' || trimmed === 'n') return true;
    if (/^\d+$/.test(trimmed)) {
        return Number(trimmed) > 1;
    }
    const match = trimmed.match(/^(\d+)\.\.(\d+|\*|n)$/);
    if (match) {
        const max = match[2];
        if (max === '*' || max === 'n') return true;
        return Number(max) > 1;
    }
    return false;
}

function createSlotValue(property: Property): SerializedRecordNode {
    return {
        $type: 'Slot',
        __id: createRandomUUID('Slot'),
        name: property.name,
        definingFeature: {
            ref: {
                __id: property.__id,
                __documentUri: property.$document?.uri
            },
            $refText: property.name
        },
        values: []
    };
}
