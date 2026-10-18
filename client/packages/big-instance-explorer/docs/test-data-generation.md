# Test Data Generation Reference

This guide documents the automatic test data generation feature of the instance
explorer: the configuration options, the value strategies, the pattern syntax,
association depth, link rules, diagnostics, and current value storage limitations.

For the package-level architecture and test layout, see
[`TEST-DATA-GENERATION.md`](TEST-DATA-GENERATION.md).

## Opening the generator

Open the **Instances** view in the bigUML sidebar and select **Generate Test Data**.
The configuration form opens inline in the panel.

Generation is applied as one atomic model change through a single `ModelPatchCommand`.
A single undo reverts the entire batch of instances, slots, positions, and links.

## Configuration options

| Option | Meaning |
| ------------------------------ | ------------------------------------------------------------------------------------------------ |
| Classifiers | Which classes and data types to instantiate. Inherited properties are included. |
| Instances per classifier | How many objects to create for each selected classifier. One count applies to all. |
| Strategy | How slot values are produced. See [Value strategies](#value-strategies). |
| Patterns | Per-property templates, shown when the Pattern strategy is selected. See [Pattern syntax](#pattern-syntax). |
| Association depth | Whether and how far to create links. See [Association depth](#association-depth). |
| Link targets | Per association: `Auto (random eligible)` or a pinned existing instance as target for all sources. |
| Link only within this batch | Restricts link targets to the just-generated instances, producing a self-contained example graph. |
| Seed | Optional. The same seed and configuration produce identical output: values, picks, and links. Blank means fresh random each run. |
| Preview | Dry run. See [Preview](#preview). Nothing is applied. |
| Generate / Cancel | Apply the batch as one undoable change, or close the form. |

## Value strategies

One strategy applies to the whole generation run.

| Strategy | Behavior |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Realistic (Faker) | Default. Values are inferred from the property name with a type-based fallback: `fullName` produces a person name, `email` an email address, and similarly for `city`, `salary`, `birthYear`, and others. Seeded, therefore reproducible. |
| Random (type-driven) | Type-correct dummy values for String, Integer, Boolean, Real, and Enumeration properties. Enumerations pick one of their literals. Untyped properties receive a string. |
| Pattern | Per-property templates with random fallback for properties without a pattern. |

How property types are resolved, for every strategy:

- Untyped properties are treated as strings.
- Properties typed to a DataType, meaning a value type such as `Address`, are
  value-bearing and receive a flat string value rather than a nested structure.
- Properties typed to a Class are references and receive no slot. Relationships are
  expressed through associations and covered by link generation instead.

## Pattern syntax

| Token | Meaning |
| --------------- | ------------------------------------------------------------------- |
| `{n}` | Instance index, counted per classifier: 1, 2, 3, and so on. |
| `{pick:a,b,c}` | Seeded random choice from the listed options. |
| any other text | Emitted literally. |
| empty pattern | Falls back to the random strategy for that property. |

Example: `user{n}@{pick:example.com,test.org}` produces `user1@example.com`,
`user2@test.org`, and so on.

Notes:

- The pattern editor is prefilled with suggested defaults per property.
- Pick options cannot contain a literal `,` or `}`. There is no escape mechanism yet.
- Classifiers pulled in automatically by association depth 2 or higher are not selected
  in the form, so their properties fall back to random. To pattern them, select them
  explicitly.
- Pattern values that do not match the property type, for example text for an Integer
  property, are kept. The generator respects the explicit pattern and raises a
  `TYPE_MISMATCH` warning instead of overriding the value.

## Association depth

| Depth | Behavior |
| ------- | ------------------------------------------------------------------------------------------------------------ |
| 0 | No links. Only instances with slot values are created. |
| 1 | Generate only the selected classifiers and link them directly. |
| N ≥ 2 | Additionally generate the related classifiers reachable within N − 1 association hops, then link the whole graph. |

Example: generating `Company` at depth 3 also generates the `Employee`s that work for
it, one hop away, and their `Address`es and `Project`s, two hops away, all connected.
Reachability follows associations in both directions, so generating a target-only class
still pulls in its sources.

## Link rules

- Links are created from source to target along the diagram's `Association` elements.
  The generator never invents associations. Inherited associations apply to concrete
  subtypes.
- The target multiplicity, such as `[one]`, `[*]`, or `2..5`, bounds the number of
  links per source.
- The source multiplicity bounds how many sources may link a single target. A
  one-to-one association therefore never shares a target. Surplus sources produce a
  `MULTIPLICITY_BEST_EFFORT` warning when targets run out.
- Targets are chosen least-used-first, so links distribute evenly. Six employees over
  three companies result in two links per company.
- A pinned link target routes all sources of that association to one chosen instance.

## Constraints honoured

- `isReadOnly` properties are skipped; no slot is created.
- `isUnique` values are de-duplicated best-effort. A diagnostic warns when uniqueness
  cannot be satisfied.
- Multi-valued properties, with an upper bound greater than one, receive several
  ordered slot values, honouring `isOrdered`.
- Required properties, with a lower bound of at least one, that cannot be filled
  produce a warning.
- Association multiplicities are respected on both ends. See [Link rules](#link-rules).

## Preview

**Preview** runs the full generation in memory and reports the result without touching
the model:

- Per-classifier instance counts and the total number of planned links.
- A sample of instances with their slot values, stratified per classifier: up to 5
  instances per classifier, capped at 25 in total. Small classifiers therefore always
  appear, even in large runs.
- All diagnostics the real run would produce. See [Diagnostics](#diagnostics).

The same seed produces the same result in preview and generate, so the preview shows
exactly what gets applied.

## Diagnostics

Generation never fails silently. Constraint issues surface as warnings in the preview
and in the generation result:

| Code | Meaning |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| `REQUIRED_PROPERTY_SKIPPED` | A required property could not be filled, for example an Enumeration without literals. |
| `UNIQUENESS_BEST_EFFORT` | An `isUnique` property could not receive fully distinct values because the value space was exhausted. |
| `TYPE_MISMATCH` | A pattern or user-supplied value is incompatible with the property type. The value is kept as is. |
| `MULTIPLICITY_BEST_EFFORT` | Link bounds could not be fully satisfied, for example when one-to-one sources outnumber available targets. |

## Placement

Generated instances are laid out in a uniform, non-overlapping grid in empty space
below the existing diagram. The column width equals the widest instance and the row
height the tallest, so nothing overlaps existing elements or other generated instances.
Links are created but not auto-routed into a hierarchy.

## Value storage limitations

The metamodel stores slot values as identifier tokens, which restricts what can be
persisted verbatim:

- Whitespace becomes `_`. `Alice Smith` is stored as `Alice_Smith`.
- Bare numbers and booleans receive a `_` prefix so they survive the parser. `85` is
  stored as `_85` and `true` as `_true`. The original value is recoverable by stripping
  the prefix.

Both transformations happen in one chokepoint, `sanitizeSlotValue`, so every strategy
and every user-typed pattern is grammar-safe. Verbatim storage requires an
escaped-string grammar terminal, which is tracked as metamodel work.
