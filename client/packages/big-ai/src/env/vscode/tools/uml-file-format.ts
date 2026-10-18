/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { createUmlDiagramServices } from '@borkdominik-biguml/uml-model-server';
import { NodeFileSystem } from 'langium/node';
import { URI } from 'vscode-uri';
import type { DiagramType } from '../../common/index.js';

type UmlRecord = Record<string, unknown>;
type MutableUmlRecord = Record<string, unknown>;

interface PendingReference extends UmlRecord {
    __pendingRef: string;
}

const services = createUmlDiagramServices(NodeFileSystem);

const DIAGRAM_ROOT: Record<DiagramType, { __type: string; __id: string }> = {
    CLASS: { __type: 'ClassDiagram', __id: 'ClassDiagram1' },
    DEPLOYMENT: { __type: 'DeploymentDiagram', __id: 'DeploymentDiagram1' },
    ACTIVITY: { __type: 'ActivityDiagram', __id: 'ActivityDiagram1' }
};

export function emptyUmlDiagramFile(diagramType: DiagramType = 'CLASS'): UmlRecord {
    const root = DIAGRAM_ROOT[diagramType];
    return {
        diagram: {
            __type: root.__type,
            __id: root.__id,
            diagramType,
            entities: [],
            relations: []
        },
        metaInfos: []
    };
}

export function stringifyUmlDiagramFile(diagram: unknown): string {
    // Drop layout entries whose element reference is dangling (e.g. a stale "undefined" left by an earlier
    // edit). Without this, one corrupt metaInfo makes every later edit throw "Invalid UML reference".
    pruneDanglingMetaInfos(diagram);
    const ast = toSerializableAst(diagram);
    const serialized = `${services.UmlDiagram.serializer.Serializer.serialize(ast as never)}\n`;
    validateSerializedUml(serialized);
    return serialized;
}

function pruneDanglingMetaInfos(diagram: unknown): void {
    if (!isRecord(diagram) || !Array.isArray(diagram.metaInfos)) {
        return;
    }
    const ids = new Set<string>();
    collectIds(diagram, ids);
    diagram.metaInfos = diagram.metaInfos.filter(meta => {
        if (!isRecord(meta)) {
            return false;
        }
        const element = meta.element;
        if (isRecord(element) && element.__type === 'Reference') {
            return typeof element.__value === 'string' && ids.has(element.__value);
        }
        return true;
    });
}

function collectIds(value: unknown, ids: Set<string>): void {
    if (Array.isArray(value)) {
        for (const item of value) {
            collectIds(item, ids);
        }
        return;
    }
    if (!isRecord(value)) {
        return;
    }
    if (typeof value.__id === 'string') {
        ids.add(value.__id);
    }
    for (const child of Object.values(value)) {
        collectIds(child, ids);
    }
}

function toSerializableAst(value: unknown): unknown {
    const idMap = new Map<string, MutableUmlRecord>();
    const root = cloneAsAst(value, idMap);
    resolveReferences(root, idMap);
    return root;
}

function cloneAsAst(value: unknown, idMap: Map<string, MutableUmlRecord>): unknown {
    if (Array.isArray(value)) {
        return value.map(item => cloneAsAst(item, idMap));
    }

    if (!isRecord(value)) {
        return value;
    }

    if (value.__type === 'Reference') {
        const referenceValue = value.__value;
        if (typeof referenceValue !== 'string') {
            throw new Error('Invalid UML reference: missing __value.');
        }
        return { __pendingRef: referenceValue } satisfies PendingReference;
    }

    const result: MutableUmlRecord = {};
    const astType = typeof value.__type === 'string' ? value.__type : rootAstType(value);
    if (astType) {
        result['$type'] = astType;
    }

    if (typeof value.__id === 'string') {
        result['__id'] = value.__id;
        idMap.set(value.__id, result);
    }

    for (const [key, childValue] of Object.entries(value)) {
        if (key === '__type' || key === '__id') {
            continue;
        }
        if (childValue !== undefined && childValue !== null) {
            result[key] = cloneAsAst(childValue, idMap);
        }
    }

    return result;
}

function rootAstType(value: UmlRecord): string | undefined {
    return isRecord(value.diagram) && Array.isArray(value.metaInfos) ? 'Diagram' : undefined;
}

function resolveReferences(value: unknown, idMap: Map<string, MutableUmlRecord>): unknown {
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            value[i] = resolveReferences(value[i], idMap);
        }
        return value;
    }

    if (!isRecord(value)) {
        return value;
    }

    if (isPendingReference(value)) {
        const target = idMap.get(value.__pendingRef);
        if (!target) {
            throw new Error(`Invalid UML reference: target "${value.__pendingRef}" does not exist.`);
        }
        return {
            ref: target,
            $refText: typeof target.name === 'string' ? target.name : value.__pendingRef
        };
    }

    for (const [key, childValue] of Object.entries(value)) {
        value[key] = resolveReferences(childValue, idMap);
    }

    return value;
}

function validateSerializedUml(text: string): void {
    const uri = URI.parse('memory://big-ai/generated.uml');
    const document = services.shared.workspace.LangiumDocumentFactory.fromString(text, uri);
    const errors = document.parseResult.parserErrors;
    if (errors.length > 0) {
        const first = errors[0];
        const location = first.token?.startLine === undefined ? '' : ` at line ${first.token.startLine}, column ${first.token.startColumn}`;
        throw new Error(`Generated UML did not parse${location}: ${first.message}`);
    }
}

function isPendingReference(value: UmlRecord): value is PendingReference {
    return typeof value.__pendingRef === 'string';
}

function isRecord(value: unknown): value is UmlRecord {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
