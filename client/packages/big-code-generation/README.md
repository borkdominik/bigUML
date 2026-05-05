# Java Code Generation from UML Diagrams

We designed and implemented a code generation feature based on class diagrams within the bigUML extension of Visual Studio Code (VSCode).
The goal was to enable automatic code generation in at least one programming language - in our case Java - directly from a user-specified class diagram.
This involved translating the structure of the diagram, including its classes, attributes, methods, and relationships, into syntactically correct source code.

To achieve this, we developed a new webview interface using React and the VSCode UI Toolkit, allowing users to trigger the export of code from an active editor class diagram.
The Extension leverages the ExperimentalGLSPServerModelState to access and process the diagram's source model.

Additionally, we explored extending the user interface with language specific options (e.g. single/multiple file generation).

## Survey of Existing Tools

Before developing our solution, we conducted a systematic survey of existing open-source and commercial tools for code generation from UML diagrams.
Our survey focused on software that supports UML-based modeling and code generation for Java.
The following table summarizes the main tools we evaluated, including their input formats, supported target languages, underlying code generation libraries, license models, and maintenance status.

| Name                                    | Input Format                                 | supported languages                                                                                                                                                                                                                                                                                          | Library                                           | Licence                             | Actively Maintained |
| --------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- | ----------------------------------- | ------------------- |
| **Eclipse Papyrus** (Software Designer) | - UML 2 XMI (Eclipse UML2)                   | - Java<br>- C++                                                                                                                                                                                                                                                                                              | EMF/UML2                                          | OpenSource (EPL)                    | yes                 |
| **Obeo UML Designer**                   | - UML 2 XMI (Eclipse UML2)                   | - Java                                                                                                                                                                                                                                                                                                       | Acceleo Template Engine                           | OpenSource (EPL)                    | yes                 |
| **Modelio**                             | - UML 2 XMI<br>- Modelio-Projekte            | - Java<br>- C++<br>- C#<br>- SQL                                                                                                                                                                                                                                                                             | N/A                                               | OpenSource (GPL)                    | yes                 |
| **BOUML**                               | - UML 2 XMI (1.2/2.1 Import/Export)          | - C++<br>- IDL<br>- Java<br>- PHP<br>- Python                                                                                                                                                                                                                                                                | Custom C++ Code                                   | OpenSource (GPL)                    | yes                 |
| **Umbrello**                            | - UML 2 XMI<br>- Umbrello-Format             | - ActipnScript<br>- Ada<br>- C++<br>- C#<br>- D<br>- IDL<br>- Java<br>- JavaScript<br>- MySQL<br>- Pascal<br>- Perl<br>- PHP<br>- PHP5<br>- PostgreSQL<br>- Python<br>- Ruby<br>- TCL<br>- Vala<br>- XMLSchema                                                                                               | Custom C++ Code                                   | OpenSource (GPL)                    | yes                 |
| **Enterprise Architect**                | - EA-Projekt<br>- UNL 2 XMI                  | - Action Script<br>- Ada<br>- ArcGIS<br>- C<br>- C# (for .NET 1.1, .NET 2.0 and .NET 4.0)<br>- C++ (standard and .NET managed C++ extensions)<br>- Delphi<br>- Java<br>- JavaScript<br>- mFQL<br>- MySQL<br>- PHP<br>- Python<br>- Teradata SQL<br>- Visual Basic<br>- Visual Basic .Net<br>- WorkFlowScript | N/A                                               | Proprietary                         | yes                 |
| **Visual Paradigm**                     | - VP-Projekt<br>- UML 2 XMI                  | - Java<br>- C#<br>- C++<br>- Python<br>- PHP<br>- Hibernate<br>- Ruby<br>- Visual Basic .NET<br>- .NET dll or exe<br>- ODL<br>- ActionScript<br>- IDL<br>- Delphi<br>- Perl<br>- XML<br>- XML Schema<br>- Objective-C 2.0<br>- Ada95                                                                         | N/A                                               | Proprietary                         | yes                 |
| **StarUML (v5)**                        | - StarUML (.mdj)<br>- UML 2 XMI (via Plugin) | - Java<br>- C#<br>- C++<br>- Python                                                                                                                                                                                                                                                                          | N/A                                               | Proprietary (previously OpenSource) | yes                 |
| puml2code                               | PlantUML                                     | - CoffeeScript<br>- C#<br>- C++<br>- ECMAScript5<br>- ECMAScript6<br>- Java<br>- PHP<br>- Python<br>- Typescript                                                                                                                                                                                             | Custom Javascript with Handlebars template engine | OpenSource (MIT)                    | no                  |

Based on our project requirements and constraints, we established the following criteria for selecting a code generation solution:

1. **License Model:**
    Proprietary solutions were excluded due to licensing restrictions.
2. **Minimizing External Dependencies:**
    Solutions requiring an additional background service or complex bridging (such as running a separate server or integrating with Eclipse-based toolchains) should be avoided.
3. **Flexibility and Extensibility:**
    The chosen approach should allow for easy adaptation to evolving project needs, including the ability to support new target languages or custom code templates.

Applying these criteria, we found that none of the existing tools provided the required combination of open licensing, ease of integration with VSCode, and extensibility. Thus, we decided to use an available open-source templating-engine written in Typescript and build our extension around it.

