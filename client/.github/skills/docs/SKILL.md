---
name: docs
description: >-
    Create new or update existing technical documentation for the bigUML project.
    Use this skill whenever the user asks to document a feature, write a guide,
    explain architecture, create a how-to, update existing docs, or mentions
    "docs", "documentation", "write up", "explain how X works", or "document this".
    Also use it when the user has just finished implementing a feature and wants
    to capture how it works for other contributors.
---

# Documentation Skill

Create and maintain technical documentation for the bigUML project. All docs live under the `docs/` directory at the workspace root and follow a consistent structure inspired by the [eclipse-glsp documentation style](https://github.com/eclipse-glsp/glsp-client/tree/docs/doc).

## Task checklist

Work through these steps in order when creating or updating documentation:

- **Identify the scope**: Determine what is being documented - a feature, architectural concept, workflow, or API surface. Read relevant source files to understand the topic thoroughly.
- **Choose create vs. update**: Check if a doc already exists under `docs/` for the topic. If it does, update it; otherwise create a new file.
- **Outline the structure**: Draft the heading skeleton using the required document structure (see below). Share the outline with the user before writing the full content.
- **Write the content**: Fill in each section with clear, accurate prose. Add mermaid diagrams for any flow, sequence, or architectural relationship. Add tables for option/config summaries.
- **Add metadata**: Append the HTML comment metadata block at the end of the document.
- **Cross-link**: Link to related docs within `docs/` and mention relevant source file paths.
- **Review with the user**: Present the finished doc and iterate based on feedback.

## Document structure

Every documentation file must use this template. Omit a section only if it genuinely does not apply (e.g., a pure conceptual doc may not have "Usage Examples").

```markdown
# <Title>

## Overview

A 2–4 sentence summary of the topic: what it is, why it matters, and who should read this.

## Key Concepts

Bullet list of the core terms and abstractions the reader needs to understand.
Use bold for term names and inline code for symbols/types.

## How It Works

Step-by-step explanation of the mechanism or workflow.
Include at least one mermaid diagram (flowchart, sequence, or class diagram)
to visualize the flow. Break into sub-sections (### headings) when there are
multiple phases or entry points.

## Key Files

| File              | Responsibility    |
| ----------------- | ----------------- |
| `path/to/file.ts` | Brief description |

## Usage Examples

Code snippets or JSON examples showing how to use the feature.
Annotate with brief comments explaining what each part does.

## Design Decisions

Explain the **why** behind important choices using bold question format:
**Why X?** followed by the rationale.

## Related Topics

- [Other Doc](./other-doc.md) - one-line description

 <!--
topic: <kebab-case-topic-id>
scope: <concept | architecture | guide | reference>
entry-points:
  - <path/to/main/file.ts>
related:
  - <./other-doc.md>
last-updated: <YYYY-MM-DD>
-->
```

## Writing guidelines

### Voice and tone

Write for contributors and adopters who are already comfortable with TypeScript and the GLSP ecosystem. Be direct and precise - avoid filler phrases like "In this document we will explain…". Jump straight into the substance.

### Mermaid diagrams

Use mermaid diagrams liberally - they are one of the most valuable parts of good documentation because they convey relationships and flows far faster than prose alone. Pick the right diagram type for the situation:

- **`sequenceDiagram`** for request/response flows and multi-actor interactions
- **`flowchart TD`** (top-down) for processing pipelines and decision trees
- **`flowchart LR`** (left-right) for data transformation chains
- **`classDiagram`** for type hierarchies and interface relationships
- **`stateDiagram-v2`** for lifecycle / state machine behavior

Keep diagrams focused - show one concept per diagram rather than cramming everything into a single chart. Use `subgraph` blocks to group related nodes. Label edges with action names or data types.

Use <br> instead of \nfor line breaks in labels.

### Tables

Use markdown tables for any structured set of options, configuration keys, or file inventories. Always include a header row. Align columns for readability.

### Code snippets

Use fenced code blocks with the correct language tag (`typescript`, `json`, `markdown`). Keep snippets short and focused - show just enough to illustrate the point. Add a brief comment above the snippet explaining what it demonstrates.

### Cross-references

Link to other docs using relative paths (`./other-doc.md`). When referencing source files, use workspace-relative paths (e.g., `packages/client/src/features/bounds/layouter.ts`). Mention the specific file and, where helpful, the approximate line or exported symbol.

### Metadata block

Every doc must end with an HTML comment metadata block. This helps with discoverability and maintenance:

- **topic**: A kebab-case identifier for the topic
- **scope**: One of `concept`, `architecture`, `guide`, or `reference`
- **entry-points**: The primary source files a reader should start with
- **related**: Links to related documentation files
- **last-updated**: The date of last significant update (YYYY-MM-DD format)

## Updating existing docs

When updating rather than creating:

1. Read the existing doc fully before making changes.
2. Preserve the existing structure - don't reorganize unless the user explicitly asks.
3. Update the `last-updated` date in the metadata block.
4. If new sections are needed, slot them into the standard order defined above.
5. Keep mermaid diagrams in sync with any behavioral changes described in the text.

## File naming

Use kebab-case for doc filenames: `client-layout-flow.md`, `property-palette-guide.md`. The filename should clearly reflect the topic without abbreviations.
