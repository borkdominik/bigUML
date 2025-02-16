/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type ActionMessage } from '@eclipse-glsp/protocol';
import { type NotificationType } from 'vscode-messenger-common';

export const ActionMessageNotification: NotificationType<ActionMessage> = { method: 'actionMessage' };