We found that the Handlebars templating-engine to be sufficient for our project and with it we allow end users to supply their own templates, making it possible to tailor code generation to organization-specific coding standards or project conventions with minimal effort.

## How it works

The code generation feature is presented to the user via a custom webview in VSCode.
This webview offers a graphical interface for configuring an dinitiating code generation.
The main component involved are the `CodeGeneration`-component (`code-generation.component.tsx`) and the language-specific configuration component, such as `JavaCodeGenerationConfig` (`config-java.component.tsx`). By separating language-specific options, we enable greater scalability for future language support.

The 'Generate' button is disabled by default and only becomes active once all required selections (currently only the output folder is required) are made. Clicking this button starts the code generation process.

For model parsing, we reuse the UML parser from bigUML, operating directly on the provided JSON data.
The raw UML model retrieved from `ExperimentalGLSPServerModelState` encodes type relationships using unique IDs (e.g., for attribute types, base classes, or associations).
This reference style complicates template-based code generation, as templates would otherwise need to resolve these IDs dynamically.

To address this, we transform the original model into an intermediate representation (IR).
During this transformation, all type references by ID are replaced with explicit type names.
This IR abstracts away UML-specific details and presents a simplified, consistent data structure for template processing.

The IR is then passed to the embedded Handlebars template engine, which uses either predefined language specific or user-supplied templates to generate source code.
This architecture enables high flexibility: switching output language or coding style is simply a matter of selecting a different template.

Finally, the generated code files are written to the user's project directory - either as one file per class (e.g., `ClassName.java`) or as a single aggregate file (e.g., `output.java`), depending on user selection.

### Template Format

The core of our code generation mechanism relies on Handlebars templates.
A template is a text file ending with `.hbs`.
It defines the structure and syntax of the output source code, with placeholders and logic for injecting diagram data.

Note that for the capability to generate a single source code file in the current implementation all cases need to be handled in a single file.

A basic Handlebars template for generating a Java class might look like this:

```handlebars
{{#if (isPackagePrivateModifier visibility)}}{{else}}{{visibility}} {{/if}}class {{name}} {

{{#each ownedAttribute}}
    private {{type.name}} {{name}};
{{/each}}

{{#each ownedOperation}}
    public {{returnType ownedParameter}} {{name}}({{#each (parameters ownedParameter)}}{{type.name}} {{name}}{{#if @last}}{{else}},{{/if}}{{/each}}) {
	    // method body
    }
{{/each}}
}
```

- `{{name}}` is replaced with the class name.
- `{{#each ownedAttribute}} ... {{/each}}` loops through class attributes.
- `{{type}}` and `{{name}}` inside the block refer to each attribute's type and name.
- Helpers like `returnType` and `parameters` (described below) allow more advanced logic inside the template.

### Custom Helpers
Currently following Helpers are available

- **isdefined**
	Checks if a value is defined (not `undefined`).  
	Usage:
	```handlebars
	{{#if (isdefined name)}} ... {{/if}}
	```

- **isClass**, **isInterface**, **isEnumeration**
    Determine the UML type of the current element.
	- `isClass` returns true if the element is a UML class.
	- `isInterface` returns true for UML interfaces.
	- `isEnumeration` returns true for UML enumerations.
	Usage:
	```handlebars
	{{#if (isClass this)}} ... {{/if}}
	```

- **isPackagePrivateModifier**
    Checks if a given visibility modifier represents Java's package-private access.
    Usage:
	```handlebars
	{{#if (isPackagePrivateModifier visibility)}} ... {{/if}}
    ```

- **returnType**
    Returns the first name of the return type of a method.
    Usage:
    ```handlebars
    public {{returnType ownedParameter}} foo(...) { ... }
    ```

- **parameters**
    Filters out parameters with the `direction: 'return'` property, returning only method arguments.
    Usage:
    ```handlebars
    ({{#each (parameters ownedParameter)}}{{type.name}} {{name}}{{#if @last}}{{else}},{{/if}}{{/each}})
    ```

#### Registering and Using Custom Helpers
Helpers are registered globally with Handlebars, and can be found [here](src/vscode/index.ts)

## Setup Instructions

1. clone the repository
	```bash
	git clone https://github.com/AdvancedModelEngineeringSS25/ame-25-biguml-class-diagram-to-code.git
	cd ame-25-biguml-class-diagram-to-code
	```
2. `npm install`
3. `npm run start:server` to run the glsp server
4. `npm run build` or or `npm run watch` to build the extension
5. Start extension in debug or production mode in the *run and debug* tab inside VSCode

## What parts are missing

Currently the extension remains active even when no class diagram is selected which may lead to unexpected behavior.

## Future Work

- **Support for Additional Languages:**
    Extend code generation to other languages such as Python, C++, and more.
- **Exception Specifications:**
    Implement generation of exception specification on methods and list parameters
- **Automatic Imports/Includes:**
    Enhance template processing to automatically generate necessary import or include statements.

## What problems we encountered

- Exception specification is not visible in the class diagram.
- Only Arrays can be specified as generic Lists are unsupported

## Usage:
![alt text](single-file-code-generation.gif)

![alt text](multiple-file-code-generation.gif)