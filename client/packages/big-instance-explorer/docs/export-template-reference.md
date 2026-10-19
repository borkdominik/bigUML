# Export Template Reference

This guide documents the Eta template context used by the instance export feature.

## Template locations

- Built-in templates are shipped from `packages/big-instance-explorer/templates/`.
- Custom templates are loaded from `<workspace-root>/.biguml/templates/`.
- Only `.eta` files are loaded.
- If a custom template has the same template name as a built-in template, the custom template overrides the built-in one.

Template name = file name without `.eta`.

Examples:

- `json.eta` -> template name `json`
- `my-export.xml.eta` -> template name `my-export.xml`

## Root object

The Eta context root is available as `it`.

```eta
<%= it.diagramName %>
<%= it.timestamp %>
```

## Available variables

### `it.diagramName: string`

Name of the current diagram, or a fallback file-based name.

### `it.timestamp: string`

Export timestamp in ISO format (`new Date().toISOString()`).

### `it.instances: ExportInstance[]`

All exported instances for the selected scope.

`ExportInstance` fields:

- `id: string`
- `name: string`
- `classifierName: string`
- `classifierId?: string`
- `slots: ExportSlot[]`

`ExportSlot` fields:

- `featureName: string`
- `value: string` (comma-separated convenience value)
- `values: string[]` (raw values)

### `it.classifiers: ExportClassifier[]`

Classifier list available in the model.

`ExportClassifier` fields:

- `id: string`
- `name: string`

### `it.links: ExportLink[]`

Links between exported instances (filtered by selected scope).

`ExportLink` fields:

- `id: string`
- `relationName?: string`
- `sourceInstanceId?: string`
- `targetInstanceId?: string`

## Minimal example

```eta
{
  "diagram": "<%= it.diagramName %>",
  "timestamp": "<%= it.timestamp %>",
  "instances": [
  <% it.instances.forEach((inst, i) => { %>
    {
      "id": "<%= inst.id %>",
      "name": "<%= inst.name %>",
      "classifier": "<%= inst.classifierName %>"
    }<%= i < it.instances.length - 1 ? ',' : '' %>
  <% }) %>
  ]
}
```

