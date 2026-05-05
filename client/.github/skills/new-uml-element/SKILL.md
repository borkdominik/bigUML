---
name: new-uml-element
description: >-
    Add a new UML element type end-to-end: define it in def.ts, run code generation,
    and optionally create diagram rendering. Use this skill whenever the user wants to
    add a new element, extend the metamodel, modify def.ts, add a node or edge type,
    create a new UML class/interface/component/package/activity/etc., or mentions
    "tool palette", "new element", "def.ts", "metamodel", or "code generation".
    Also use when the user asks to add properties to an existing element or change
    decorators.
---

# Add a New UML Element

Guide for adding a new UML element type to bigUML. This is the most common extension task - it spans the language definition, code generation pipeline, and optionally the diagram rendering layer.

## Task checklist

- Define the element class in `tooling/uml-language/src/language/def.ts` with appropriate decorators
- Run `npm run generate` from the workspace root
- Verify generated output in each package's `src/gen/` directory (use git diff to see changes)
- (Optional) Create a `.element.tsx` JSX view for diagram rendering
- (Optional) Register the element view in the GLSP client container
- Verify the full chain: model types, tool palette, property palette, grammar rule

## Before you start

Read the existing language definition to understand the patterns in use:

- `tooling/uml-language/src/language/def.ts` — the single source of truth for the UML metamodel

If you need deeper understanding of the generation pipeline, read `docs/guides/property-palette-generator.md`.

## Step 1: Define the element in def.ts

Open `tooling/uml-language/src/language/def.ts` and add a new class. Choose the correct base class:

| Base class | When to use                                                     |
| ---------- | --------------------------------------------------------------- |
| `Node`     | Standalone diagram nodes (Class, Interface, Package, etc.)      |
| `Relation` | Edges connecting two nodes (Association, Dependency, etc.)      |
| `Entity`   | Sub-elements contained inside nodes (Property, Operation, etc.) |

### Decorators reference

Apply decorators based on what the element needs. Three import sources provide all decorators:

```typescript
import { root, crossReference, path, astType, dynamicProperty } from '@borkdominik-biguml/uml-language-tooling';
import { toolPaletteItem, withDefaults } from '@borkdominik-biguml/uml-glsp-server/generator';
import { skipPropertyPP } from '@borkdominik-biguml/big-property-palette/generator';
```

| Decorator                                  | Import                           | Purpose                                                    |
| ------------------------------------------ | -------------------------------- | ---------------------------------------------------------- |
| `@toolPaletteItem({section, label, icon})` | `uml-glsp-server/generator`      | Shows element in the diagram creation palette              |
| `@withDefaults`                            | `uml-glsp-server/generator`      | All properties get default values for new element creation |
| `@path`                                    | `uml-language-tooling`           | Declares a containment relationship (parent owns children) |
| `@crossReference`                          | `uml-language-tooling`           | Declares a reference to another element (not ownership)    |
| `@astType('...')`                          | `uml-language-tooling`           | Maps a semantic type to its AST representation             |
| `@dynamicProperty('...')`                  | `uml-language-tooling`           | Enables runtime choice list population from model state    |
| `@root`                                    | `uml-language-tooling`           | Marks the diagram root element (rarely needed)             |
| `@skipPropertyPP`                          | `big-property-palette/generator` | Excludes property from the property palette                |

### Example: Adding a new node element

```typescript
@toolPaletteItem({
    section: 'Container',
    label: 'Component',
    icon: 'uml-component-icon'
})
@withDefaults
export class Component extends Node {
    name: string;
    isAbstract: boolean = false;
    visibility?: Visibility;
    @path ports?: Array<Port>;
    @path providedInterfaces?: Array<InterfaceRealization>;
}
```

### Example: Adding a new edge element

```typescript
@toolPaletteItem({
    section: 'Relation',
    label: 'Dependency',
    icon: 'uml-dependency-icon'
})
@withDefaults
export class Dependency extends Relation {
    name?: string;
}
```

### Example: Adding a contained entity

Entities don't need `@toolPaletteItem` since they are created from their parent's property palette:

```typescript
@withDefaults
export class Port extends Entity {
    name: string;
    visibility?: Visibility;
    @dynamicProperty('DataType') type?: string;
}
```

### Don't forget the diagram elements type alias

If you add a new top-level node or relation, add it to the appropriate `*DiagramElements` type alias at the bottom of `def.ts`. This ensures the code generation pipeline includes it in request dispatchers.

