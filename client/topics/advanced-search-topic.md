# Search & Replace for GLSP Diagrams

## Overview

Extend bigUML's existing advanced search with visual element preview (SVG rendering), structured text-based queries for graphical elements, and replace functionality. The scope ranges from simple label-based search & replace within visible diagrams to advanced model queries with structured highlighting.

## Table of Contents

1. [Feature: SVG Preview of Search Results](#1-feature-svg-preview-of-search-results)
2. [Feature: Text-Based Queries for Graphical Elements](#2-feature-text-based-queries-for-graphical-elements)
3. [Feature: Replace Functionality](#3-feature-replace-functionality)
4. [Current Architecture](#4-current-architecture)
5. [Architecture Reference](#5-architecture-reference)
6. [Suggested Implementation Order](#6-suggested-implementation-order)
7. [Related Documentation](#7-related-documentation)
8. [Literature Pointers (Model Search & Query)](#8-literature-pointers-model-search--query)

---

## 1. Feature: SVG Preview of Search Results

### Goal

Show search result elements as inline SVG previews within the search webview, similar to how revision management displays diagram snapshots.

### Approach Options

#### Option A: Full-Diagram Export + Client-Side Cropping (Recommended)

1. After search results are returned, request an SVG export of the entire diagram using the existing `RequestMinimapExportSvgAction`
2. On the React side, parse the SVG and extract only the `<g>` subtrees matching the result element IDs
3. Compute per-element bounds and render each cropped SVG inline in the result list

**Pros:** Reuses existing SVG export infrastructure, no server changes needed.
**Cons:** Exports entire diagram even if only a few elements match; SVG parsing on client side.

**Implementation sketch:**

- In the `AdvancedSearchWebviewViewProvider`, listen for `AdvancedSearchActionResponse`, then request an SVG export via `RequestMinimapExportSvgAction`
- When the `MinimapExportSvgAction` response arrives, forward both the search results and the SVG string to the webview
- In the React component, use a `DOMParser` to parse the SVG and extract elements by their `id` attribute (Sprotty assigns element IDs to `<g>` groups)
- Wrap each extracted `<g>` in its own `<svg>` with a computed `viewBox`

#### Option B: Per-Element SVG Export Action

1. Define a new action `RequestElementExportSvgAction { elementIds: string[] }` in `big-advancedsearch/src/env/common/`
2. Implement a handler in the GLSP client that:
    - Exports the full diagram SVG (reusing minimap exporter)
    - Extracts individual element subtrees from the serialized SVG
    - Returns a map of `elementId → { svg: string, bounds: Bounds }`
3. Forward the per-element SVGs to the webview

**Pros:** Clean action interface, server does the cropping.
**Cons:** More implementation effort; requires `<defs>` (markers, fonts) to be duplicated per element.

#### Option C: Thumbnail via Off-Screen Sprotty Rendering

1. Create a minimal off-screen Sprotty model containing only the matched element
2. Use `ModelRenderer` to render it to a virtual DOM, serialize to SVG string
3. This gives a clean, self-contained SVG per element

**Pros:** Cleanest SVGs, no cropping artifacts.
**Cons:** Requires setting up a secondary Sprotty rendering pipeline; font metrics and layout may differ from the main diagram.

### Challenges to Consider

- **Style dependencies:** Inlined styles from the minimap exporter already handle this, but cropping a `<g>` may lose inherited styles from parent groups
- **`<defs>` section:** Edge markers (`<marker>`) and gradients live in a shared `<defs>` block — cropped elements referencing them need the defs included
- **Font metrics:** Label text positions are measured by the browser — off-screen rendering may differ
- **Performance:** Exporting the full diagram on every search may be expensive for large models; consider caching or debouncing

### Rendering in the Webview

Follow the revision management pattern:

```tsx
{
    result.svg && (
        <div className='result-item__preview'>
            <svg viewBox={`0 0 ${result.bounds.width} ${result.bounds.height}`}>
                <g dangerouslySetInnerHTML={{ __html: result.svg }} />
            </svg>
        </div>
    );
}
```

### Files to Modify/Create

| File                                                                        | Change                                                                         |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `big-advancedsearch/src/env/common/advancedsearch.action.ts`                | Extend `SearchResult` to include optional `svg?: string` and `bounds?: Bounds` |
| `big-advancedsearch/src/env/common/advancedsearch.action.ts`                | (Option B) Add `RequestElementExportSvgAction`                                 |
| `big-advancedsearch/src/env/vscode/advancedsearch.webview-view-provider.ts` | After search response, request SVG export; merge SVG data into results         |
| `big-advancedsearch/src/env/browser/advancedsearch.component.tsx`           | Render inline SVG previews per result item                                     |
| `big-advancedsearch/styles/index.css`                                       | Style the SVG preview container                                                |

---

## 2. Feature: Text-Based Queries for Graphical Elements

### Goal

Design a query language that lets users search for graphical UML elements using text expressions. The query should support filtering by element type, property values, relationships, and structural patterns.

### Research Topics

Students should survey existing literature and tools in these areas:

1. **Model querying languages:**
    - OCL (Object Constraint Language) — the OMG standard for UML model queries
    - EMF Query / EMF Query 2 — Eclipse-based model query frameworks
    - IncQuery / VIATRA Query — graph pattern-based model queries (see: Bergmann et al., "Incremental Evaluation of Model Queries over EMF Models", MODELS 2010)
    - Epsilon Object Language (EOL) — model management language with query capabilities
    - GraphQL-inspired approaches for model graphs

2. **Text-based visual search:**
    - CSS-selector-like syntax for model graphs (e.g., `Class[name~="User"] > Property[type="String"]`)
    - XPath-style navigation for tree-structured models
    - Regex patterns scoped to element types

3. **User experience for search in visual environments:**
    - How do tools like Enterprise Architect, MagicDraw, Papyrus handle model search?
    - Faceted search with type/property/relationship filters
    - Autocomplete and suggestions based on the current model's element types

### Recommended Query Syntax Direction

Building on the existing `Type:Pattern` syntax, consider extending it incrementally:

**Level 1 — Enhanced current syntax (minimal change):**

```
Class:User                     # existing: type + name substring
Property:name=email            # new: property-value filter
Operation:visibility=public    # new: filter by property
*:User                         # wildcard type
```

**Level 2 — Boolean operators and regex:**

```
Class:User AND Property:email           # boolean AND
Class:/^Abstract.*/                     # regex match
NOT Class:Test                          # negation
(Class:User OR Interface:User)          # grouping
```

**Level 3 — Structural/relational queries:**

```
Class:User -> Association -> Class:*    # follow relationships
Class[properties.count > 3]            # property-based predicates
Class:User.properties                  # navigate to children
```

### Implementation Pointer

The query parser runs on the **GLSP server** (Node.js), where `AdvancedSearchActionHandler.handleSearch()` currently splits on `:`. This is the place to plug in a more sophisticated parser:

1. Define a grammar for the query language (can be a simple recursive-descent parser or use a library like [Chevrotain](https://chevrotain.io/) or [nearley](https://nearley.js.org/))
2. The parser produces a query AST
3. The query AST is evaluated against the serialized Langium model (`serializedSemanticRoot()`)
4. Consider indexing: for large models, pre-build lookup maps (e.g., by type, by name) rather than scanning the full tree per query

### Visualization of Query Matches

When results are found, visualize them in the diagram:

1. **Highlight matching elements:** Dispatch `SelectAction` with all matching element IDs (already partially implemented via `RequestHighlightElementAction`)
2. **Custom CSS highlight:** Add a new CSS class (e.g., `.search-match`) with a distinctive style (colored border, background tint) separate from selection
3. **Non-matching element dimming:** Reduce opacity of non-matching elements to focus attention on matches
4. **Fit-to-matched:** After highlighting, dispatch `FitToScreenAction` with only the matched element IDs to zoom/pan the viewport

**Implementation approach for structured highlighting:**

Introduce a new GLSP client-side module in `big-advancedsearch/src/env/glsp-client/`:

```typescript
// search-highlight-feedback.ts
// Uses FeedbackActionDispatcher to apply/remove search highlights
// Adds a VNodePostprocessor that applies .search-match CSS class
// to elements whose IDs are in the active search result set
```

Register the response action `AdvancedSearchActionResponse` as an `ExtensionActionKind` (already done in the existing `advancedSearchModule`), then add a handler that reads result IDs and dispatches feedback.

### Files to Modify/Create

| File                                                                  | Change                                                            |
| --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `big-advancedsearch/src/env/common/advancedsearch.action.ts`          | Extend query format or add new structured query action            |
| `big-advancedsearch/src/env/glsp-server/advancedsearch.handler.ts`    | Replace simple string parsing with query parser                   |
| `big-advancedsearch/src/env/glsp-server/matchers/IMatcher.ts`         | Extend matcher interface to support property/relationship queries |
| `big-advancedsearch/src/env/glsp-client/advancedsearch.module.ts`     | Add highlight feedback handler                                    |
| `big-advancedsearch/src/env/glsp-client/search-highlight-feedback.ts` | New: client-side highlight postprocessor                          |
| `big-advancedsearch/src/env/browser/advancedsearch.component.tsx`     | Query builder UI, syntax hints                                    |
| `big-advancedsearch/styles/index.css` or `uml-glsp-client/css/`       | `.search-match` styles                                            |

---

## 3. Feature: Replace Functionality

### Goal

Allow users to find elements matching a query and replace their label text (or other properties) in bulk, with preview and undo support.

### Approach Options

#### Option A: Batch JSON Patch via GLSP Server (Recommended)

Build on the existing label-edit infrastructure. The `GenericLabelEditOperationHandler` already knows how to construct JSON patches for name changes. A replace operation would:

1. Run the search query to get matching `SearchResult[]` with semantic element IDs
2. For each match, resolve its JSON path using `DiagramModelIndex.findPath(id)`
3. Apply a regex/substring replacement to the target property value
4. Collect all replacements into a single JSON patch array
5. Execute via `ModelPatchCommand` → `DiagramModelState.sendModelPatch()`

A single patch array ensures:

- **Atomicity:** All replacements applied together
- **Single undo:** One undo reverts all changes
- **Efficiency:** One serialization/deserialization cycle

**New actions needed:**

```typescript
// In big-advancedsearch/src/env/common/
interface RequestReplaceAction extends RequestAction<ReplaceActionResponse> {
    kind: 'requestReplace';
    query: string; // search query (same as search)
    searchPattern: string; // text to find within matched labels
    replaceWith: string; // replacement text
    elementIds?: string[]; // optional: limit replacement to specific results
    isRegex?: boolean; // treat searchPattern as regex
}

interface ReplaceActionResponse extends ResponseAction {
    kind: 'replaceResponse';
    replacements: ReplaceResult[]; // what was changed
    success: boolean;
}

interface ReplaceResult {
    elementId: string;
    oldValue: string;
    newValue: string;
}
```

**Server-side handler sketch:**

```typescript
// In big-advancedsearch/src/env/glsp-server/replace.handler.ts
class ReplaceActionHandler extends ActionHandler {
    handle(action: RequestReplaceAction): MaybePromise<Action[]> {
        // 1. Run search to get matching elements
        const results = this.runSearch(action.query);

        // 2. Filter to requested elementIds (if specified)
        const targets = action.elementIds ? results.filter(r => action.elementIds.includes(r.id)) : results;

        // 3. Build JSON patch array
        const patches = [];
        for (const target of targets) {
            const path = this.modelState.index.findPath(target.id);
            const node = this.modelState.index.findSemanticElement(target.id);
            const propertyName = 'name'; // or resolve dynamically
            const oldValue = node[propertyName];
            const newValue = action.isRegex
                ? oldValue.replace(new RegExp(action.searchPattern, 'g'), action.replaceWith)
                : oldValue.replaceAll(action.searchPattern, action.replaceWith);

            patches.push({ op: 'replace', path: `${path}/${propertyName}`, value: newValue });
        }

        // 4. Execute as single command
        const command = new ModelPatchCommand(this.modelState, JSON.stringify(patches));
        await command.execute();

        // 5. Return results
        return [ReplaceActionResponse.create({ replacements, success: true })];
    }
}
```

#### Option B: Client-Side Label Edit Dispatch

Instead of server-side batch patching, dispatch individual `ApplyLabelEditOperation` for each match from the webview:

1. Webview sends replace request to VSCode extension host
2. Extension host loops over matched elements and dispatches `ApplyLabelEditOperation` for each
3. Each edit goes through the normal label-edit pipeline

**Pros:** No new server code needed, reuses existing operation.
**Cons:** Each edit is a separate undo entry; may be slow for many matches; no atomicity.

#### Option C: Direct Model Server Patch

Bypass GLSP entirely and send the JSON patch directly from the VSCode extension host to the model server:

1. Extension host resolves the matching elements' JSON paths
2. Constructs the JSON patch array
3. Calls `ModelService.patch()` directly via the model server RPC

**Pros:** Simplest server-side implementation.
**Cons:** Bypasses GLSP command stack (no diagram-level undo); requires the extension host to have model index access.

### UI Design for Replace

Extend the search webview with:

1. **Replace input field:** A second text input below the search field for the replacement text
2. **Per-result replace buttons:** Each result item shows a "Replace" button and a preview of the change (strikethrough old text, colored new text)
3. **Replace All button:** Applies replacement to all matched results
4. **Preview mode:** Before applying, show a diff view of all pending changes
5. **Regex toggle:** A button to enable regex mode for the search pattern

**Mockup:**

```
┌─────────────────────────────────────┐
│ Search:  [Class:User_____________]  │
│ Replace: [Admin__________________]  │
│          [☐ Regex] [Replace All]    │
├─────────────────────────────────────┤
│ 3 results                           │
│                                     │
│ ┌─ Class ─────────────────────────┐ │
│ │ [SVG preview]                   │ │
│ │ UserService → AdminService      │ │
│ │              [Replace] [Skip]   │ │
│ ├─ Class ─────────────────────────┤ │
│ │ [SVG preview]                   │ │
│ │ UserRepository → AdminRepository│ │
│ │              [Replace] [Skip]   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Security Considerations

- **Regex injection:** If `isRegex` mode is supported, the regex must be validated before use. Wrap construction in a try-catch and limit complexity (e.g., reject patterns with excessive backtracking via a timeout)
- **Patch validation:** Ensure the JSON path exists before applying the patch — the `findPath()` call may return `undefined` for stale results
- **Input sanitization:** The replacement string should not allow injection of JSON patch structures or model syntax that could corrupt the AST

### Files to Modify/Create

| File                                                              | Change                                                                |
| ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| `big-advancedsearch/src/env/common/replace.action.ts`             | New: `RequestReplaceAction`, `ReplaceActionResponse`, `ReplaceResult` |
| `big-advancedsearch/src/env/glsp-server/replace.handler.ts`       | New: `ReplaceActionHandler` — builds and executes batch JSON patches  |
| `big-advancedsearch/src/env/glsp-server/advancedsearch.module.ts` | Register `ReplaceActionHandler` in `configureActionHandlers`          |
| `big-advancedsearch/src/env/browser/advancedsearch.component.tsx` | Add replace input, per-result preview, Replace All button             |
| `big-advancedsearch/styles/index.css`                             | Styles for replace UI, diff preview                                   |

---

## 4. Current Architecture

### 4.1 Existing Search — `big-advancedsearch`

The search package is located at [packages/big-advancedsearch/](packages/big-advancedsearch/) and already provides a pattern-matching search across UML model elements.

**Data flow:**

```
React Webview (browser)
  │  dispatchAction(RequestAdvancedSearchAction)
  ▼
VSCode Extension Host (AdvancedSearchWebviewViewProvider)
  │  routes via ActionDispatcher
  ▼
GLSP Server (AdvancedSearchActionHandler)
  │  parses query, runs matchers, returns results
  ▼
AdvancedSearchActionResponse (SearchResult[])
  │  routes back via ActionMessenger
  ▼
React Webview displays results
```

**Key files to study:**

| File                                                                                                                                                                     | What it does                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [packages/big-advancedsearch/src/env/common/advancedsearch.action.ts](packages/big-advancedsearch/src/env/common/advancedsearch.action.ts)                               | `RequestAdvancedSearchAction` / `AdvancedSearchActionResponse` definitions              |
| [packages/big-advancedsearch/src/env/common/highlight.action.ts](packages/big-advancedsearch/src/env/common/highlight.action.ts)                                         | `RequestHighlightElementAction` — selects an element in the diagram                     |
| [packages/big-advancedsearch/src/env/common/searchresult.ts](packages/big-advancedsearch/src/env/common/searchresult.ts)                                                 | `SearchResult` interface (`id`, `type`, `name`, `parentName?`, `details?`)              |
| [packages/big-advancedsearch/src/env/glsp-server/advancedsearch.handler.ts](packages/big-advancedsearch/src/env/glsp-server/advancedsearch.handler.ts)                   | Server-side handler: parses `Type:Pattern` queries, runs matchers, deduplicates results |
| [packages/big-advancedsearch/src/env/glsp-server/matchers/classmatcher.ts](packages/big-advancedsearch/src/env/glsp-server/matchers/classmatcher.ts)                     | Only fully implemented matcher — handles 25+ class diagram element types                |
| [packages/big-advancedsearch/src/env/glsp-server/matchers/IMatcher.ts](packages/big-advancedsearch/src/env/glsp-server/matchers/IMatcher.ts)                             | `IMatcher` interface that all diagram matchers implement                                |
| [packages/big-advancedsearch/src/env/browser/advancedsearch.component.tsx](packages/big-advancedsearch/src/env/browser/advancedsearch.component.tsx)                     | React webview UI — search input, result list, click-to-highlight                        |
| [packages/big-advancedsearch/src/env/vscode/advancedsearch.webview-view-provider.ts](packages/big-advancedsearch/src/env/vscode/advancedsearch.webview-view-provider.ts) | VSCode webview provider with caching and lifecycle hooks                                |

**Current query syntax:**

| Format         | Example      | Behaviour                                                   |
| -------------- | ------------ | ----------------------------------------------------------- |
| `Type:Pattern` | `Class:User` | Filter by type, then substring-match on name/details/parent |
| `Type:`        | `Property:`  | Return all elements of that type                            |
| `Pattern`      | `account`    | Untyped search across all diagram types                     |

**Current limitations:**

- No replace functionality
- No regex or boolean operators
- Results are text-only (no visual preview)

### 4.2 SVG Rendering — `big-minimap` + `big-revision-management`

The revision management package already renders diagram snapshots as SVG inside a webview. It delegates entirely to the minimap exporter.

**SVG export flow:**

```
VSCode Extension Host
  │  sendActionToActiveClient(RequestMinimapExportSvgAction)
  ▼
GLSP Client (browser webview)
  │  MinimapExportSvgCommand.execute()
  │    → clears selection, resets zoom/scroll
  │  MinimapExportSvgPostprocessor.postUpdate()
  │    → triggers MinimapGLSPSvgExporter.export()
  │      → finds Sprotty <svg> in hidden div
  │      → XMLSerializer.serializeToString()
  │      → copies computed styles into iframe
  │      → inlines all CSS properties
  │      → calculates bounds via getBBox()
  │      → dispatches MinimapExportSvgAction { svg, bounds }
  ▼
VSCode Extension Host receives SVG string + bounds
  │  stores / forwards to webview
  ▼
React webview renders via:
  <svg viewBox="0 0 {width} {height}">
    <g dangerouslySetInnerHTML={{ __html: svgString }} />
  </svg>
```

**Key files to study:**

| File                                                                                                                                                                     | What it does                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| [packages/big-minimap/src/env/glsp-client/minimap.handler.ts](packages/big-minimap/src/env/glsp-client/minimap.handler.ts)                                               | `MinimapGLSPSvgExporter` — the actual SVG serialization & style inlining |
| [packages/big-minimap/src/env/common/minimap.action.ts](packages/big-minimap/src/env/common/minimap.action.ts)                                                           | `RequestMinimapExportSvgAction` / `MinimapExportSvgAction` definitions   |
| [packages/big-revision-management/src/env/vscode/revision-management.service.ts](packages/big-revision-management/src/env/vscode/revision-management.service.ts)         | How revision management requests SVG and stores it per snapshot          |
| [packages/big-revision-management/src/env/browser/revision-management.component.tsx](packages/big-revision-management/src/env/browser/revision-management.component.tsx) | How the SVG is rendered with `dangerouslySetInnerHTML` inside `<svg>`    |

### 4.3 Label Editing & Model Mutation

Understanding how labels are changed is essential for implementing replace functionality.

**Label edit flow:**

```
User double-clicks label in diagram
  ▼
ApplyLabelEditOperation { labelId, text }
  ▼
GenericLabelEditOperationHandler
  │  resolves semantic element ID from label ID
  │  finds JSON path via DiagramModelIndex.findPath()
  │  builds JSON patch: [{ op: 'replace', path: '/diagram/.../name', value: 'NewText' }]
  ▼
ModelPatchCommand.execute()
  │  DiagramModelState.sendModelPatch(patchString)
  ▼
Model Server (JSON-RPC on port 5999)
  │  PatchManager.applyPatch() — RFC 6902
  │  records undo/redo snapshot
  ▼
Updated AST returned → GModel regenerated → diagram updated
```

**Key files to study:**

| File                                                                                                                                                                                                     | What it does                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [packages/uml-glsp-server/src/env/vscode/features/labeledit/generic-label-edit-operation-handler.ts](packages/uml-glsp-server/src/env/vscode/features/labeledit/generic-label-edit-operation-handler.ts) | Handles `ApplyLabelEditOperation`, builds JSON patches for name changes                                        |
| [packages/uml-glsp-server/src/env/vscode/features/command/model-patch-command.ts](packages/uml-glsp-server/src/env/vscode/features/command/model-patch-command.ts)                                       | `ModelPatchCommand` — wraps patch execution                                                                    |
| [packages/uml-glsp-server/src/env/vscode/features/model/diagram-model-state.ts](packages/uml-glsp-server/src/env/vscode/features/model/diagram-model-state.ts)                                           | `sendModelPatch()`, `undo()`, `redo()` — the model mutation API                                                |
| [packages/uml-glsp-server/src/env/vscode/features/model/diagram-model-index.ts](packages/uml-glsp-server/src/env/vscode/features/model/diagram-model-index.ts)                                           | `findPath(id)` — resolves semantic element ID → JSON pointer; `findSemanticElement(id)` — resolves to AST node |
| [packages/uml-model-server/src/env/langium-connector/model-service.ts](packages/uml-model-server/src/env/langium-connector/model-service.ts)                                                             | `ModelService.patch()` — the RPC facade                                                                        |
| [packages/uml-model-server/src/env/langium-connector/patch/patch-manager.ts](packages/uml-model-server/src/env/langium-connector/patch/patch-manager.ts)                                                 | RFC 6902 patch application with undo/redo history                                                              |

### 4.4 GLSP Client — Diagram Rendering

The GLSP client renders all UML elements as SVG using Sprotty views.

**Key files to study:**

| File                                                                                                                                                                         | What it does                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [packages/uml-glsp-client/src/env/browser/uml-glsp.module.ts](packages/uml-glsp-client/src/env/browser/uml-glsp.module.ts)                                                   | Creates the GLSP diagram container with all feature modules    |
| [packages/uml-glsp-client/src/env/browser/uml/views/uml-label.view.tsx](packages/uml-glsp-client/src/env/browser/uml/views/uml-label.view.tsx)                               | `GEditableLabelView` — renders labels as `<text>` elements     |
| [packages/uml-glsp-client/src/env/browser/views/processors/feedback.postprocessor.tsx](packages/uml-glsp-client/src/env/browser/views/processors/feedback.postprocessor.tsx) | Selection feedback — adds `<rect>` border on selected elements |
| [packages/uml-glsp-client/css/base/node.css](packages/uml-glsp-client/css/base/node.css)                                                                                     | `.selected` (stroke-width: 3) and `.mouseover` CSS classes     |

---

## 5. Architecture Reference

### Environment Model (How Code Is Split)

Every package contributes to up to four runtime processes. Code is split by folder:

| Folder                 | Runtime                   | Use for search & replace                              |
| ---------------------- | ------------------------- | ----------------------------------------------------- |
| `src/env/common/`      | Shared                    | Action/protocol definitions, `SearchResult` interface |
| `src/env/glsp-server/` | Node.js (server process)  | Query parsing, matching, replace patch construction   |
| `src/env/glsp-client/` | Browser (diagram webview) | Highlight feedback, SVG export triggers               |
| `src/env/vscode/`      | Node.js (extension host)  | Webview provider, action routing, caching             |
| `src/env/browser/`     | Browser (search webview)  | React UI components                                   |

See [docs/architecture-overview.md](docs/architecture-overview.md) for the full environment model.

### GLSP Action Registration

New actions must be registered in the correct module:

1. **Server-side handler:** Add to `AdvancedSearchDiagramFeatureModule.configureActionHandlers()` in [advancedsearch.module.ts](packages/big-advancedsearch/src/env/glsp-server/advancedsearch.module.ts)
2. **Client-side propagation:** Add response action kinds to `advancedSearchModule` in [glsp-client/advancedsearch.module.ts](packages/big-advancedsearch/src/env/glsp-client/advancedsearch.module.ts) as `ExtensionActionKind`
3. **Server main:** The module is already loaded in [server.main.ts](application/vscode/src/server.main.ts) via `advancedSearchGlspModule`

### Model Mutation Pipeline

```
Action → ActionHandler → ModelPatchCommand → DiagramModelState.sendModelPatch()
  → ModelService.patch() (JSON-RPC) → PatchManager.applyPatch() (RFC 6902)
  → undo/redo recorded → AST updated → GModel regenerated
```

The `DiagramModelIndex` provides two critical methods:

- `findPath(semanticId)` → JSON pointer (e.g., `/diagram/entities/0/name`)
- `findSemanticElement(semanticId)` → the actual AST node

---

## 6. Suggested Implementation Order

### Phase 1: SVG Preview (Foundation)

1. Study how `big-revision-management` requests and displays SVG (see §4.2)
2. Extend `SearchResult` with optional `svg` and `bounds` fields
3. In `AdvancedSearchWebviewViewProvider`, request SVG export after receiving search results
4. In the React component, parse the exported SVG and extract per-element subtrees
5. Render inline SVG previews per search result

### Phase 2: Enhanced Diagram Highlighting

1. Add a GLSP client-side `VNodePostprocessor` that applies `.search-match` CSS to matched elements
2. Add CSS styles for search highlights (distinct from selection)
3. Add a "dim unmatched" mode that reduces opacity of non-matching elements
4. Integrate with `FitToScreenAction` to zoom to matched elements

### Phase 3: Replace Functionality

1. Define `RequestReplaceAction` and `ReplaceActionResponse` in `src/env/common/`
2. Implement `ReplaceActionHandler` on the GLSP server using batch JSON patches
3. Extend the React UI with replace input, per-result preview, and Replace All
4. Test undo/redo behavior (single undo should revert all replacements)

### Phase 4: Structured Query Language

1. Survey existing model query approaches (see §2 research topics)
2. Design a query grammar that extends the current `Type:Pattern` syntax
3. Implement a parser (Chevrotain or recursive-descent)
4. Extend matchers to support property and relationship queries
5. Add autocomplete/suggestions in the search UI based on the current model

---

## 7. Related Documentation

| Document                                                                                    | Relevance                                                     |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [docs/architecture-overview.md](docs/architecture-overview.md)                              | System-wide architecture, startup sequence, environment model |
| [docs/glsp-server-architecture.md](docs/glsp-server-architecture.md)                        | GLSP server internals, operation handlers, command execution  |
| [docs/model-server.md](docs/model-server.md)                                                | JSON-RPC model server, patch protocol, undo/redo              |
| [docs/guides/glsp-server-feature-modules.md](docs/guides/glsp-server-feature-modules.md)    | How to create and register `DiagramFeatureModule`             |
| [docs/guides/webview-registration.md](docs/guides/webview-registration.md)                  | How webviews are registered, messaged, and bundled            |
| [Eclipse GLSP Documentation](https://eclipse.dev/glsp/documentation/)                       | Upstream GLSP framework docs                                  |
| [Sprotty Documentation](https://github.com/eclipse-sprotty/sprotty)                         | Diagram rendering framework used by GLSP client               |
| [big-advancedsearch/SUBMISSION_README.md](packages/big-advancedsearch/SUBMISSION_README.md) | Original advanced search feature documentation                |

---

## 8. Literature Pointers (Model Search & Query)

- Bergmann, G. et al. — _Incremental Evaluation of Model Queries over EMF Models_ (MODELS 2010) — Foundation for incremental model query; relevant for understanding pattern-based model search
- Varró, D. et al. — _VIATRA: A Reactive Model Transformation Platform_ — Graph pattern-based model queries with incremental evaluation
- Kolovos, D. et al. — _The Epsilon Object Language (EOL)_ — Model query and management language; comparison point for query syntax design
- OMG — _Object Constraint Language (OCL) Specification_ — The standard for UML model constraints and queries
- Ujhelyi, Z. et al. — _EMF-IncQuery: An integrated development environment for live model queries_ (Science of Computer Programming, 2015)
- Szárnyas, G. et al. — _The Train Benchmark: Cross-technology performance evaluation of continuous model queries_ — Benchmark for comparing model query approaches
