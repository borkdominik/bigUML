/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    ActionMessageNotification,
    BGModelResource,
    ElementProperties,
    UpdateElementPropertyAction
} from '@borkdominik-biguml/uml-protocol';
import { Action, ChangeBoundsOperation, CreateEdgeOperation, CreateNodeOperation, DeleteElementOperation, Dimension, ElementAndBounds, SelectAction } from '@eclipse-glsp/protocol';
import { PropertyValues, TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HOST_EXTENSION } from 'vscode-messenger-common';
import { BigElement } from '../base/component';
import '../global';
import { messenger } from '../vscode/messenger';
import { TextInputPaletteStyle } from './text-input-palette.style';
import { NLI_SERVER_URL } from './index';

const umlTypesMap = new Map<string, string>([
    ["class", "CLASS__Class"],
    ["interface", "CLASS__Interface"],
    ["data type", "CLASS__DataType"],
    ["enumeration", "CLASS__Enumeration"],
    ["instance", "CLASS__Instance"],
    ["package", "CLASS__Package"],
    ["primitive type", "CLASS__PrimitiveType"]
]);

export function defineTextInputPalette(): void {
    customElements.define('big-text-input-palette', TextInputPalette);
}

export class TextInputPalette extends BigElement {
    static override styles = [...super.styles, TextInputPaletteStyle.style];

    @property()
    clientId?: string;

    @property({ type: Object })
    properties?: ElementProperties;

    @property({ type: Object })
    protected umlModel?: BGModelResource;
    @property({ type: Object })
    protected unotationModel?: BGModelResource;
    @property({ type: Object })
    protected inputText: string = '...';

    @state()
    protected navigationIds: { [key: string]: { from: string; to: string }[] } = {};

    protected override render(): TemplateResult<1> {
        return html`<div>${this.headerTemplate()} ${this.bodyTemplate()}</div>`;
    }

    protected override updated(changedProperties: PropertyValues<this>): void {
        if (changedProperties.has('properties') && this.clientId !== undefined) {
            const ids = this.navigationIds[this.clientId];

            if (this.properties === undefined || ids?.at(-1)?.to !== this.properties.elementId) {
                this.navigationIds[this.clientId] = [];
            }
        }
    }

    protected headerTemplate(): TemplateResult<1> {
        return html`<header>Query</header>`;
    }

    protected bodyTemplate(): TemplateResult<1> {
        return this.textFieldWithButtonTemplate();
    }

    protected async onRecordActionMessageStart(): Promise<void> {
        this.sendNotification({ kind: 'startRecording' });
    }

    protected async onStartIntent(): Promise<void> {
        const response = await fetch(NLI_SERVER_URL + `/intent/?user_query=${this.inputText}`, {
            headers: {
                accept: 'application/json'
            }
        })
        if (!response.ok) {
            console.error(response.text)
        }
        const json = await response.json();

        await this.handleIntent(json.intent);

        await this.sleep(1000); // this is the most hacky solution ever to delay the update until the server did the change

        console.log("Sending Notification from component");
        this.sendNotification({ kind: 'requestModelResources' });
    }

    protected async sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    protected async handleIntent(intent: string) {
        enum Intents {
            CREATE_CONTAINER = "CreateContainer",
            ADD_ATTRIBUTE = "AddAttribute",
            ADD_METHOD = "AddMethod",
            CHANGE_NAME_INTENT = "ChangeName",
            CHANGE_VISIBILITY_INTENT = "ChangeVisibility",
            CHANGE_DATATYPE_INTENT = "ChangeDatatype",
            CREATE_RELATION = "AddRelation",
            DELETE_INTENT = "Delete",
            FOCUS_INTENT = "Focus",
            MOVE = "Move"
        }
        const elementId = this.properties?.elementId;

        switch(intent) {
            case Intents.CREATE_CONTAINER: {
                this.createContainer();
                break;
            }
            case Intents.ADD_ATTRIBUTE: {
                if (elementId !== undefined) {
                    this.addAttribute(elementId);
                } else {
                    console.error("Nothing selected");
                }
                break;
            }
            case Intents.ADD_METHOD: {
                if (elementId !== undefined) {
                    this.addMethod(elementId);
                } else {
                    console.error("Nothing selected");
                }
                break;
            }
            case Intents.CHANGE_NAME_INTENT: {
                if (elementId !== undefined) {
                    this.changeName(elementId);
                } else {
                    console.error("Nothing selected");
                }
                break;
            }
            case Intents.CHANGE_VISIBILITY_INTENT:
                if (elementId !== undefined) {
                    this.changeVisibility(elementId);
                } else {
                    console.error("Nothing selected");
                }
                break;
            case Intents.CHANGE_DATATYPE_INTENT:
                if (elementId !== undefined) {
                    this.changeDatatype(elementId);
                } else {
                    console.error("Nothing selected");
                }
                break;
                break
            case Intents.CREATE_RELATION: {
                this.createRelation();
                break;
            }
            case Intents.DELETE_INTENT: {
                if (elementId !== undefined) {
                    this.deleteElement(elementId);
                } else {
                    console.error("Nothing selected");
                }

                break;
            }
            case Intents.FOCUS_INTENT: {
                this.focusElement();
                break;
            }
            case Intents.MOVE:
                if (elementId !== undefined) {
                    this.moveElement(elementId);
                } else {
                    console.error("Nothing selected");
                }
                break;
            default: {
                console.error("Buhu ;(");
            }
        }
    }

