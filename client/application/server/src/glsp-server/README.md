# Decorators in `def.ts`

This file uses various decorators to enrich the model definitions and influence behavior in generated tooling such as the property palette, outline view, creation path logic, and model validation. This README explains their purpose and usage.

---

## Class (Entity) Decorators

### `@root`
Marks a class as the **entry point** of the model. Typically used on the top-level container (e.g., `Diagram`) to define the root AST node.

### `@withDefaults`
Enables **default value propagation** during model creation.  
- Without `@withDefaults`: Only fields that are either non-optional or have an explicitly defined default value (e.g., isQuery = false) are initialized.
- With `@withDefaults`: All field defaults are applied, including optional fields, using either the explicitly provided value or the type's standard default (e.g., false for booleans, 0 for numbers, "PUBLIC" for visibility, etc.).

### `@noBounds`
Applied to entities that **do not have size or position** in the graphical representation (e.g., `EnumerationLiteral`, `Property`). This avoids unnecessary visual layout configuration.

---

## Property Decorators

### `@path`
Marks properties as **child containers** in the model hierarchy.  
Used by the **creation path generator** to determine which child elements can be created under a parent.

### `@crossReference`
Marks a property as a **reference to another model element**, resolved by name or ID, rather than containment. Common in relationships or type references.

### `@dynamicProperty('X')`
Used together with `@crossReference`. Tells the tooling (like the property palette) to automatically provide a **dropdown of all available elements of type `X`**, supporting dynamic model linking.

### `@skipPropertyPP`
If present, the property is **excluded from the property palette**, even if it's part of the model.

---

## Validation Decorators

These are imported from [`class-validator`](https://www.npmjs.com/package/class-validator/v/0.6.0) and control model validation.

### `@MinLength`
Ensures a string property has at least the given number of characters.

### `@ValidateIf`
Conditional validation — only runs the validation if a given condition is true.

### `@ArrayMaxSize`
Limits the maximum size of an array.

### `@Equals`
Ensures a field strictly equals the specified value.

### `@LengthBetween` *(custom)*
Custom decorator for validating that a string's length is **between two values**.  
Also demonstrates the extensibility of the validation mechanism.

---

## AST Mapping Decorator

### `@astType('X')`
Overrides the default AST node type mapping. Used when the auto-generated AST name (based on class name) is insufficient or conflicts with diagram edge handling.

