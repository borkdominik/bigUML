import {
  AstNode,
  AstNodeLocator,
  GenericAstNode,
  LangiumDocuments,
  Mutable,
  NameProvider,
  Reference,
  isAstNode,
  streamAst,
} from "langium";
import { v4 as uuidv4 } from "uuid";
import { URI } from "vscode-uri";
import { findNodes } from "./util/json-util.js";

interface Ref<T> {
  /** the type of the referenced element */
  type: T;
  /** the document uri of the referenced element */
  __documentUri?: string;
  /** the path to the referenced element in the given document uri */
  __path?: string;
  /** the id of the referenced element */
  __id?: string;
}

interface IntermediateReference {
  $refText?: string;
  $ref?: Ref<AstNode>;
  $error?: string;
}

function isIntermediateReference(obj: unknown): obj is IntermediateReference {
  return typeof obj === "object" && !!obj && ("$ref" in obj || "$error" in obj);
}

export function getNode(json: any, path: any) {
  for (let pathComponent of path.split("/")) {
    if (pathComponent) {
      json = json[pathComponent];
    }
  }
  return json;
}
export function rebuildReferences<T extends AstNode>(map: Map<string, any>) {
  let nodes: Record<string, any> = {};
  map.forEach((val, key) => {
    const tmpNodes = (nodes[key] = findNodes(val, "__tmp_uuid__") ?? []);
    nodes[key] = tmpNodes.map((node) => ({
      path: node.path,
      value: getNode(val, jsonPathToJsonPatchPath(node.path)),
    }));
  });

  function visit(obj: any, docUri: any) {
    if (obj && typeof obj === "object") {
      for (let key in obj) {
        if (key === "$ref" && typeof obj[key] !== "object") {
          let node;
          let nodeKey;
          for (let _key in nodes) {
            node = nodes[_key].find((node: any) => node.value.__tmp_uuid__ === obj[key]);
            if (node) {
              nodeKey = _key;
              break;
            }
          }
          if (node) {
            obj[key] = {
              __id: node.value.__id,
              __path: node.value.__id ? undefined : jsonPathToJsonPatchPath(node.path),
              __documentUri: nodeKey === docUri ? undefined : nodeKey,
            } as unknown as T;
          } else {
            obj[key] = {};
          }
        } else if (obj && obj.hasOwnProperty(key)) {
          obj[key] = visit(obj[key], docUri);
        }
      }
    }
    return obj;
  }
  map.forEach((value, key) => visit(value, key));
}
export function jsonPathToJsonPatchPath(path?: string) {
  return path
    ? "/" +
        path
          .slice(1)
          .replace(/[.|[|\]]/g, "/")
          .replace(/\/\//g, "/")
    : undefined;
}
export function addUUID(map: Map<string, any>) {
  function visit(obj: any) {
    if (obj && typeof obj === "object") {
      for (let key in obj) {
        if (obj[key] && obj.hasOwnProperty(key) && key !== "$ref") {
          visit(obj[key]);
        }
        obj["__tmp_uuid__"] = uuidv4();
      }
    }
  }
  map.forEach((val) => visit(val));
}
export function removeUUID(map: Map<string, any>) {
  function visit(obj: any) {
    if (obj && typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          visit(obj[key]);
        }
        if (key === "__tmp_uuid__") {
          obj[key] = undefined;
        }
      }
    }
  }
  map.forEach((val) => visit(val));
}
export function cleanJSON(map: Map<string, any>) {
  function visit(obj: any) {
    if (obj && typeof obj === "object") {
      if (Array.isArray(obj)) {
        obj = obj.filter((el) => !!el);
      }
      for (let key in obj) {
        if (Array.isArray(obj[key])) {
          obj[key] = obj[key].filter((el) => !!el);
        }
        if (obj.hasOwnProperty(key)) {
          visit(obj[key]);
        }
        if (key === "__tmp_uuid__") {
          obj[key] = undefined;
        }
      }
    }
    return obj;
  }
  map.forEach((val) => visit(val));
}
export function getReferenceUUID(json: any, ref: any) {
  if (ref.__id) {
    let nodes = findNodes(json, `__id`, ref.__id) ?? [];
    if (nodes[0]?.value) {
      return (nodes[0].value as any)["__tmp_uuid__"];
    }
  } else {
    const path = ref.__path.substring(ref.__path.indexOf("/") + 1).split("/");
    for (let pathComponent of path) {
      json = json[pathComponent];
    }
    return json["__tmp_uuid__"];
  }
}
export function updateReferences(map: Map<string, any>) {
  function visit(obj: any, initial: any) {
    if (obj && typeof obj === "object") {
      for (let key in obj) {
        if (key === "$ref") {
          let val = getReferenceUUID(
            obj[key].__documentUri ? map.get(obj[key].__documentUri) : JSON.parse(JSON.stringify(initial)),
            obj[key]
          );
          obj[key] = val ? val : obj[key];
        } else if (obj.hasOwnProperty(key)) {
          visit(obj[key], initial);
        }
      }
    }
  }
  map.forEach((value) => visit(value, value));
}
export function findUUID(json: any, path: any) {
  const pathComponents = path.substring(path.indexOf("/") + 1).split("/");
  for (let pathComponent of pathComponents) {
    json = json[pathComponent];
  }
  return json["__tmp_uuid__"];
}