    protected async findIdByName(name: string, datatype: string) {
        const response = await fetch(NLI_SERVER_URL + `/find-id?name=${name}&element_type=${datatype}`, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json;charset=UTF-8'
            },
            method: "POST",
            body: JSON.stringify({
                uml_model: this.umlModel?.content,
                unotation_model: this.unotationModel?.content
            })
        });

        if (!response.ok) {
            console.error(response.text);
        }
        return await response.json();
    }

    protected async createContainer() {
        // todo only use root if nothing is selected
        const root_json = await this.findIdByName("root", "root");

        const response = await fetch(NLI_SERVER_URL + `/create-container/?user_query=${this.inputText}`, {
            headers: {
                accept: 'application/json'
            },
            method: "POST"
        });
        if (!response.ok) {
            console.error(response.text);
        }
        const json = await response.json();

        const containerType = umlTypesMap.get(json.container_type) ?? `CLASS__Class`;

        this.dispatchEvent(
            new CustomEvent('dispatch-action', {
                detail: CreateNodeOperation.create(containerType,
                {
                    containerId: root_json.id,
                    location: {
                        x: 0,
                        y: 0
                    },
                    args: {
                        name: json.container_name,
                        is_abstract: json.is_abstract
                    }
                })
            })
        );
    }

    // abstract parent for addAttribute and addMethod
    protected async addValue() {
        const response = await fetch(NLI_SERVER_URL + `/add-value/?user_query=${this.inputText}`, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json;charset=UTF-8'
            },
            method: "POST",
            body: JSON.stringify({
                uml_model: this.umlModel?.content,
                unotation_model: this.unotationModel?.content
            })
        });
        if (!response.ok) {
            console.error(response.text);
        }
        return await response.json();
    }

    protected async updateValue() {
        const response = await fetch(NLI_SERVER_URL + `/update-value/?user_query=${this.inputText}`, {
            headers: {
                accept: 'application/json'
            },
            method: "POST"
        });
        if (!response.ok) {
            console.error(response.text);
        }
        return await response.json();
    }

    protected async addAttribute(focusedElement: string) {
        const json = await this.addValue();
        console.error(json);

        // todo handle CLASS__Parameter for methods, either by checking here or by introducing own intent
        this.dispatchEvent(
            new CustomEvent('dispatch-action', {
                detail: CreateNodeOperation.create(`CLASS__Property`,
                {
                    containerId: focusedElement,
                    args: {
                        name: json.value_name,
                        type_id: json.value_datatype,
                        visibility: json.value_visibility
                    }
                })
            })
        );
    }

    protected async addMethod(focusedElement: string) {
        const json = await this.addValue();
        // no return type
        this.dispatchEvent(
            new CustomEvent('dispatch-action', {
                detail: CreateNodeOperation.create(`CLASS__Operation`,
                {
                    containerId: focusedElement,
                    args: {
                        name: json.value_name,
                        visibility: json.value_visibility
                    }
                })
            })
        );
    }

    protected async createRelation() {
        const response = await fetch(NLI_SERVER_URL + `/add-relation/?user_query=${this.inputText}`, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json;charset=UTF-8'
            },
            method: "POST",
            body: JSON.stringify({
                uml_model: this.umlModel?.content,
                unotation_model: this.unotationModel?.content
            })
        });
        if (!response.ok) {
            console.error(response.text);
        }
        const json = await response.json();

        const relation_type = json.relation_type === "Strong aggregation" ? "Association" : json.relation_type;

        this.dispatchEvent(
            new CustomEvent('dispatch-action', {
                detail: CreateEdgeOperation.create(
                {
                    elementTypeId: "CLASS__" + relation_type,
                    sourceElementId: json.class_from_id,
                    targetElementId: json.class_to_id,
                    args: {}
                })
            })
        );
    }

    protected async deleteElement(focusedElement: string) {
        const elementIdList: string[] = focusedElement ? [focusedElement] : [];
        this.dispatchEvent(
            new CustomEvent('dispatch-action', {
                detail: DeleteElementOperation.create(elementIdList, {})
            })
        );
    }

    protected async changeName(focusedElement: string) {
        const json = await this.updateValue();
        this.dispatchEvent(
            new CustomEvent<Action>('dispatch-action', {
                detail: UpdateElementPropertyAction.create({
                    elementId: focusedElement,
                    propertyId: "name",
                    value: json.new_value
                })
            })
        );
    }


    protected async changeVisibility(focusedElement: string) {
        const json = await this.updateValue();

        this.dispatchEvent(
            new CustomEvent<Action>('dispatch-action', {
                detail: UpdateElementPropertyAction.create({
                    elementId: focusedElement,
                    propertyId: "visibilityKind",
                    value: json.new_value
                })
            })
        );
    }

    protected async changeDatatype(focusedElement: string) {
        const json = await this.updateValue();
        const found_json = await this.findIdByName(json.new_value, "class");  // todo "class" might be any container

        this.dispatchEvent(
            new CustomEvent<Action>('dispatch-action', {
                detail: UpdateElementPropertyAction.create({
                    elementId: focusedElement,
                    propertyId: "type",
                    value: found_json.id
                })
            })
        );
    }

    protected async find_element(query: string) {
        const response = await fetch(NLI_SERVER_URL + `/focus/?user_query=${query}`, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json;charset=UTF-8'
            },
            method: "POST",
            body: JSON.stringify({
                uml_model: this.umlModel?.content,
                unotation_model: this.unotationModel?.content
            })
        });
        if (!response.ok) {
            console.error(response.text);
        }
        return await response.json();
    }

    protected async focusElement() {
        const json = await this.find_element(this.inputText);
        this.dispatchEvent(
            new CustomEvent('dispatch-action', {
                detail: SelectAction.create({ selectedElementsIDs: [json.element_id], deselectedElementsIDs: true })
            })
        );
    }

    protected async moveElement(focusedElement: string) {
        const response = await fetch(NLI_SERVER_URL + `/move/?user_query=${this.inputText}`, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json;charset=UTF-8'
            },
            method: "POST",
            body: JSON.stringify({
                uml_model: this.umlModel?.content,
                unotation_model: this.unotationModel?.content
            })
        });
        if (!response.ok) {
            console.error(response.text);
        }
        const json = await response.json();
        const elementAndBounds: ElementAndBounds = {
            elementId: focusedElement,
            newSize: Dimension.EMPTY,
            newPosition: {
                x: json.x_coord,
                y: json.y_coord
            }
        };

        this.dispatchEvent(
            new CustomEvent('dispatch-action', {
                detail: ChangeBoundsOperation.create([elementAndBounds])
            })
        );
    }

    protected textFieldWithButtonTemplate(): TemplateResult<1> {
        return html`
            <div class="grid-value grid-flex">
                <vscode-text-field .value="${this.inputText}" @input="${(event: any) => (this.inputText = event.target?.value)}"></vscode-text-field>
                <div style="display: flex; gap: 10px;">
                    <vscode-button appearance="primary" @click="${this.onRecordActionMessageStart}"> Start Recording </vscode-button>
                    <vscode-button appearance="primary" @click="${this.onStartIntent}"> Send Command </vscode-button>
                </div>
            </div>
        `
    }

    protected sendNotification(action: Action): void {
        messenger.sendNotification(ActionMessageNotification, HOST_EXTENSION, {
            clientId: this.clientId,
            action
        });
    }
}
