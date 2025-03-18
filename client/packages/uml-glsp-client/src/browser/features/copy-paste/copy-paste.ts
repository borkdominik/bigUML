/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    type Args,
    containerFeature,
    GChildElement,
    type GModelElement,
    MouseListener,
    PasteOperation,
    ServerCopyPasteHandler
} from '@eclipse-glsp/client';
import { type Action } from '@eclipse-glsp/protocol';
import { inject, injectable } from 'inversify';

const CLIPBOARD_DATA_FORMAT = 'text/plain';

interface ClipboardId {
    readonly clipboardId: string;
}

function isClipboardId(jsonData: any): jsonData is ClipboardId {
    return jsonData !== undefined && 'clipboardId' in jsonData;
}

function getClipboardIdFromDataTransfer(dataTransfer: DataTransfer): string | undefined {
    const jsonString = dataTransfer.getData(CLIPBOARD_DATA_FORMAT);
    const jsonObject = jsonString ? JSON.parse(jsonString) : undefined;
    return isClipboardId(jsonObject) ? jsonObject.clipboardId : undefined;
}

@injectable()
export class LastContainableElementTracker extends MouseListener {
    private lastContainableElement?: GChildElement;

    public get(): GChildElement | undefined {
        return this.lastContainableElement;
    }

    override mouseOver(target: GModelElement, _event: MouseEvent): Action[] {
        let container = target;
        while (!container.hasFeature(containerFeature) && container instanceof GChildElement) {
            container = container.parent;
        }

        if (container instanceof GChildElement) {
            this.lastContainableElement = container;
        } else {
            this.lastContainableElement = undefined;
        }
        return [];
    }
}

@injectable()
export class UMLServerCopyPasteHandler extends ServerCopyPasteHandler {
    @inject(LastContainableElementTracker) protected containableElementTracker: LastContainableElementTracker;

    override handlePaste(event: ClipboardEvent): void {
        if (event.clipboardData && this.shouldPaste(event)) {
            const clipboardId = getClipboardIdFromDataTransfer(event.clipboardData);
            const clipboardData = this.clipboardService.get(clipboardId);
            const containableElement = this.containableElementTracker.get();

            if (clipboardData) {
                let args: Args | undefined = undefined;
                if (containableElement !== undefined) {
                    args = {
                        lastContainableId: containableElement.id
                    };
                }

                this.actionDispatcher.dispatch(
                    PasteOperation.create({
                        clipboardData,
                        editorContext: this.editorContext.get(args)
                    })
                );
            }
            event.preventDefault();
        }
    }
}
