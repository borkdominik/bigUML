# Hello World!

To test, remove `false` in the `when` within `application/vscode/package.json`:

```json
{
    "id": "bigUML.panel.hello-world",
    "name": "Hello World",
    "type": "webview",
    "when": "bigUML.isRunning && false"
}
```

This is a sample package, that you can copy to create new features!
Please update all instances where `Hello` / `World` / `hello-world` comes up.
Then run `npm install` and `npm run build` to update npm.

Don't forget to register the modules within `glsp-client` and `vscode`.