export function rebuildLangiumReferences(
  map: Map<string, any>,
  astNodeLocator: AstNodeLocator,
  nameProvider: NameProvider,
  documents: LangiumDocuments
): Map<string, AstNode> {
  function linkNode(
    node: GenericAstNode,
    root: AstNode,
    container?: AstNode,
    containerProperty?: string,
    containerIndex?: number
  ) {
    for (const [propertyName, item] of Object.entries(node)) {
      if (Array.isArray(item)) {
        for (let index = 0; index < item.length; index++) {
          const element = item[index];
          if (isIntermediateReference(element)) {
            item[index] = reviveReference(node, propertyName, root, element);
          } else if (isAstNode(element)) {
            linkNode(element as GenericAstNode, root, node, propertyName, index);
          }
        }
      } else if (isIntermediateReference(item)) {
        node[propertyName] = reviveReference(node, propertyName, root, item);
      } else if (isAstNode(item)) {
        linkNode(item as GenericAstNode, root, node, propertyName);
      }
    }
    const mutable = node as Mutable<GenericAstNode>;
    mutable.$container = container;
    mutable.$containerProperty = containerProperty;
    mutable.$containerIndex = containerIndex;
  }
  function reviveReference(
    container: AstNode,
    property: string,
    root: AstNode,
    reference: IntermediateReference
  ): Reference | undefined {
    let refText = reference.$refText;
    if (reference.$ref) {
      const ref = getRefNode(root, reference.$ref);
      if (!refText) {
        refText = nameProvider.getName(ref);
      }
      return {
        $refText: refText ?? "",
        ref,
      };
    } else if (reference.$error) {
      const ref: Mutable<Reference> = {
        $refText: refText ?? "",
      };
      ref.error = {
        container,
        property,
        message: reference.$error,
        reference: ref,
      };
      return ref;
    } else {
      return undefined;
    }
  }

  function getRefNode<T extends AstNode>(root: AstNode, ref: Ref<T>): AstNode {
    if (ref.__id) {
      if (ref.__documentUri) {
        if (map.has(ref.__documentUri)) {
          const doc = map.get(ref.__documentUri);
          return getAstNodeById(doc, ref.__id)!;
        } else {
          const doc = documents.getOrCreateDocument(URI.parse(ref.__documentUri));
          return getAstNodeById(doc.parseResult.value, ref.__id)!;
        }
      }
      return getAstNodeById(root, ref.__id)!;
    } else if (ref.__path) {
      if (ref.__documentUri) {
        const doc = map.get(ref.__documentUri);
        return astNodeLocator.getAstNode(doc, ref.__path)!;
      }
      return astNodeLocator.getAstNode(root, ref.__path.substring(1))!;
    }
    return root;
  }

  function getAstNodeById<T extends AstNode = AstNode>(node: AstNode, id: string): T | undefined {
    const retNode = streamAst(node).find((astNode: any) => astNode.__id === id);
    if (retNode) return retNode as T;
    return node as T;
  }
  map.forEach((value, _key) => {
    linkNode(value, value);
  });
  return map;
}
