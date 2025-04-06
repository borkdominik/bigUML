# Revision Management


To test, remove `false` in the `when` within `application/vscode/package.json`:

```json
{
    "id": "bigUML.panel.revision-management",
    "name": "Revision Management",
    "type": "webview",
    "when": "bigUML.isRunning && false"
}
```

Then run `npm install` and `npm run build` to update npm.

Don't forget to register the modules within `glsp-client` and `vscode`.
