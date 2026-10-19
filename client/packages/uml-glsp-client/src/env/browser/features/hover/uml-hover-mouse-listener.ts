/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { GlspHoverMouseListener, type GIssueMarker } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

/**
 * Escapes the issue messages shown in the hover popup of an issue marker. GLSP builds the popup as markup
 * from the raw messages, so a message containing `<` or `&` - `(with n <= m)` - breaks its rendering.
 */
@injectable()
export class UmlHoverMouseListener extends GlspHoverMouseListener {
    protected override createIssueMessage(marker: GIssueMarker): string {
        const items = marker.issues.map(issue => `<li>${this.getSeverityString(issue.severity)}: ${escapeMarkup(issue.message)}</li>`);
        return `<ul>${items.join('')}</ul>`;
    }
}

function escapeMarkup(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
