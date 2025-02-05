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
    ElementProperties,
    ModelResourcesResponseAction,
    SetPropertyPaletteAction,
    BGModelResource,
    AudioRecordingCompleteAction
} from '@borkdominik-biguml/uml-protocol';
import { Action, ActionMessage, SelectAction } from '@eclipse-glsp/protocol';
import { TemplateResult, html } from 'lit';
import { query, state } from 'lit/decorators.js';
import { HOST_EXTENSION } from 'vscode-messenger-common';
import { BigElement } from '../../base/component';
import { useToolkit } from '../../toolkit';
import { messenger } from '../../vscode/messenger';
import { TextInputPalette } from '../text-input-palette.component';
import { NLI_SERVER_URL } from '../index';

export function defineTextInputPaletteWebview(): void {
    customElements.define('big-text-input-palette-webview', TextInputPaletteWebview);
}

export class TextInputPaletteWebview extends BigElement {
    @query('#component')
    protected readonly component: TextInputPalette;

    @state()
    protected elementProperties?: ElementProperties;
    protected clientId?: string;
    @state()
    protected umlModel?: BGModelResource;
    @state()
    protected unotationModel?: BGModelResource;
    @state()
    protected audioFilePath?: string;
    @state()
    protected audioBlob?: Blob;
    @state()
    protected inputText?: string;
    @state()
    protected programmaticChange?: boolean;

    override connectedCallback(): void {
        super.connectedCallback();
        useToolkit();

        document.addEventListener('contextmenu', event => {
            event.stopImmediatePropagation();
        });

        messenger.onNotification<ActionMessage>(ActionMessageNotification, message => {
            const { clientId, action } = message;

            if (AudioRecordingCompleteAction.is(action)) {
                const { filePath, fileData } = action;
                this.audioFilePath = filePath;
                const fileBlob = new Blob([new Uint8Array(fileData)], { type: 'audio/wav' });
                this.audioBlob = fileBlob;
                this.transcribeAudio();
            } else if (SetPropertyPaletteAction.is(action)) {
                this.clientId = clientId;
                this.elementProperties = action.palette;
            } else if (ModelResourcesResponseAction.is(action)) {
                const changedId = this.findNewElementXmiId(this.umlModel?.content, action.resources.uml.content);
                
                if (changedId !== undefined) {
                    console.log("Dispatching focus event for id " + changedId);
                    this.sendNotification(SelectAction.create({ selectedElementsIDs: [changedId], deselectedElementsIDs: true })
                    );
                }


                this.umlModel = action.resources.uml as BGModelResource;
                this.unotationModel = action.resources.unotation as BGModelResource;
            }
        });
        messenger.start();

        console.log("Sending Notification from webview component");
        this.sendNotification({ kind: 'textInputReady' });

    }

    protected override render(): TemplateResult<1> {
        return html`<big-text-input-palette
            id="component"
            .clientId="${this.clientId}"
            .properties="${this.elementProperties}"
            .umlModel="${this.umlModel}"
            .unotationModel="${this.unotationModel}"
            .inputText="${this.inputText}"
            .programmaticChange=${this.programmaticChange}"
            @dispatch-action="${this.onDispatchAction}"
        ></big-text-input-palette>`;
    }

    protected onDispatchAction(event: CustomEvent<Action>): void {
        this.sendNotification(event.detail);
    }

    protected sendNotification(action: Action): void {

        messenger.sendNotification(ActionMessageNotification, HOST_EXTENSION, {
            clientId: this.clientId,
            action
        });
    }

    protected async transcribeAudio(): Promise<void> {
        this.programmaticChange = false;
        if (this.audioBlob === undefined) {
            console.error("Cannot transcribe, audio blob is undefined");
            return;
        }
        const formData = new FormData();
        formData.append("file", new File([this.audioBlob], "recording.wav", { type: "audio/wav" }));

        try {
            const response = await fetch(NLI_SERVER_URL + '/transcribe/', {
                headers: {
                    'accept': 'application/json',
                },
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Transcription: ${data.transcription}`);
            this.programmaticChange = true;
            this.inputText = data.transcription;
        } catch (error) {
            console.error("Error transcribing audio:", error);
        }
    }

    protected findNewElementXmiId(xml1: string | undefined, xml2: string | undefined): string | undefined {
        if (xml1 === undefined || xml2 === undefined) {
            return undefined;
        }

        const parser = new DOMParser();
        const doc1 = parser.parseFromString(xml1, "application/xml");
        const doc2 = parser.parseFromString(xml2, "application/xml");
      
        const getAllXmiIds = (doc: Document): Set<string> => {
            const elements = doc.getElementsByTagName("*");
            const ids = new Set<string>();
            for (let i = 0; i < elements.length; i++) {
              const el = elements[i];
              const id = el.getAttribute("xmi:id") || el.getAttributeNS("http://www.omg.org/XMI", "id");
              if (id) ids.add(id);
            }
            return ids;
          };
      
        const ids1 = getAllXmiIds(doc1);
        const ids2 = getAllXmiIds(doc2);
     
        for (const id of ids2) {
          if (!ids1.has(id)) {
            return id; // Return the first new ID found
          }
        }
      
        return undefined; // No new element found
      }
      
}
