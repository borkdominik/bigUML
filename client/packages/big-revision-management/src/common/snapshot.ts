import { ExperimentalModelState } from "@borkdominik-biguml/big-vscode-integration/vscode";

export interface Snapshot {
    id: string;
    timestamp: string;
    author: string;
    message: string;
    svg: string;
    state: ExperimentalModelState;
}