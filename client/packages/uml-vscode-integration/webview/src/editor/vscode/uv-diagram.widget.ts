/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { EnableEditorPanelAction } from '@borkdominik-biguml/uml-glsp/lib/features/editor-panel';
import { GLSPVscodeDiagramWidget } from '@eclipse-glsp/vscode-integration-webview/lib/glsp-vscode-diagram-widget';
import { injectable, postConstruct } from 'inversify';

@injectable()
export class UVDiagramWidget extends GLSPVscodeDiagramWidget {
    protected containerDiv: HTMLDivElement | null;

    @postConstruct()
    override initialize(): void {
        super.initialize();

        this.dispatchInitialActions();
    }

    protected override initializeHtml(): void {
        this.containerDiv = document.getElementById(this.diagramIdentifier.clientId + '_container') as HTMLDivElement | null;
        if (this.containerDiv) {
            const svgContainer = document.createElement('div');
            svgContainer.id = this.viewerOptions.baseDiv;
            this.containerDiv.appendChild(svgContainer);

            const hiddenContainer = document.createElement('div');
            hiddenContainer.id = this.viewerOptions.hiddenDiv;
            document.body.appendChild(hiddenContainer);

            const statusDiv = document.createElement('div');
            statusDiv.setAttribute('class', 'sprotty-status');
            this.containerDiv.appendChild(statusDiv);

            this.statusIconDiv = document.createElement('div');
            statusDiv.appendChild(this.statusIconDiv);

            this.statusMessageDiv = document.createElement('div');
            this.statusMessageDiv.setAttribute('class', 'sprotty-status-message');
            statusDiv.appendChild(this.statusMessageDiv);

            this.containerDiv.addEventListener('mouseenter', e => this.handleMouseEnter(e));
            this.containerDiv.addEventListener('mouseleave', e => this.handleMouseLeave(e));
        }
    }

    handleMouseEnter(e: MouseEvent): void {
        this.containerDiv?.classList.add('mouse-enter');
        this.containerDiv?.classList.remove('mouse-leave');
    }

    handleMouseLeave(e: MouseEvent): void {
        this.containerDiv?.classList.add('mouse-leave');
        this.containerDiv?.classList.remove('mouse-enter');
    }

    protected dispatchInitialActions(): void {
        this.actionDispatcher.dispatch(new EnableEditorPanelAction());
    }
}
