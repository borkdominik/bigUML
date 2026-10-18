# Research: Extended Capabilities for `@biguml`

**Ticket:** [#9](https://github.com/AdvancedModelEngineeringSS26/biguml-interview-agent/issues/9) · **Branch:** `feature/9_chat_references`

Three extensions prototyped end-to-end, three documented as scoped-but-not-built.

## Prototyped

### 1. Chat references (`#file:`, `#selection`)

The agent reads referenced files/selections and uses their content.

- Code: [interview-agent.participant.ts](../src/env/vscode/interview-agent.participant.ts) — `buildReferenceMessages`, `resolveReferenceContent`
- Handles `vscode.Uri` (from `#file:`), `vscode.Location` (from `#selection`), and `string` values
- Capped at 30 000 chars with a truncation marker
- Failed reads produce an inline error message instead of crashing the turn

Gotchas found:
- `ChatPromptReference` has no `name` field — only `id`. Several online examples use `ref.name`; it compiles silently because `value` is `unknown`.
- Typing `#file:foo.uml` as plain text does nothing — the user must select from the `#` autocomplete dropdown.

### 2. Auto-attach active `.uml` diagram

Implicit context: if a `.uml` is open in the active tab, attach it without requiring `#file:`.

- Code: [interview-agent.participant.ts](../src/env/vscode/interview-agent.participant.ts) — `getActiveUmlUri`, `buildAutoAttachMessages`
- Reads from `vscode.window.tabGroups.activeTabGroup?.activeTab.input` (covers `TabInputCustom` since `.uml` uses a custom editor — `vscode.window.activeTextEditor` returns `undefined` for it)
- Deduped against explicit `#file:` references on `Uri.toString()`
- System prompt tells the model to ignore the auto-attached content for purely conceptual questions

This is the first feature where `@biguml` is materially more capable than plain Copilot, which cannot see custom-editor URIs.

### 3. Configurable model vendor/family

Users can swap the LLM backing the agent.

- Code: [interview-agent.participant.ts](../src/env/vscode/interview-agent.participant.ts) — `selectModel`; settings in [package.json](../../../application/vscode/package.json)
- Settings: `bigUML.ai.modelVendor` (default `copilot`), `bigUML.ai.modelFamily` (default `gpt-4o`)
- Fallback chain: exact match → same vendor → any model
- Footer `_via <vendor>/<family>_` shows which model answered

Available families depend on the Copilot subscription; verified working by switching `gpt-4o` → `gpt-4o-mini`.

## Documented (not prototyped)

### 4. Prompting strategies

Current prompt structure is in [ai.constants.ts](../src/env/common/ai.constants.ts) — single ~80-line system prompt plus per-mode addenda built in `buildSystemMessage`. No A/B comparison conducted.

### 5. Preview / confirmation UX

Blocked by [PR #14](https://github.com/AdvancedModelEngineeringSS26/biguml-interview-agent/pull/14) — there are no diagram-mutating tools to confirm yet. Once that lands, each mutating tool's `prepareInvocation()` can return `LanguageModelToolConfirmationMessages` and VS Code surfaces a confirmation button.

### 6. Inline chat integration

VS Code's inline chat is wired for text editors, not custom editors. `.uml` opens in the GLSP custom editor, so the standard trigger does not apply. Either register a custom command that opens the regular chat with element context preloaded, or wait for VS Code to support inline chat in custom editors. Deferred.

## Commits

| SHA | Message |
|---|---|
| `5e44161` | feat: resolve #file and #selection chat references into LM context (#9) |
| `d311ba8` | fix: use ref.id instead of nonexistent ref.name on ChatPromptReference |
| `51a8be4` | feat: auto-attach active .uml editor as implicit context (#9) |
| `7710690` | feat: configurable model vendor/family with fallback (#9) |
