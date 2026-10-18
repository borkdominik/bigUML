# big-ai — Development Notes

The Interview Agent (`@biguml` chat participant and its language model tools) is **disabled**. The package is
neither bundled nor activated, and its contributions are hidden.

## Enable the feature

All paths are relative to `client/`.

1. **Load the module** in `application/vscode/src/extension.config.ts`: uncomment the
   `import { aiModule } from '@borkdominik-biguml/big-ai/vscode';` import and the `aiModule()` entry in
   `container.load(...)`.
2. **Show the contributions** in `application/vscode/package.json`: in `contributes.chatParticipants` and every
   entry of `contributes.languageModelTools`, replace `"when": "false"` with
   `"when": "config.bigUML.ai.enabled"`.
3. **Restore the settings** in `application/vscode/package.json` under `contributes.configuration.properties`.
   If `contributes.configuration` does not exist, add it as `{ "title": "bigUML", "properties": { ... } }`:

   ```json
   "bigUML.ai.enabled": {
     "type": "boolean",
     "default": true,
     "description": "Enables the @biguml chat participant and its language model tools. Requires a window reload to take effect."
   },
   "bigUML.ai.modelFamily": {
     "type": "string",
     "default": "",
     "description": "Preferred model family for the @biguml chat participant (e.g. 'gpt-4o', 'claude-3.5-sonnet'). Leave empty to use any available model from the vendor. Falls back to any available model if the requested family is not installed."
   },
   "bigUML.ai.modelVendor": {
     "type": "string",
     "default": "copilot",
     "description": "Vendor for the language model used by the @biguml chat participant (e.g. 'copilot')."
   }
   ```

4. Run `pnpm typecheck`, `pnpm lint` and `pnpm build`, then launch the extension.

## Requirements

- **VS Code 1.95 or newer**: the language model tool API (`vscode.lm.registerTool`, `invokeTool`) is final
  since 1.95. `engines.vscode` in `application/vscode/package.json` and `@types/vscode` in the pnpm catalog
  already require it.
- **A chat model**, e.g. through GitHub Copilot Chat. Do not add Copilot Chat to `extensionDependencies`: VS Code
  would then refuse to activate the whole bigUML extension without it. A missing model is reported when the user
  sends a request.
- Users can turn the feature off with `bigUML.ai.enabled`. It is read on activation, so changing it requires a
  window reload.

## Known limitations

- The tools write `.uml` files directly instead of editing through the model server. An open diagram only
  picks up those changes through the language server's file watcher. Check that an open diagram updates after a
  `/modify` request; the clean fix is to apply the edits as model server patches.
- See [REPORT.md](REPORT.md) for the students' report, and [docs/](docs/) for the original assignment and
  research notes.
