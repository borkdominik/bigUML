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
import { GLSPDiagramWidget } from '@eclipse-glsp/theia-integration';
import { EnableEditorPanelAction } from '@eclipsesource/uml-sprotty/lib/features/editor-panel';

export class UmlDiagramWidget extends GLSPDiagramWidget {
    protected override dispatchInitialActions(): void {
        super.dispatchInitialActions();

        this.actionDispatcher.dispatch(new EnableEditorPanelAction());
    }
}
