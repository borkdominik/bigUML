/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { v4 as uuidv4 } from 'uuid';
import { jsonPatch } from '../util/json-types.js';
import { findNodes } from '../util/json-util.js';

/** The serialised documents a patch works on, keyed by document path. */
export type JsonDocuments = Map<string, unknown>;

/** The target of a serialised reference as the JSON serializer writes it. */
interface JsonReferenceTarget {
    __id?: string;
    __path?: string;
    __documentUri?: string;
}

/** The property every object is tagged with while a patch is applied, so that references survive it. */
const TEMP_ID = '__tmp_uuid__';

/** The property a reference is tagged with while a patch is applied: the tag of the element it names. */
const TEMP_REF = '__tmp_ref__';

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
    return typeof value === 'object' && value !== null;
}

/**
 * Applies a JSON patch to the serialised documents, keeping every reference pointing at the element it
 * pointed at before.
 *
 * A reference is stored as an id or as a path. A path is where an element *was*, and a patch that
 * inserts or removes an element moves everything after it - so before the patch every object is tagged
 * with a temporary id and every reference is rewritten to name that tag; after the patch the tags are
 * resolved back into ids and paths, now correct, and taken off again.
 *
 * Pure: the documents are copied, and the patch operations are not modified.
 */
export function applyJsonPatch(documents: JsonDocuments, targetPath: string, operations: readonly jsonPatch.Operation[]): JsonDocuments {
    const working: JsonDocuments = new Map([...documents].map(([path, json]) => [path, clone(json)]));

    tagEveryObject(working);
    pointReferencesAtTags(working);

    let target = working.get(targetPath);
    for (const operation of operations) {
        const tagged = tagOperationValue(operation, target);
        target = jsonPatch.applyOperation(target, tagged).newDocument;
    }
    working.set(targetPath, target);

    pointReferencesAtElements(working);
    untagEveryObject(working);
    return working;
}

function clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

/**
 * A value being added is tagged like everything else; one replacing an element keeps that element's tag.
 * A list - an edge's `routingPoints` - is not an element and carries no tag, as in `tagEveryObject`:
 * spread into one, it would come out as an object keyed by index.
 */
function tagOperationValue(operation: jsonPatch.Operation, target: unknown): jsonPatch.Operation {
    if ((operation.op !== 'add' && operation.op !== 'replace') || !isObject(operation.value) || Array.isArray(operation.value)) {
        return operation;
    }
    const tag = operation.op === 'replace' ? tagAt(target, operation.path) : uuidv4();
    return { ...operation, value: { ...operation.value, [TEMP_ID]: tag } };
}

function tagEveryObject(documents: JsonDocuments): void {
    const visit = (value: unknown): void => {
        if (!isObject(value)) {
            return;
        }
        for (const [key, child] of Object.entries(value)) {
            if (key !== '$ref') {
                visit(child);
            }
        }
        if (!Array.isArray(value)) {
            value[TEMP_ID] = uuidv4();
        }
    };
    documents.forEach(visit);
}

function untagEveryObject(documents: JsonDocuments): void {
    const visit = (value: unknown): void => {
        if (!isObject(value)) {
            return;
        }
        if (Array.isArray(value)) {
            // An element removed by the patch leaves a hole behind, which is not an element.
            value.splice(0, value.length, ...value.filter(element => element !== null && element !== undefined));
        }
        for (const child of Object.values(value)) {
            visit(child);
        }
        delete value[TEMP_ID];
    };
    documents.forEach(visit);
}

/**
 * Tags every `$ref` with the tag of the element it resolves to. The id or path it names is kept
 * beside the tag: a reference whose target the patch removes has nothing to be rewritten to, and
 * is written back as it was rather than as nothing.
 */
function pointReferencesAtTags(documents: JsonDocuments): void {
    const visit = (value: unknown, ownDocument: unknown): void => {
        if (!isObject(value)) {
            return;
        }
        for (const [key, child] of Object.entries(value)) {
            if (key === '$ref' && isObject(child)) {
                const reference = child as JsonReferenceTarget;
                const document = reference.__documentUri ? documents.get(reference.__documentUri) : ownDocument;
                const tag = document !== undefined ? tagOfReferenced(document, reference) : undefined;
                if (tag) {
                    child[TEMP_REF] = tag;
                }
            } else {
                visit(child, ownDocument);
            }
        }
    };
    documents.forEach(document => visit(document, document));
}

function tagOfReferenced(document: unknown, reference: { __id?: string; __path?: string }): string | undefined {
    if (reference.__id) {
        const [found] = findNodes(document, '__id', reference.__id) ?? [];
        return isObject(found?.value) ? (found.value[TEMP_ID] as string | undefined) : undefined;
    }
    return reference.__path ? tagAt(document, reference.__path) : undefined;
}

/** Rewrites every `$ref` that names a tag back into the id or path of the element that carries it. */
function pointReferencesAtElements(documents: JsonDocuments): void {
    const taggedElements = new Map<string, { path: string; element: JsonObject; documentPath: string }>();
    for (const [documentPath, document] of documents) {
        for (const found of findNodes(document, TEMP_ID) ?? []) {
            const element = nodeAt(document, jsonPathToJsonPointer(found.path));
            if (isObject(element)) {
                taggedElements.set(element[TEMP_ID] as string, { path: jsonPathToJsonPointer(found.path), element, documentPath });
            }
        }
    }

    const visit = (value: unknown, documentPath: string): void => {
        if (!isObject(value)) {
            return;
        }
        for (const [key, child] of Object.entries(value)) {
            if (key === '$ref' && isObject(child)) {
                const tag = child[TEMP_REF] as string | undefined;
                delete child[TEMP_REF];
                const referenced = tag ? taggedElements.get(tag) : undefined;
                if (referenced) {
                    value[key] = {
                        __id: referenced.element.__id,
                        __path: referenced.element.__id ? undefined : referenced.path,
                        __documentUri: referenced.documentPath === documentPath ? undefined : referenced.documentPath
                    };
                }
            } else {
                visit(child, documentPath);
            }
        }
    };
    documents.forEach((document, documentPath) => visit(document, documentPath));
}

/** The tag of the object a JSON pointer names. */
function tagAt(document: unknown, pointer: string): string | undefined {
    const node = nodeAt(document, pointer);
    return isObject(node) ? (node[TEMP_ID] as string | undefined) : undefined;
}

function nodeAt(document: unknown, pointer: string): unknown {
    let current = document;
    for (const segment of pointer.split('/')) {
        if (segment && isObject(current)) {
            current = current[segment];
        }
    }
    return current;
}

/** `$.a[0].b` as the JSON serializer's `findNodes` writes a path, into the `/a/0/b` a JSON pointer is. */
function jsonPathToJsonPointer(path: string): string {
    return (
        '/' +
        path
            .slice(1)
            .replace(/[.[\]]/g, '/')
            .replace(/\/\//g, '/')
            .replace(/\/$/, '')
    );
}
