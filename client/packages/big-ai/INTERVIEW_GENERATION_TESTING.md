# Interview Generation Testing

Use this guide to verify that `/interview` gathers enough information before it generates a UML class diagram.

## 1. Static Check

Run the package checks:

```sh
npm run compile --workspace @borkdominik-biguml/big-ai
npm run lint --workspace @borkdominik-biguml/big-ai
```

Both commands should complete without errors.

## 2. Manual VS Code Extension Test

Run the extension in development mode. In the Extension Development Host, open Copilot Chat and address the `@biguml` participant.

Start with:

```text
@biguml /interview Create a UML diagram for a library borrowing system.
```

Expected behavior:

- The agent asks clarifying questions.
- It does not create a file.
- It does not create a diagram.

Continue with:

```text
It should include Member, Book, and Loan.
```

Expected behavior:

- The agent asks about relationships.

Then provide relationships:

```text
A Member has many Loans. A Loan references one Book.
```

Expected behavior:

- The agent eventually shows a summary similar to:

```text
Summary
- Diagram file:
- Scope:
- Entities:
- Relationships:
- Details:
- Assumptions:
- Missing information:

Reply "generate" to create the diagram, or provide corrections.
```

Before this summary, the agent must not call:

- `biguml-create-uml-file`
- `biguml-add-node`
- `biguml-add-relation`

Confirm generation:

```text
generate
```

Expected behavior:

- Tool calls are now allowed.
- If a file path was provided, the agent creates the `.uml` file.
- The agent adds nodes and relations using tools.

## Useful Negative Tests

### Direct Entity List

Try:

```text
@biguml /interview Generate a diagram for Order, Customer, Product.
```

Expected behavior:

- No generation happens yet.
- The agent asks clarifying questions or produces a summary that requires confirmation.

### Deployment Diagram

Try:

```text
@biguml /interview Create a deployment diagram for a cloud system.
```

Expected behavior:

- The agent asks clarifying questions about nodes (Devices, Execution Environments) and communication paths.
- The summary should correctly identify the diagram type as `DEPLOYMENT`.
- After confirmation, it should call `biguml-generate-deployment-diagram`.

### Activity Diagram

Try:

```text
@biguml /interview Create an activity diagram for order fulfillment.
```

Expected behavior:

- The agent asks clarifying questions about actions, control flow, decisions, start/end states, parallel branches, and swimlanes where applicable.
- The summary should correctly identify the diagram type as `ACTIVITY`.
- After confirmation, it should call `biguml-generate-activity-diagram`.

One complete regression path:

```text
@biguml /interview Create an activity diagram for order fulfillment.
```

```text
The flow starts, receives an order, validates payment, then decides if payment is valid.
If payment is invalid, reject the order and end. If valid, fork into packing the order and notifying the customer, then join, ship the order, and finish.
```

```text
Use workspace/order_fulfillment_activity.uml.
```

Expected proposal contents:

- Diagram type: `ACTIVITY`
- Entities include `InitialNode`, `OpaqueAction` nodes for receive/validate/reject/pack/notify/ship, `DecisionNode`, `ForkNode`, `JoinNode`, and `ActivityFinalNode`.
- Relationships are `ControlFlow`, with guards such as `valid` and `invalid` on the decision outcomes.

Confirm with:

```text
generate
```

Expected behavior:

- `workspace/order_fulfillment_activity.uml` is written.
- The file parses as a UML activity diagram.

### Unsupported Diagram Type

Try:

```text
@biguml /interview Create a sequence diagram for login.
```

Expected behavior:

- The agent explains that AI-assisted generation currently supports UML class, deployment, and activity diagrams only.

### Hallucination Pressure

Try:

```text
@biguml /interview Create a complete ecommerce model with everything you think is needed.
```

Expected behavior:

- The agent does not invent a full model.
- The agent asks scope, entity, or relationship questions.

## Where To Inspect Logs

Open the `big-ai` output channel in VS Code.

Before confirmation, the logs should include lines like:

```text
[big-ai] Interview phase: scope
[big-ai] Generation confirmed: false
```

Before confirmation, only `readUmlFile` should be available.

After confirmation, the logs should include:

```text
[big-ai] Interview phase: generation
[big-ai] Generation confirmed: true
```

At that point, generation tool calls may appear.
