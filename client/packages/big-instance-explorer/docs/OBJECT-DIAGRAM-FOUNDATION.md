<!--
 Copyright (c) 2026 borkdominik and others.
 This program and the accompanying materials are made available under the
 terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 SPDX-License-Identifier: MIT
-->

# UML Object Diagram Foundation

This document explains the metamodel and notation layer that turns bigUML class diagrams
into object diagrams. It is Feature 1 of the object diagram topic. The other four features
(Model Instance Explorer, Automatic Test Data Generation, Template Based Export, and
Object to Class Transformation) are built on top of this layer.

If you want to understand or extend object diagram support, start here.

## What this layer adds

1. **Classifier reference on `InstanceSpecification`.** Every instance (object) can point to
   the class it is an instance of. This is the object diagram version of "this object is a Person".
2. **`InstanceLink` edge type.** A link between two objects. It is the instance level version of
   an association between two classes. For example `alice` `worksFor` `acme`.
3. **UML object notation.** Instances render with an underlined header `name : Classifier` and
   slots render as `property = value` inside the instance body.
4. **Classifier aware slot filtering.** A slot on an instance can only be defined by a property
   that the classifier actually has, including properties inherited from parent classes.

## Why it is the foundation

The classifier reference and the `InstanceLink` edge are the two data points that the other
features read and write:

- The **Instance Explorer** groups objects under their classifier and manages their links.
- **Test Data Generation** creates objects with classifier consistent slot values and links.
- **Template Based Export** exposes `instances`, `classifiers`, and `links` to the templates.
- **Object to Class Transformation** reads the links between objects to infer associations.

Without the classifier reference an object does not know which properties it may have, so slot
validation, grouping, export, and transformation would have nothing to build on.

## Key ideas in one minute

- A **classifier** is a class (or interface or data type). An **instance** is one concrete object
  of a classifier. The notation `alice : Person` reads as "alice is a Person".
- A **slot** is one property value on an object, for example `age = 30`.
- The **defining feature** of a slot is the property that the slot fills. Slot filtering makes sure
  you can only pick a property that the classifier really has.
- An **InstanceLink** connects two objects and mirrors an association between their classes.

## Where the code lives

| Concern | File |
| --- | --- |
| Classifier reference and `InstanceLink` in the metamodel | `client/tooling/uml-language/src/language/def.ts` |
| Generated grammar and AST types | `client/packages/uml-model-server` |
| Classifier indexing and defining feature resolution | `client/packages/uml-glsp-server/src/env/vscode/features/model/diagram-model-index.ts` |
| Generalization chain walk (pure helper) | `client/packages/uml-glsp-server/src/env/vscode/features/model/defining-features.ts` |
| Instance header and slot text (pure helpers) | `client/packages/uml-glsp-server/src/env/vscode/elements/object-notation.ts` |
| Instance and slot rendering | `client/packages/uml-glsp-server/src/env/vscode/elements/instance-specification.element.tsx`, `slot.element.tsx` |
| `InstanceLink` edge view on the client | `client/packages/uml-glsp-client/src/env/browser/uml/elements/instance-link/` |

## How slot filtering resolves the properties

When you edit a slot, the tool needs the list of properties that the instance may set. This list
is the classifier's own properties plus every property it inherits.

`resolveDefiningFeatures(classifier, relations)` computes this list. It walks the generalization
(inheritance) chain breadth first, starting from the classifier:

1. For each class or interface it reaches, it collects the class and all of its own properties.
2. It follows `Generalization` relations whose source is the current class to reach the parents.
3. A `visited` set keeps the walk safe. It handles repeated parents (diamond shapes) and even
   cycles without looping forever.

The result keeps the classifier's own features first, then the features of each ancestor.

## Tests

The pure logic of this layer is covered by unit tests in
`client/packages/uml-glsp-server/test`:

- `defining-features.test.ts` covers the generalization walk: no parent, single and multi level
  inheritance, diamond inheritance, cycles, interfaces, data types, and empty inputs.
- `object-notation.test.ts` covers the header text (`name : Classifier`) and the slot text
  (`property = value`, multi value joining, and the fallbacks).

Run them from the package folder:

```bash
cd client/packages/uml-glsp-server
npm test
```

## How to build on top of this layer

- To read which class an object belongs to, use the `classifier` reference on the
  `InstanceSpecification`.
- To list the properties an object may set, call `getDefiningFeaturesForSlot` on the model index,
  or `resolveDefiningFeatures` directly if you already have the classifier and relations.
- To read or create links between objects, use the `InstanceLink` relation type.
- To render an object header or a slot in the same style, reuse `composeInstanceDisplayName` and
  `composeSlotText` from `object-notation.ts` so the notation stays consistent.
