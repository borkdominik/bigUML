# Code to Class Diagram

**Authors:** Dragana Sunaric, Alexander Glück, Thomas Czech

## Introduction

The "Code To Class Diagram" feature allows developers to generate bigUML Class Diagrams automatically from existing source code. By selecting a starting folder, the extension scans traverses through the folder and builds a corresponding UML class diagram.

This feature works in the opposite direction of our existing Code Generation functionality. Instead of generating code from diagrams, it imports code and creates diagrams from it. The functionality is accessible through a React-based UI embedded in a VS Code webview, where users can trigger the import and select the language which should be scanned for.

Internally, the extension uses the tool tree-sitter to analyze the code and maps them into an intermediate model. This intermediate Model is then used to add elements to an open diagram using operations like *CreateNodeOperation* and *CreateEdgeOperation*.

The following sections describe how the feature works, how it integrates with the rest of the extension, and some ideas for future improvements.

## Motivation

The goal of this project is to traverse source code folders of a software project—initially supporting one programming language—and automatically generate a corresponding UML Class Diagram. The approach is designed to be generic and extensible, enabling easy addition of support for other programming languages in the future.

## Functionality

The feature starts by letting the user select a folder containing source code. Once a folder is chosen, the tool scans the directory to count how many files match the currently selected programming language. The user can change this language selection if desired, allowing flexibility in analyzing different codebases. After confirming the folder and language, the user simply clicks the Generate button to trigger the creation of the UML class diagram based on the analyzed source files.

## Implementation

The Code-to-Class Diagram feature is implemented as a multi-layered architecture that integrates with the bigUML ecosystem. The implementation consists of several key components working together to provide a seamless user experience.

### Architecture Overview

The feature follows a modular architecture with clear separation of concerns:

- **Common Layer** (`src/common/`): Defines action protocols for communication between components
- **Browser Layer** (`src/browser/`): React-based UI components for the webview interface
- **VSCode Layer** (`src/vscode/`): Core business logic and VSCode integration
- **GLSP Client Layer** (`src/glsp-client/`): Integration with the GLSP diagram editor
- **Language-Specific Parsers** (`src/vscode/java/`): Tree-sitter based parsers for different languages

### Communication Flow

The feature uses a request-response pattern for communication between the UI and the backend:

1. **User Interface**: React component in VSCode webview
2. **Action Protocol**: TypeScript interfaces defining request/response actions
3. **VSCode Handler**: Processes actions and manages file system operations
4. **Language Parser**: Tree-sitter based parsing for specific languages
5. **Diagram Generation**: Creates UML elements using GLSP operations

### Action Protocol

The communication is handled through a custom action protocol defined in `src/common/code-to-class-diagram.action.ts`:

- `RequestSelectFolderAction`: Triggers folder selection dialog
- `RequestChangeLanguageAction`: Changes the target programming language
- `GenerateDiagramRequestAction`: Initiates diagram generation
- Response actions provide feedback to the UI

### Integration with bigUML

The feature integrates seamlessly with the existing bigUML infrastructure:

- **GLSP Operations**: Uses `CreateNodeOperation` and `CreateEdgeOperation` to add elements to diagrams
- **Batch Operations**: Groups multiple operations for efficient diagram updates
- **Model State**: Integrates with the GLSP server model state for persistence
- **VSCode Context**: Leverages VSCode's extension API for file system access

To extract meaningful UML information from Java source code, we first traverse the selected folder and parse each file using Tree-sitter. Tree-sitter allows us to generate a Concrete Syntax Tree (CST) that accurately reflects the structure of the code. From the CST, we extract relevant elements such as classes, methods, and inheritance relationships, which we then map to a custom intermediate model used to generate UML diagrams.

### Example

Consider the following Java class:

```java
abstract class ColoredPoint extends Point {
    void bar() {
        x = 2;
    }
}
```

Using Tree-sitter, this code is parsed into a CST (simplified for readability):

```
(class_declaration
  (modifiers (abstract))
  name: (identifier) "ColoredPoint"
  superclass: (type_identifier) "Point"
  body: 
    (method_declaration
      type: (void)
      name: (identifier) "bar"
      body: 
        (expression_statement
          (assignment_expression
            left: (identifier) "x"
            right: (integer_literal) "2"))))
```

We then map this CST to our intermediate model as follows:

```json
{
  "nodes": [
    {
      "id": "ColoredPoint",
      "name": "ColoredPoint",
      "type": "AbstractClass",
      "properties": [],
      "operations": [
        {
          "name": "bar",
          "type": "void",
          "accessModifier": "", 
          "attributes": []
        }
      ],
      "enumerationLiterals": [], 
      "comment": ""
    },
    {
      "id": "Point",
      "name": "Point",
      "type": "Class",
      "properties": [], 
      "operations": [], 
      "enumerationLiterals": [], 
      "comment": ""
    }
  ],
  "edges": [
    {
      "type": "Generalization",
      "fromId": "ColoredPoint",
      "toId": "Point",
      "label": "extends"
    }
  ]
}
```

### Intermediate Model

The feature uses a custom intermediate model (`src/vscode/intermediate-model.ts`) that serves as a language-agnostic representation of UML elements:

```typescript
type Diagram = {
    edges: Edge[];
    nodes: Node[];
};

type Node = {
    id: string;
    name: string;
    type: 'AbstractClass' | 'Class' | 'DataType' | 'Enumeration' | 'Interface' | 'PrimitiveType' | 'Package';
    properties: Property[];
    operations: Operation[];
    enumerationLiterals: string[];
    comment: string;
};

type Edge = {
    type: 'Generalization' | 'Realization' | 'Aggregation' | 'Composition' | 'Association' | /* ... */;
    fromId: string;
    toId: string;
    label: string;
    sourceMultiplicity?: Multiplicity;
    targetMultiplicity?: Multiplicity;
};
```

This intermediate model provides several benefits:
- **Language Independence**: The same model can represent UML elements from different programming languages
- **Type Safety**: Strongly typed interfaces ensure consistency across the codebase
- **Extensibility**: New UML element types can be easily added to the model
- **Serialization**: The model can be easily serialized for communication between components

### Extensibility Framework

The architecture is designed for easy extension to new programming languages:

1. **Language Detection**: The system uses a language parameter to determine which parser to use
2. **Parser Interface**: Each language implements the same parsing interface
3. **Action Protocol**: Language-specific actions can be added to the protocol
4. **UI Integration**: The webview can be extended to support language-specific options

Current language support includes:
- **Java**: Fully implemented with comprehensive UML relationship detection
- **Python**: Framework prepared (commented as `//EXT-LANGUAGE-TODO`)

### Relationship Classification Logic

The parser uses specific heuristics to determine the type of relationship between classes:

#### Aggregation vs Composition
The distinction between aggregation and composition is based on access modifiers and parameter passing analysis:

- **Composition** is detected when:
  - The property has private or protected access (`private` or `protected`)
  - The property is NOT passed as a parameter to any method or constructor
  - This indicates a "part-of" relationship where the contained object's lifecycle is tightly coupled to the container

- **Aggregation** is detected when:
  - The property has private or protected access (`private` or `protected`)
  - The property IS passed as a parameter to methods or constructors
  - This indicates a "has-a" relationship where the contained object can exist independently

- **Association** is detected when:
  - The property has public access (`public`)
  - This indicates a looser coupling where the relationship is more explicit

#### Multiplicity Detection
The parser also determines multiplicity based on the property type:

- **Collection types** (e.g., `List<T>`, `Set<T>`, arrays `T[]`) are assigned multiplicity `0..*` (many)
- **Non-collection types** are assigned multiplicity `1..1` (one)

#### Example Classification
```java
class SmartHomeController {
    private List<Device> devices;        // Aggregation (0..*)
    private final Room room;             // Composition (1..1)
    public Device currentDevice;         // Association (1..1)
}
```

## Testing the Application

To ensure the accuracy and reliability of the Java code-to-UML class diagram conversion, we implemented a comprehensive unit test suite focused on detecting various UML relationships. The tests are based on a cohesive **Smart Home System** domain, using mock Java files that represent common object-oriented constructs and relationships.

### Test Workflow

The test workflow begins with a set of mock Java files that define various structural elements such as classes, interfaces, and object references. These mocks intentionally model object-oriented features like inheritance, interface implementation, aggregation, and composition. For each test case, a subset of these mock files is passed through the transformation pipeline to generate a corresponding UML class diagram.

Each test then verifies whether the resulting diagram includes the correct UML edges between elements—checking for accurate detection of generalizations, realizations, aggregations, and compositions. The test suite validates current functionality and ensures that all expected relationships are correctly detected.

### Key Aspects Tested

The tests focus on a range of critical UML relationships:

