/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { type UMLDiagramType } from '@borkdominik-biguml/uml-protocol';
import {
    type CancellationToken,
    type Disposable,
    type ExtensionContext,
    type QuickInput,
    type QuickInputButton,
    QuickInputButtons,
    type QuickPickItem,
    window
} from 'vscode';

// https://github.com/microsoft/vscode-extension-samples/blob/main/quickinput-sample/src/multiStepInput.ts

/**
 * A multi-step input using window.createQuickPick() and window.createInputBox().
 *
 * This first part uses the helper class `MultiStepInput` that wraps the API for the multi-step case.
 */
export async function newDiagramWizard(
    _context: ExtensionContext,
    options: {
        diagramTypes: UMLDiagramType[];
        nameValidator: (name: string) => Promise<string | undefined>;
    }
): Promise<State> {
    const title = 'Create UML Diagram';

    async function inputName(input: MultiStepInput, state: Partial<State>): Promise<InputStep> {
        state.name = await input.showInputBox({
            title,
            step: 1,
            totalSteps: 2,
            value: state.name || '',
            prompt: 'Choose a unique name for your diagram',
            validate: options.nameValidator,
            shouldResume
        });

        return (i: MultiStepInput) => pickDiagramType(i, state);
    }

    async function pickDiagramType(input: MultiStepInput, state: Partial<State>): Promise<void> {
        const items = await getAvailableDiagrams(state, undefined);
        state.diagramPick = await input.showQuickPick<DiagramTypeQuickPick>({
            title,
            step: 2,
            totalSteps: 2,
            placeholder: 'Pick a diagram type',
            items,
            activeItem: undefined,
            shouldResume
        });
    }

    function shouldResume(): Promise<boolean> {
        // Could show a notification with the option to resume.
        return new Promise<boolean>((_resolve, _reject) => {
            // noop
        });
    }

    async function getAvailableDiagrams(_state: Partial<State>, _token?: CancellationToken): Promise<DiagramTypeQuickPick[]> {
        return options.diagramTypes.map(type => ({ label: type.toString(), diagramType: type }));
    }

    const state = {} as Partial<State>;
    await MultiStepInput.run(input => inputName(input, state));
    return state as State;
    // window.showInformationMessage(`Creating diagram '${state.name}'`);
}

// -------------------------------------------------------
// Helper code that wraps the API for the multi-step case.
// -------------------------------------------------------
interface State {
    title: string;
    step: number;
    totalSteps: number;
    name: string;
    diagramPick: DiagramTypeQuickPick;
}

class InputFlowAction {
    static back = new InputFlowAction();
    static resume = new InputFlowAction();
    static cancel = new InputFlowAction();
}

type InputStep = (input: MultiStepInput) => Thenable<InputStep | void>;

interface QuickPickParameters<T extends QuickPickItem> {
    title: string;
    step: number;
    totalSteps: number;
    items: T[];
    activeItem?: T;
    ignoreFocusOut?: boolean;
    placeholder: string;
    buttons?: QuickInputButton[];
    shouldResume: () => Thenable<boolean>;
}

interface DiagramTypeQuickPick extends QuickPickItem {
    diagramType: UMLDiagramType;
}

interface InputBoxParameters {
    title: string;
    step: number;
    totalSteps: number;
    value: string;
    prompt: string;
    validate: (value: string) => Promise<string | undefined>;
    buttons?: QuickInputButton[];
    ignoreFocusOut?: boolean;
    placeholder?: string;
    shouldResume: () => Thenable<boolean>;
}

class MultiStepInput {
    static async run(start: InputStep): Promise<void> {
        const input = new MultiStepInput();
        return input.stepThrough(start);
    }

    private current?: QuickInput;
    private steps: InputStep[] = [];

