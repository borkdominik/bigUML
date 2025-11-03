# langium-extensions

The artifacts created within the scope of the master theses of Adam Lencses, David Jäger and Karol Grilling at the Vienna University of Technology.

## Requirements

- `node`: ">=20.18.1",
- `yarn`: ">=1.7.0 <2.x.x"

## Install

To build the shared libraries (generators, model-management-common), model service, Langium model-management generator, and the full bigUML example stack (protocol, GLSP client, components, webview, server, VS Code extension) for the first time, run `./install.sh` from the repo root; the script’s generate step also creates all required generated sources (e.g., Langium outputs, validation, property-palette/outline handlers, defaults...).

### bigUML

Start the bigUML modeling tool by going to the `Run and Debug` VS Code sidebar and run `(bigUML) GLSP VSCode Extension`.

### Metamodel update

To change the metamodel of either examples, open the `def.ts` file in `biguml-server/src/language-server/definition` and make the required changes. After the definition has been updated run the `yarn full-build` command to rebuild the metamodel. By making changes to the metamodel definition it is possible that examples may not work anymore.

### Diagram Type

To change the diagram type the bigUML extension is currently operating on, change the imported diagram module in
`langium-extensions/examples-dj/biguml/packages/biguml-server/src/glsp-server/launch.ts` in line 40.
Currently available options are the PackageDiagramModule and ClassDiagramModule. After change run `yarn full-build`.

## Packages

The `packages` folder contains the created model service, generators (langium-model-management, property-palette and outline) and model management common. To generate a new build run `yarn install` and `yarn full-build` in repo root. 