- **Inheritance:** Tests verify detection of single and multiple class inheritance via the `extends` keyword.
- **Interface Realization:** The system is evaluated for correctly identifying when a class implements one or more interfaces using the `implements` keyword.
- **Aggregation Relationships:** Both collection and non-collection aggregation relationships are tested (e.g., `private Device device;` and `private List<Device> devices;`).
- **Composition Relationships:** Both collection and non-collection composition relationships are tested (e.g., `private final Room room;` and `private final List<Room> rooms;`).

### Test Implementation

All tests are implemented in TypeScript and make use of a set of helper functions. These helpers automate the process of generating UML diagrams from specific mock file combinations and allow for precise assertions on the presence or absence of UML edges. A typical test checks for the existence of an edge between two elements with a specific relationship type (e.g., `Generalization`, `Realization`, `Aggregation`, or `Composition`).

The test suite is integrated into the development workflow via npm scripts and can be executed using either `npm test` for one-off test runs or `npm run test:watch` for continuous testing during development. This setup ensures that any changes to the transformation logic are immediately validated against a well-defined baseline of expected behavior.

### Test Coverage

The test suite covers 7 specific UML relationship scenarios:

1. **Inheritance (Generalization):** Tests detection of class inheritance via the `extends` keyword
2. **Single Interface Realization:** Tests detection of single interface implementation
3. **Multiple Interface Realization:** Tests detection of multiple interface implementations
4. **Non-Collection Aggregation:** Tests detection of simple object references as aggregation
5. **Collection Aggregation:** Tests detection of collection relationships as aggregation
6. **Non-Collection Composition:** Tests detection of final object references as composition
7. **Collection Composition:** Tests detection of final collection relationships as composition

### Example Test Snippet

```javascript
it('should detect inheritance', async () => {
  const diagram = await generateDiagram(['Device.java', 'Light.java', 'TemperatureSensor.java']);
  const edge1 = findEdge(diagram, 'Light', 'Device', 'Generalization');
  const edge2 = findEdge(diagram, 'TemperatureSensor', 'Device', 'Generalization');
  expect(edge1).toBeDefined();
  expect(edge2).toBeDefined();
});
```

### Test Results

All tests are currently **passing**, indicating that the Java parser correctly:
- Detects class inheritance (`extends`)
- Detects interface implementation (`implements`)
- Distinguishes between aggregation and composition based on access modifiers and parameter passing
- Handles both collection and non-collection relationships
- Properly extracts type information from generic collections
- Generates correct UML edge types and multiplicities

## Extensibility to other Languages

Tree-sitter is a fast and powerful parser generator that produces concrete syntax trees (CSTs) from source code in various programming languages. It provides a consistent, language-agnostic API for querying and traversing syntax trees, making it easy to extract structural elements like classes, methods, and fields. Using Tree-sitter is a smart choice for this feature because it cleanly separates parsing logic from language-specific syntax. This means we can add support for different languages by simply swapping in a new Tree-sitter grammar and implementing language-specific parsing rules.

Adding support for a new language requires minimal effort:

- First, a new .wasm file (Tree-sitter compiled grammar) for the target language must be created or obtained.
- Then, customized logic should be implemented to interpret the CST nodes according to that language's syntax and semantics, which includes creating the appropriate Nodes, Properties, Edges, and other elements in the intermediate model.

## Open Issues

### Multiplicities

One current limitation of the feature is how it handles multiplicities. While multiplicity information (e.g., one-to-many, many-to-many) is correctly extracted and stored in the intermediate model during code analysis, it is not yet reflected in the generated UML diagram. As a result, associations between classes are shown, but without details about how many instances are involved on either side of the relationship.

### Diagram Layout and Positioning

Currently, UML elements in the generated diagram are positioned one below the other in a vertical stack. For larger diagrams, this makes classes and relationships difficult to interpret, requiring manual repositioning by the user. A more user-friendly solution would involve implementing an automatic layout algorithm that considers spatial relationships, groupings, and edge crossings to produce a cleaner and more readable diagram. However, designing and integrating a proper graph layout engine would be out of scope for this project and could be considered a valuable standalone project on its own.

## Next Steps

A natural next step is to release this feature as part of the bigUML Toolkit, making it available to a wider audience. In addition, expand language support beyond Java, starting with popular languages like Python and TypeScript would also be a good next step. This will make the feature more versatile and useful across different types of projects and development environments. 