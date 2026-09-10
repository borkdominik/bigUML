/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { NotificationType } from 'vscode-messenger-common';

export namespace ToggleSyntaxNotification {
    export const TYPE: NotificationType<void> = { method: 'big.advancedsearch.toggleSyntax' };
}

export namespace PreviewsEnabledNotification {
    export const TYPE: NotificationType<void> = { method: 'big.advancedsearch.previewsEnabled' };
}

export namespace PreviewsDisabledNotification {
    export const TYPE: NotificationType<void> = { method: 'big.advancedsearch.previewsDisabled' };
}
