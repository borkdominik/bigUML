# big-ai

AI integration package for bigUML.

## Important upgrade

This package now targets the real stable VS Code Chat and Language Model Tool APIs instead of local mock typings.

That required upgrading the workspace to:

- `@types/vscode` `^1.93.0`
- VS Code engine `^1.93.0`

## Notes

- the dummy tool exists only to validate the participant → LM → tool → LM roundtrip
- see [Interview Generation Testing](INTERVIEW_GENERATION_TESTING.md) for the `/interview` QA flow
