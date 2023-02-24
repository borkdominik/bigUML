/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import {
    Args,
    containerFeature,
    MouseListener,
    PasteOperation,
    SChildElement,
    ServerCopyPasteHandler,
    SModelElement
} from '@eclipse-glsp/client';
import { Action } from '@eclipse-glsp/protocol';
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
    private lastContainableElement?: SChildElement;

    public get(): SChildElement | undefined {
        return this.lastContainableElement;
    }

    override mouseOver(target: SModelElement, event: MouseEvent): Action[] {
        let container = target;
        while (!container.hasFeature(containerFeature) && container instanceof SChildElement) {
            container = container.parent;
        }

        if (container instanceof SChildElement) {
            this.lastContainableElement = container;
        } else {
            this.lastContainableElement = undefined;
        }
        return [];
    }
}

@injectable()
export class CustomCopyPasteHandler extends ServerCopyPasteHandler {
    @inject(LastContainableElementTracker) protected containableElementTracker: LastContainableElementTracker;

    override handlePaste(event: ClipboardEvent): void {
        if (event.clipboardData && this.shouldPaste(event)) {
            const clipboardId = getClipboardIdFromDataTransfer(event.clipboardData);
            const clipboardData = this.clipboadService.get(clipboardId);
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