## Step 2: Run code generation

From the workspace root:

```bash
npm run generate
```

This triggers the `uml-language-tooling` CLI which:

1. Parses `def.ts` using the TypeScript compiler API
2. Transforms declarations (flatten inheritance, resolve types)
3. Runs per-package generators that emit code into `src/gen/`

### What gets generated per package

| Package                | Generated files                             | Purpose                                                         |
| ---------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| `uml-glsp-server`      | `src/gen/common/model-types.ts`             | Type string constants (e.g., `ClassDiagramNodeTypes.COMPONENT`) |
| `uml-glsp-server`      | `src/gen/vscode/tool-palette.ts`            | Tool palette section items                                      |
| `uml-glsp-server`      | `src/gen/vscode/creation-paths.ts`          | Parent-to-child property name mappings                          |
| `uml-glsp-server`      | `src/gen/vscode/default-values.ts`          | Default property values for new elements                        |
| `big-property-palette` | `src/gen/glsp-server/handlers/elements/`    | Per-element JSX property palette handlers                       |
| `big-property-palette` | `src/gen/glsp-server/handlers/`             | Request dispatcher per diagram type                             |
| `uml-model-server`     | `src/gen/langium/uml-diagram.langium`       | Langium grammar rule for the element                            |
| `uml-model-server`     | `src/gen/langium/uml-diagram-serializer.ts` | Serialization method for the element                            |

## Step 3: Verify generated output

After generation, confirm:

1. The new type constant exists in `packages/uml-glsp-server/src/gen/common/model-types.ts`
2. The tool palette entry appears in `packages/uml-glsp-server/src/gen/vscode/tool-palette.ts`
3. A property palette handler was generated in `packages/big-property-palette/src/gen/glsp-server/handlers/elements/`
4. The grammar rule exists in `packages/uml-model-server/src/gen/langium/uml-diagram.langium`

## Step 4 (Optional): Create diagram rendering

If the element needs custom visual rendering beyond a generic box, create a `.element.tsx` file.

### For server-side GModel (JSX element factory)

Create a file in `packages/uml-glsp-server/src/env/vscode/elements/`:

```typescript
// my-element.element.tsx
import { ClassDiagramNodeTypes } from '@borkdominik-biguml/uml-glsp-server';
import { normalizeChildren, type GlspNode } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { MyElement } from '@borkdominik-biguml/uml-model-server/grammar';
import { type Dimension, type Point } from '@eclipse-glsp/protocol';
import { GNode, type GModelElement } from '@eclipse-glsp/server';
import { CompartmentHeader } from './shared-components.js';

export class GMyElementNode extends GNode {
    override type = ClassDiagramNodeTypes.MY_ELEMENT;
    override layout = 'vbox';
    name: string = '';
}

export function GMyElementNodeElement(props: {
    node: MyElement;
    position?: Point;
    size?: Dimension;
    children?: GlspNode;
}): GModelElement {
    const { node, position, size, children } = props;
    const elementNode = new GMyElementNode();
    elementNode.id = node.__id;
    elementNode.name = node.name;
    elementNode.cssClasses = ['uml-node'];
    elementNode.children = [];

    if (position) elementNode.position = position;
    if (size) {
        elementNode.size = size;
        elementNode.layoutOptions = { prefWidth: size.width, prefHeight: size.height };
    }

    const header = <CompartmentHeader id={node.__id} name={node.name} />;
    header.parent = elementNode;
    elementNode.children.push(header);

    for (const child of normalizeChildren(children)) {
        child.parent = elementNode;
        elementNode.children.push(child);
    }

    return elementNode;
}
```

### Register in the GModel factory

Add the new element's rendering call in `UmlDiagramGModelFactory`'s `createEntities()` method - dispatch by `$type` to the new JSX component.

## Common mistakes

- Forgetting to add the element to the `*DiagramElements` type alias - the request dispatcher won't include it
- Using `@crossReference` when `@path` is needed (or vice versa) - `@path` means ownership/containment, `@crossReference` means a loose reference
- Missing `@withDefaults` - new element creation will fail because default values won't be generated
- Editing files in `src/gen/` manually - they will be overwritten on next generation

## Further reading

- `docs/guides/property-palette-generator.md` — full generation pipeline details
- `docs/glsp-server-architecture.md` — GModel creation and JSX component system
- `docs/architecture-overview.md` — how the code generation pipeline fits into the overall system