    private async stepThrough(start: InputStep): Promise<void> {
        let step: InputStep | void = start;
        while (step) {
            this.steps.push(step);
            if (this.current) {
                this.current.enabled = false;
                this.current.busy = true;
            }
            try {
                step = await step(this);
            } catch (err) {
                if (err === InputFlowAction.back) {
                    this.steps.pop();
                    step = this.steps.pop();
                } else if (err === InputFlowAction.resume) {
                    step = this.steps.pop();
                } else if (err === InputFlowAction.cancel) {
                    step = undefined;
                } else {
                    throw err;
                }
            }
        }

        if (this.current) {
            this.current.dispose();
        }
    }

    async showQuickPick<TItem extends QuickPickItem, TParameters extends QuickPickParameters<TItem> = QuickPickParameters<TItem>>(
        options: TParameters
    ): Promise<TItem> {
        const disposables: Disposable[] = [];
        try {
            return await new Promise((resolve, reject) => {
                const input = window.createQuickPick<TItem>();
                input.title = options.title;
                input.step = options.step;
                input.totalSteps = options.totalSteps;
                input.ignoreFocusOut = options.ignoreFocusOut ?? false;
                input.placeholder = options.placeholder;
                input.items = options.items;
                if (options.activeItem) {
                    input.activeItems = [options.activeItem];
                }
                input.buttons = [...(this.steps.length > 1 ? [QuickInputButtons.Back] : []), ...(options.buttons || [])];
                disposables.push(
                    input.onDidTriggerButton(item => {
                        if (item === QuickInputButtons.Back) {
                            reject(InputFlowAction.back);
                        } else {
                            resolve(<any>item);
                        }
                    }),
                    input.onDidChangeSelection(items => resolve(items[0])),
                    input.onDidHide(() => {
                        (async () => {
                            reject(
                                options.shouldResume && (await options.shouldResume()) ? InputFlowAction.resume : InputFlowAction.cancel
                            );
                        })().catch(reject);
                    })
                );
                if (this.current) {
                    this.current.dispose();
                }
                this.current = input;
                this.current.show();
            });
        } finally {
            disposables.forEach(d => d.dispose());
        }
    }

    async showInputBox<P extends InputBoxParameters>(options: P): Promise<string> {
        const disposables: Disposable[] = [];
        try {
            // eslint-disable-next-line no-async-promise-executor
            return await new Promise<string>(async (resolve, reject) => {
                const input = window.createInputBox();
                input.title = options.title;
                input.step = options.step;
                input.totalSteps = options.totalSteps;
                input.value = options.value || '';
                input.prompt = options.prompt;
                input.ignoreFocusOut = options.ignoreFocusOut ?? false;
                input.placeholder = options.placeholder;
                input.buttons = [...(this.steps.length > 1 ? [QuickInputButtons.Back] : []), ...(options.buttons || [])];
                let validating = await options.validate('');

                disposables.push(
                    input.onDidTriggerButton(item => {
                        if (item === QuickInputButtons.Back) {
                            reject(InputFlowAction.back);
                        } else {
                            resolve(<any>item);
                        }
                    }),
                    input.onDidAccept(async () => {
                        const value = input.value;
                        input.enabled = false;
                        input.busy = true;
                        if (!(await options.validate(value))) {
                            resolve(value);
                        }
                        input.enabled = true;
                        input.busy = false;
                    }),
                    input.onDidChangeValue(async text => {
                        const current = await options.validate(text);
                        validating = current;
                        const validationMessage = await current;
                        if (current === validating) {
                            input.validationMessage = validationMessage;
                        }
                    }),
                    input.onDidHide(() => {
                        (async () => {
                            reject(
                                options.shouldResume && (await options.shouldResume()) ? InputFlowAction.resume : InputFlowAction.cancel
                            );
                        })().catch(reject);
                    })
                );
                if (this.current) {
                    this.current.dispose();
                }
                this.current = input;
                this.current.show();
            });
        } finally {
            disposables.forEach(d => d.dispose());
        }
    }
}
