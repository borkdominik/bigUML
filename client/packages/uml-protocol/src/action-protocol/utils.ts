/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { RequestAction, ResponseAction } from '@eclipse-glsp/protocol';

/**
 * Utility type to infer the response type from a given RequestAction.
 */
export type InferResponseType<T extends RequestAction<ResponseAction>> = T extends RequestAction<infer R> ? R : never;
