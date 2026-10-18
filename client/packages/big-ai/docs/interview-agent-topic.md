# Interview Agent — AI-Assisted UML Diagram Creation

## Overview

Design and implement an intelligent agent that starts from an initial set of requirements and interactively interviews the user to refine missing information. Based on the structured dialogue, the agent incrementally generates or updates UML diagrams. The agent is exposed as a **VS Code Chat Participant** and lives in a new `big-ai` feature package.

## How to Read This Document

This document is comprehensive — it contains far more detail than you need to absorb at once. Here's what matters:

- **Each feature has a Goal** — that's your target. Work towards the goal.
- **Everything else** (approach options, implementation sketches, code examples, file tables) are **starting points**, not prescriptions. They show one way to solve it. You may find a better way — that's fine.
- **If something is unclear**, ask Copilot to explain it. Seriously, paste the section and ask "what does this mean?" — it's surprisingly good at that.

> **Fair warning:** You could probably paste an entire feature description into Copilot and get a working implementation back. And honestly? That's a fine starting point! But we want **generic, well-structured, and maintainable code** — so you still need to review it, understand it, and fix the parts where Copilot got creative with your architecture. Think of it as a very enthusiastic junior developer that codes fast but doesn't always read the project conventions. 😄

## Table of Contents

1. [Feature: VS Code Chat Participant Agent](#1-feature-vs-code-chat-participant-agent)
2. [Feature: Interview-Driven Diagram Generation](#2-feature-interview-driven-diagram-generation)
3. [Feature: Tool-Based UML File Operations](#3-feature-tool-based-uml-file-operations)
4. [Feature: Research & Extended Capabilities](#4-feature-research--extended-capabilities)
5. [Current Architecture Context](#5-current-architecture-context)
6. [Architecture Reference](#6-architecture-reference)
7. [Related Documentation](#7-related-documentation)

---

## 1. Feature: VS Code Chat Participant Agent

### Goal

Register a Chat Participant (`@biguml`) in VS Code's built-in chat panel that users can invoke to interactively create and modify UML diagrams through conversation.

### Why This Feature Is Needed

Currently, creating a UML diagram in bigUML requires manual, step-by-step work: open a `.uml` file, add each class via the tool palette, type each property/operation, draw each relationship by hand. There is no conversational interface — the user must already know the exact UML elements they want and how to create them.

**Concrete example:** A software engineering student wants to model a simple e-commerce system. Today, they would need to:

1. Create a new `.uml` file
2. Add `Customer`, `Order`, `Product`, `Payment` classes one by one via the palette
3. Manually add properties to each class (`name: String`, `email: String`, `total: Double`, ...)
4. Draw associations (`Customer → Order`, `Order → Product`, ...) and set multiplicities
5. Realize they forgot `ShoppingCart`, go back, add it, re-draw relationships

This is 20+ manual operations for a trivial scenario, and the student must already know correct UML syntax. With a chat participant, they could instead type:

> `@biguml /interview I need a class diagram for an e-commerce system with customers, orders, products, and payments`

The agent asks clarifying questions ("Should `Customer` have an address? Is `Payment` a separate class or an attribute of `Order`?"), and then generates the entire diagram in one step — including relationships, multiplicities, and attributes.

### Background — VS Code Chat API

VS Code exposes a [Chat Extensions API](https://code.visualstudio.com/api/extension-guides/chat) that lets extensions contribute **Chat Participants** — agents that appear in the built-in chat panel (Ctrl+Shift+I). Key concepts:

| Concept              | Description                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Chat Participant** | An agent registered via `vscode.chat.createChatParticipant(id, handler)`. Appears as `@name` in the chat.    |
| **Request Handler**  | Async callback `(request, context, stream, token) => ProviderResult<ChatResult>`. Receives user messages.    |
| **Chat Commands**    | Slash-commands (e.g., `/interview`, `/create`, `/modify`) that scope the agent's behaviour.                  |
| **Chat Tools**       | Functions the agent can invoke (via `vscode.lm.registerTool()`), exposed to the language model for tool-use. |
| **Language Model**   | Access via `vscode.lm.selectChatModels()`. Supports streaming, tool-calling, and structured prompting.       |
| **Chat Context**     | `ChatContext.history` provides previous turns. Use this to maintain interview state across messages.         |
| **Follow-ups**       | Suggested next actions shown as buttons after a response. Guide the interview flow.                          |

### Research Topics (Students)

Before implementing, students should study the following:

1. **VS Code Chat API documentation:**
    - [Chat Extensions Guide](https://code.visualstudio.com/api/extension-guides/chat)
    - [Language Model API Guide](https://code.visualstudio.com/api/extension-guides/language-model)
    - [Chat Tutorial: Code Tutor](https://code.visualstudio.com/api/extension-guides/chat-tutorial)
    - [VS Code Chat API Reference](https://code.visualstudio.com/api/references/vscode-api#chat)

2. **VS Code Chat extension examples:**
    - [vscode-extension-samples/chat-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/chat-sample)
    - Study how chat participants register commands, handle requests, stream responses, and use follow-ups

3. **Language Model Tool API:**
    - [Language Model Tool API](https://code.visualstudio.com/api/extension-guides/language-model#primitives-tool-calling)
    - How tools are declared, how the LM invokes them, and how confirmation flows work
    - Study `vscode.lm.registerTool()` and the `vscode.LanguageModelTool` interface

### Registration in `package.json`

The agent must be declared in `application/vscode/package.json` under the `contributes` section:

```jsonc
{
    "contributes": {
        "chatParticipants": [
            {
                "id": "biguml.interviewAgent",
                "fullName": "bigUML Interview Agent",
                "name": "biguml",
                "description": "Interactively creates and modifies UML diagrams through structured interviews",
                "isSticky": true,
                "commands": [
                    {
                        "name": "interview",
                        "description": "Start an interactive interview to create a new UML diagram"
                    },
                    {
                        "name": "modify",
                        "description": "Modify an existing UML diagram based on requirements"
                    },
                    {
                        "name": "explain",
                        "description": "Explain the current UML diagram structure"
                    }
                ]
            }
        ],
        "languageModelTools": [
            {
                "name": "biguml-create-uml-file",
                "displayName": "Create UML File",
                "modelDescription": "Creates a new empty UML file at the specified path with a given diagram type. Use this when the user wants to start a new diagram.",
                "canBeReferencedInPrompt": false,
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "filePath": { "type": "string", "description": "Workspace-relative path for the new .uml file" },
                        "diagramType": { "type": "string", "enum": ["CLASS"], "description": "The type of UML diagram to create" }
                    },
                    "required": ["filePath", "diagramType"]
                }
            },
            {
                "name": "biguml-read-uml-file",
                "displayName": "Read UML File",
                "modelDescription": "Reads and returns the semantic content of a .uml file as structured JSON. Use this to understand the current state of a diagram before making changes.",
                "canBeReferencedInPrompt": false,
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "filePath": { "type": "string", "description": "Workspace-relative path of the .uml file to read" }
                    },
                    "required": ["filePath"]
                }
            },
            {
                "name": "biguml-add-node",
                "displayName": "Add UML Node",
                "modelDescription": "Adds a new node (e.g., Class, Interface, Enumeration, Package) to an existing UML diagram. Provide the file path, element type, and properties for the new element.",
                "canBeReferencedInPrompt": false,
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "filePath": { "type": "string", "description": "Workspace-relative path of the .uml file" },
                        "elementType": {
                            "type": "string",
                            "description": "UML element type (e.g., Class, Interface, Enumeration, Package)"
                        },
                        "name": { "type": "string", "description": "Name of the new element" },
                        "properties": {
                            "type": "object",
                            "description": "Additional properties for the element (e.g., visibility, isAbstract)"
                        }
                    },
                    "required": ["filePath", "elementType", "name"]
                }
            },
            {
                "name": "biguml-remove-node",
                "displayName": "Remove UML Node",
                "modelDescription": "Removes a node from an existing UML diagram by its name or ID.",
                "canBeReferencedInPrompt": false,
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "filePath": { "type": "string", "description": "Workspace-relative path of the .uml file" },
                        "elementName": { "type": "string", "description": "Name of the element to remove" }
                    },
                    "required": ["filePath", "elementName"]
                }
            }
        ]
    }
}
```

> **Note:** The exact tool schemas above are a starting point. Students should extend them based on their research and implementation needs. Ask Haydar if you need additional model mutation operations.

### Implementation Sketch — Chat Participant Handler

```typescript
// In big-ai/src/env/vscode/interview-agent.participant.ts

import * as vscode from 'vscode';

export class InterviewAgentParticipant {
    private readonly participant: vscode.ChatParticipant;

    constructor(
        private readonly toolInvoker: ToolInvoker // your wrapper around tool execution
    ) {
        this.participant = vscode.chat.createChatParticipant('biguml.interviewAgent', this.handleRequest.bind(this));
        this.participant.iconPath = vscode.Uri.joinPath(/* icon path */);
        this.participant.followupProvider = { provideFollowups: this.provideFollowups.bind(this) };
    }

    private async handleRequest(
        request: vscode.ChatRequest,
        context: vscode.ChatContext,
        stream: vscode.ChatResponseStream,
        token: vscode.CancellationToken
    ): Promise<vscode.ChatResult> {
        // 1. Select a language model
        const [model] = await vscode.lm.selectChatModels({ family: 'gpt-4o' });
        if (!model) {
            stream.markdown('No language model available. Please ensure Copilot is active.');
            return {};
        }

        // 2. Build messages from history + system prompt + current request
        const messages = this.buildMessages(request, context);

        // 3. Send to LM with tool definitions
        const response = await model.sendRequest(
            messages,
            {
                tools: this.getToolDefinitions()
            },
            token
        );

        // 4. Process response stream — handle text and tool calls
        for await (const part of response.stream) {
            if (part instanceof vscode.LanguageModelTextPart) {
                stream.markdown(part.value);
            } else if (part instanceof vscode.LanguageModelToolCallPart) {
                const result = await this.toolInvoker.invoke(part.name, part.input);
                // Feed result back to LM for continued generation
            }
        }

        return {};
    }
}
```

### Files to Create

| File                                                   | Purpose                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| `big-ai/src/env/vscode/interview-agent.participant.ts` | Chat participant handler — request processing, LM interaction |
| `big-ai/src/env/vscode/interview-agent.module.ts`      | `VscodeFeatureModule` — registers participant and tools in DI |
| `big-ai/src/env/vscode/index.ts`                       | Barrel export                                                 |
| `big-ai/src/env/common/index.ts`                       | Shared types and constants (tool names, prompt templates)     |

---

## 2. Feature: Interview-Driven Diagram Generation

### Goal

The agent should not just execute commands — it should conduct a **structured interview** to gather requirements before generating a diagram. The interview asks targeted questions, refines answers, and only generates when enough information has been gathered.

### Why This Feature Is Needed

A naive AI agent that immediately generates a diagram from the first user message produces poor results — it guesses at relationships, invents attributes, and misses domain nuances. The user then spends more time fixing the generated diagram than they would have spent creating it manually.

**Concrete example:** A user types: *"I need a class diagram for a hospital system."*

Without an interview, the agent might generate `Doctor`, `Patient`, `Nurse`, `Room` with generic associations — missing that the user's hospital system specifically tracks `Appointment` scheduling, `MedicalRecord` history, and `Insurance` billing.

With an interview, the interaction looks like:

1. **Agent:** "What are the main entities in your hospital system? For example: patients, doctors, departments, appointments?"
2. **User:** "Patients, doctors, appointments, and medical records. Also insurance info."
3. **Agent:** "Should `Insurance` be a separate class or an attribute of `Patient`? Does a patient have one or multiple insurance plans?"
4. **User:** "Separate class — a patient can have multiple plans."
5. **Agent:** "What attributes does an `Appointment` have? Date, time, status (scheduled/completed/cancelled)?"
6. **User:** "Yes, plus a reference to the treating doctor and a reason field."
7. **Agent:** *presents a summary* → user confirms → diagram is generated with accurate structure

The interview ensures the generated diagram matches the user's actual requirements, not the agent's assumptions. This is especially important for students learning UML, who benefit from the guided questioning process itself.

### Prompting Strategy Research

Students should investigate and compare prompting strategies:

1. **System prompt design:**
    - The system prompt defines the agent's persona, capabilities, and interview methodology
    - It should instruct the LM to ask clarification questions before generating, not to assume
    - Include the UML metamodel context (available element types, relationships) so the LM knows what it can create

2. **Few-shot examples:**
    - Provide example interview transcripts in the system prompt showing the desired behavior:
        - User says "I need a class diagram for a library system"
        - Agent asks: "What are the main entities? (e.g., Book, Member, Loan)"
        - User responds: "Book, Author, Member, and Loan"
        - Agent asks: "What are the relationships between these entities?"
        - Agent eventually generates the diagram
    - Study if few-shot prompting improves the quality of the interview

3. **Structured output:**
    - The LM should produce structured tool calls (not free-form text) when creating elements
    - Investigate JSON-mode or tool-use to enforce structured generation
    - Compare: letting the LM generate `.uml` file text directly vs. using tool calls for each element

4. **Interview phases:**
    - **Phase 1 — Scope:** What kind of diagram? What domain?
    - **Phase 2 — Entities:** What are the main elements? Types/names?
    - **Phase 3 — Relationships:** How do elements relate? Associations, generalizations?
    - **Phase 4 — Details:** Attributes, operations, multiplicities, visibility?
    - **Phase 5 — Confirmation:** Present a summary, ask for approval before generating
    - **Phase 6 — Generation:** Create the diagram using tools
    - **Phase 7 — Refinement:** Allow iterative modifications

### Using Chat Context for State

The VS Code Chat API provides `ChatContext.history` which contains all previous turns. The agent can use this to maintain interview state without external storage:

```typescript
private buildMessages(
    request: vscode.ChatRequest,
    context: vscode.ChatContext
): vscode.LanguageModelChatMessage[] {
    const messages: vscode.LanguageModelChatMessage[] = [];

    // System prompt with interview instructions and UML knowledge
    messages.push(vscode.LanguageModelChatMessage.User(this.getSystemPrompt()));

    // Replay history to maintain interview state
    for (const turn of context.history) {
        if (turn instanceof vscode.ChatRequestTurn) {
            messages.push(vscode.LanguageModelChatMessage.User(turn.prompt));
        } else if (turn instanceof vscode.ChatResponseTurn) {
            const text = turn.response
                .filter((part): part is vscode.ChatResponseMarkdownPart => part instanceof vscode.ChatResponseMarkdownPart)
                .map(part => part.value.value)
                .join('');
            messages.push(vscode.LanguageModelChatMessage.Assistant(text));
        }
    }

    // Current user message
    messages.push(vscode.LanguageModelChatMessage.User(request.prompt));

    return messages;
}
```

### Follow-up Suggestions

Guide the user through the interview with follow-up buttons:

```typescript
private provideFollowups(
    result: vscode.ChatResult,
    context: vscode.ChatContext,
    token: vscode.CancellationToken
): vscode.ChatFollowup[] {
    // Analyze conversation state to suggest next steps
    const turnCount = context.history.length;

    if (turnCount === 0) {
        return [
            { prompt: 'I want to create a class diagram', label: 'New Class Diagram' },
            { prompt: 'Help me model an existing system', label: 'Model Existing System' }
        ];
    }

    // Dynamic follow-ups based on interview phase
    return [
        { prompt: 'Add more entities', label: 'Add Entities' },
        { prompt: 'Define relationships', label: 'Add Relationships' },
        { prompt: 'Generate the diagram now', label: 'Generate' }
    ];
}
```

### Research Questions

1. **How to prevent hallucinated elements?** The LM might invent element types that don't exist in bigUML's metamodel. How do you constrain generation to valid types?
2. **How to handle ambiguity?** If the user says "User has many Orders" — is that an association, a composition, or an aggregation? How should the agent ask?
3. **How much UML knowledge should be in the prompt vs. in the tool descriptions?** Compare putting the full element type list in the system prompt vs. having a "list available types" tool.
4. **What is the right interview depth?** Too many questions frustrate users; too few produce incomplete diagrams. Research human-AI interaction patterns for requirements elicitation.

---

## 3. Feature: Tool-Based UML File Operations

### Goal

Implement the tools that the LM can invoke to create, read, and modify UML diagrams. These tools bridge the gap between the agent's high-level intent and bigUML's model mutation pipeline.

### Why This Feature Is Needed

The language model (LM) behind the chat participant can reason about UML and produce text — but it cannot directly create files, add elements to diagrams, or modify the model. Without tools, the agent can only *describe* what a diagram should look like; it cannot *build* it.

**Concrete example:** After the interview, the agent decides the diagram needs a `Class Patient` with `name: String` and `dateOfBirth: Date`. Without tools, the agent can only output:

> "You should create a class called Patient with attributes name (String) and dateOfBirth (Date)."

...and the user is back to manual creation. With tools, the agent internally calls:

1. `biguml-create-uml-file` → creates `hospital.uml` with an empty class diagram
2. `biguml-add-node` → adds `Class Patient` with `name: String`, `dateOfBirth: Date`
3. `biguml-add-node` → adds `Class Doctor` with `name: String`, `specialty: String`
4. *(further tool calls for relationships, etc.)*

The user sees the diagram appear in their editor — no manual work required. The tools are the bridge between the agent's understanding and bigUML's model. Without them, the agent is just a chatbot that talks about UML instead of building it.

### Tool Architecture

Tools are registered via `vscode.lm.registerTool()` and declared in `package.json` under `languageModelTools`. Each tool receives typed input from the LM and returns a result. Currently there are no examples regarding using the model server in the vscode side. You should investigate how to use the model server outside of the GLSP server.

```
LM decides to call tool
  │
  ▼
vscode.LanguageModelToolCallPart { name, input }
  │
  ▼
Tool implementation (big-ai package)
  │  validates input
  │  interacts with model server / file system
  ▼
vscode.LanguageModelToolResult (text content)
  │
  ▼
LM receives result, continues generation
```

### Tool 1: Create UML File

Creates a new `.uml` file with an empty diagram skeleton.

**Implementation approach:**

The `.uml` file format is defined by the Langium grammar. The simplest approach is to write a valid template string:

```typescript
class CreateUmlFileTool implements vscode.LanguageModelTool<CreateUmlFileInput> {
    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<CreateUmlFileInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        const { filePath, diagramType } = options.input;

        // Build initial .uml file content from a template
        const content = this.getTemplate(diagramType);

        const uri = vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, filePath);
        await vscode.workspace.fs.writeFile(uri, Buffer.from(content));

        return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(`Created UML file at ${filePath}`)]);
    }
}
```

**Template source:** Look at existing `.uml` files in [workspace/class_diagram/](../../../workspace/class_diagram/) for the file format. Also study how the "New UML File" command creates files — check if there's an existing template mechanism. (There are commands)

### Tool 2: Read UML File

Reads a `.uml` file and returns its semantic content as structured text that the LM can understand.

**Implementation approaches (choose one):**

**Option A — Read raw file text:**
Simply read the `.uml` file and return its textual content. The Langium grammar is readable enough for an LM to understand.

**Option B — Read via Model Server (if diagram is open):**
If the diagram is currently open, use the model server api to get the parsed AST as JSON. This gives structured data but requires the file to be open.

```typescript
class ReadUmlFileTool implements vscode.LanguageModelTool<ReadUmlFileInput> {
    constructor(private readonly modelServerClient: ModelServerClient) {}

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<ReadUmlFileInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        const { filePath } = options.input;
        const uri = vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, filePath);

        // Option A: Direct file read
        const content = await vscode.workspace.fs.readFile(uri);
        const text = Buffer.from(content).toString('utf-8');

        return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(text)]);
    }
}
```

### Tool 3: Add Node

Adds a new element (Class, Interface, etc.) to an existing diagram.

**Implementation approach — File text manipulation:**

Since the `.uml` file is text-based (Langium grammar), the most straightforward approach for a new package (without requiring an open diagram) is to parse the file, insert the new element text at the correct position, and write it back.

**Alternative — JSON patch via Model Server:**

If the diagram is open, use the model server's patch API to add elements. This is the preferred approach for an open diagram because it integrates with undo/redo:

```typescript
class AddNodeTool implements vscode.LanguageModelTool<AddNodeInput> {
    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<AddNodeInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        const { filePath, elementType, name, properties } = options.input;

        // Build the text representation of the element
        // This depends on the Langium grammar — study existing .uml files
        const elementText = this.buildElementText(elementType, name, properties);

        // Read existing file, find insertion point, write back
        // OR use model server patch if diagram is open

        return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(`Added ${elementType} "${name}" to ${filePath}`)]);
    }
}
```

> For the exact approach to inserting/removing elements (text manipulation vs. model server patches experiment around - start with text manipulation and step up to model server patches). The model server's `patch()` and `update()` methods are the correct approach if the file is open. For files that are not yet open, you may need to write text directly and let Langium re-parse. Some investigation is required here.

### Tool 4: Remove Node

Removes an element by name from a diagram.

**Same approach considerations as Tool 3** — either text manipulation for closed files or JSON patch (with `op: 'remove'`) for open files.

### Security Considerations

- **Path traversal:** Validate that `filePath` inputs resolve within the workspace. Do not allow `../` to escape the workspace root. Use `vscode.Uri.joinPath()` and verify the resolved URI starts with the workspace folder URI.
- **Input sanitization:** Tool inputs come from the LM, which could be influenced by user prompts. Validate all inputs against expected types and ranges.
- **File overwrite protection:** The create tool should check if the file already exists and refuse to overwrite without explicit confirmation.
- **Regex in element names:** If element names are interpolated into grammar text, ensure they don't contain characters that would break the Langium parser (e.g., quotes, braces).

### Files to Create

| File                                                  | Purpose                                            |
| ----------------------------------------------------- | -------------------------------------------------- |
| `big-ai/src/env/vscode/tools/create-uml-file.tool.ts` | Tool implementation: create new `.uml` file        |
| `big-ai/src/env/vscode/tools/read-uml-file.tool.ts`   | Tool implementation: read `.uml` file content      |
| `big-ai/src/env/vscode/tools/add-node.tool.ts`        | Tool implementation: add element to diagram        |
| `big-ai/src/env/vscode/tools/remove-node.tool.ts`     | Tool implementation: remove element from diagram   |
| `big-ai/src/env/common/tool-types.ts`                 | Shared input/output type definitions for all tools |

---

## 4. Feature: Research & Extended Capabilities

### Goal

Go beyond the basic interview agent. Investigate what other capabilities the VS Code Chat API and Language Model API offer, and propose extensions for Interim 1.

### Why This Feature Is Needed

The basic interview agent (Features 1–3) covers the "create a diagram from scratch" workflow. But real-world use involves much more: understanding existing diagrams, modifying parts of a model, explaining design decisions, and integrating with VS Code's editing experience. Without exploring these extensions, the agent remains a one-trick tool.

**Concrete example:** A student opens an existing `library-system.uml` that a teammate created. They want to:

- **Understand it:** "@biguml /explain What does this diagram model?" → The agent reads the file and produces a natural-language summary: *"This is a library management system with 6 classes. `Book` has a many-to-many relationship with `Author` via `BookAuthor`. `Member` can borrow up to 5 `Book`s at a time through `Loan`..."*
- **Modify it inline:** While editing the `.uml` file, they highlight the `Member` class and use inline chat: *"Add a `membershipTier` attribute with values Gold, Silver, Bronze"*
- **Reference context:** "@biguml I want to extend #file:library-system.uml with a reservation system" → The agent reads the referenced file automatically and asks follow-up questions in context

These capabilities transform the agent from a diagram generator into a full UML assistant that helps throughout the modeling lifecycle.

### Research Areas

#### 4.1 Chat Variables and References

VS Code supports `#file`, `#selection`, and custom chat variables. Investigate:

- Can the user reference a `.uml` file in the chat via `#file:diagram.uml` and have the agent automatically read it?
- Can you register a custom chat variable (e.g., `#diagram`) that resolves to the currently open diagram's content?
- How does `ChatRequest.references` provide attached context?

#### 4.2 Inline Chat Integration

VS Code has an inline chat feature that works within editors. Investigate:

- Can the interview agent also work as an inline chat participant within the `.uml` text editor?
- What would the UX look like for modifying a diagram via inline chat?

#### 4.3 Diagram Explanation and Documentation

Beyond creation, the agent could:

- **Explain a diagram:** Read the current `.uml` file and produce a natural-language summary
- **Generate documentation:** Produce Markdown documentation from a UML model
- **Suggest improvements:** Analyze a class diagram for design pattern violations or missing relationships

#### 4.4 Prompt Engineering and Model Selection

- **Model selection:** `vscode.lm.selectChatModels()` can filter by vendor, family, version. Which models work best for structured UML generation?
- **Token management:** Large diagrams may exceed context windows. How do you summarize a diagram for the LM while preserving important structure?
- **Temperature and parameters:** Does lower temperature improve the reliability of structured tool calls?

#### 4.5 Confirmation and Preview UX

Before applying changes to a diagram, the agent should show a preview:

- **Markdown preview:** Show the planned changes as a structured list before executing
- **Diff view:** Show a before/after diff of the `.uml` file text
- **Tool confirmation:** VS Code's tool API supports confirmation dialogs (`LanguageModelToolInvocationOptions.toolInvocationToken`) — investigate how to use this

### Research Questions for Interim 1

1. **What prompting strategy produces the best interview experience?** Compare system prompts, few-shot examples, chain-of-thought reasoning.
2. **What is the right set of tools?** Are create/read/add/remove sufficient, or do you need more fine-grained operations (add attribute, add operation, add relationship)?
3. **How should the agent handle errors?** If a tool call fails (e.g., invalid element type), how does the agent recover?
4. **What other VS Code Chat API features could improve the UX?** Chat variables, progress indicators, code blocks, tree views in chat?
5. **How do competing tools handle AI-assisted diagram creation?** Survey Mermaid AI tools, PlantUML copilot integrations, GitHub Copilot's diagram capabilities.

---

## 5. Current Architecture Context

### 5.1 Package Structure Convention

Every feature package in bigUML follows the environment folder convention:

```
packages/big-ai/
├── package.json
├── tsconfig.json
├── eslint.config.js
├── esbuild.ts           (only if package has a webview — likely not needed initially)
├── config/
│   ├── tsconfig.node.json
│   └── tsconfig.browser.json
├── src/
│   └── env/
│       ├── common/       ← Shared types, tool input schemas, prompt templates
│       │   └── index.ts
│       └── vscode/       ← Chat participant, tool implementations, DI module
│           └── index.ts
└── build/                ← Compiled output (gitignored)
```

Since the interview agent runs entirely in the **extension host** (Node.js) and interacts with VS Code APIs directly, it likely only needs `common/` and `vscode/` environments initially. No `glsp-server/`, `glsp-client/`, or `browser/` folders are needed unless you add webview-based UI later.

### 5.2 Extension Host Registration

The agent's module must be loaded in [application/vscode/src/extension.config.ts](../../../application/vscode/src/extension.config.ts):

```typescript
import { aiModule } from '@borkdominik-biguml/big-ai/vscode';

export function createContainer(...) {
    const container = vscodeModule(extensionContext, options);
    container.load(
        // ... existing modules ...
        aiModule(/* config */),
    );
    return container;
}
```

### 5.3 No Server-Side Component (Initially)

Unlike other feature packages (e.g., `big-advancedsearch` which has a GLSP server handler), the interview agent initially operates entirely in the extension host. Tool implementations interact with the file system and model server client directly from the extension host process.

If future features require server-side processing (e.g., complex model queries), a `glsp-server/` environment can be added later.

### 5.4 Model Server Client

Implement in the extension host a `ModelServerClient` that communicates with the model server via JSON-RPC. This client can be then injected into tool implementations to:

- Read the parsed AST of an open `.uml` file
- Apply JSON patches to modify the model
- Trigger undo/redo

### 5.5 UML File Format

The `.uml` file format is defined by the Langium grammar.

Study existing files in [workspace/class_diagram/](../../../workspace/class_diagram/) for more examples and the grammar definition in [tooling/uml-language/](../../../tooling/uml-language/) and [packages/uml-model-server](../../../packages/uml-model-server)

---

## 6. Architecture Reference

### Environment Model (How Code Is Split)

| Folder            | Runtime                  | Use for interview agent                              |
| ----------------- | ------------------------ | ---------------------------------------------------- |
| `src/env/common/` | Shared                   | Tool input/output types, prompt templates, constants |
| `src/env/vscode/` | Node.js (extension host) | Chat participant, tool implementations, DI module    |

### Chat Participant Lifecycle

```
User types @biguml /interview "I need a library system"
  │
  ▼
VS Code routes to InterviewAgentParticipant.handleRequest()
  │
  ├── Builds message array from ChatContext.history + system prompt + user message
  │
  ├── Calls model.sendRequest(messages, { tools }) via Language Model API
  │
  ├── Processes response stream:
  │     ├── LanguageModelTextPart → stream.markdown(text)
  │     └── LanguageModelToolCallPart → invoke tool → feed result back to LM
  │
  ├── Returns ChatResult with metadata
  │
  └── Follow-up provider suggests next interview steps
```

### Tool Execution Flow

```
LM outputs LanguageModelToolCallPart { name: "biguml-add-node", input: {...} }
  │
  ▼
Tool implementation validates input
  │
  ├── If diagram is open: Use ModelServerClient.patch() for undo/redo support
  │     → JSON patch applied → AST updated → GModel regenerated → diagram refreshes
  │
  └── If diagram is closed: Manipulate .uml file text directly
        → Write file → Langium re-parses on next open
```

### Dependency Injection

The `big-ai` module should use the existing DI infrastructure:

```typescript
// big-ai/src/env/vscode/interview-agent.module.ts
export function aiModule() {
    return new VscodeFeatureModule((bind, unbind, isBound, rebind, ...args) => {
        // Register the chat participant as a singleton
        bind(InterviewAgentParticipant).toSelf().inSingletonScope();
        // Register tools
        bind(CreateUmlFileTool).toSelf().inSingletonScope();
        bind(ReadUmlFileTool).toSelf().inSingletonScope();
        bind(AddNodeTool).toSelf().inSingletonScope();
        bind(RemoveNodeTool).toSelf().inSingletonScope();
    });
}
```

Implement an extensible architecture where you can add later easily more tools/agents.

---

## 7. Related Documentation

| Document                                                                                             | Relevance                                                     |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [docs/architecture-overview.md](../../../docs/architecture-overview.md)                                       | System-wide architecture, startup sequence, environment model |
| [docs/model-server.md](../../../docs/model-server.md)                                                         | JSON-RPC model server, patch protocol, undo/redo              |
| [docs/guides/command-registration.md](../../../docs/guides/command-registration.md)                           | How to register VS Code commands via DI                       |
| [docs/guides/webview-registration.md](../../../docs/guides/webview-registration.md)                           | How webviews work (for future webview-based UI)               |
| [VS Code Chat Extensions Guide](https://code.visualstudio.com/api/extension-guides/chat)             | Official Chat API documentation                               |
| [VS Code Language Model API](https://code.visualstudio.com/api/extension-guides/language-model)      | LM access, tool calling, streaming                            |
| [VS Code Chat Tutorial](https://code.visualstudio.com/api/extension-guides/chat-tutorial)            | Step-by-step tutorial for building a chat participant         |
| [Chat Sample Extension](https://github.com/microsoft/vscode-extension-samples/tree/main/chat-sample) | Reference implementation                                      |
| [VS Code API Reference — Chat](https://code.visualstudio.com/api/references/vscode-api#chat)         | Full API type definitions                                     |
