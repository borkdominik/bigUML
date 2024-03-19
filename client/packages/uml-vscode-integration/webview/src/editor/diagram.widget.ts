/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { GLSPDiagramWidget } from '@eclipse-glsp/vscode-integration-webview/lib/glsp-diagram-widget';
import { injectable } from 'inversify';

@injectable()
export class UMLDiagramWidget extends GLSPDiagramWidget {
    protected containerDiv: HTMLDivElement | null;

    protected override initializeHtml(): void {
        this.containerDiv = document.getElementById(this.clientId + '_container') as HTMLDivElement | null;
        if (this.containerDiv) {
            const svgContainer = document.createElement('div');
            svgContainer.id = this.viewerOptions.baseDiv;
            this.containerDiv.appendChild(svgContainer);

            const hiddenContainer = document.createElement('div');
            hiddenContainer.id = this.viewerOptions.hiddenDiv;
            document.body.appendChild(hiddenContainer);

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
}
