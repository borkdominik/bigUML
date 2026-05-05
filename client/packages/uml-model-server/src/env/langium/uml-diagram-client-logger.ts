/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 * Copyright (c) 2023 CrossBreeze.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type UmlDiagramSharedServices } from './uml-diagram-module.js';

/**
 * Centralized logger.
 */
export class ClientLogger {
    constructor(protected services: UmlDiagramSharedServices) {}

    /**
     * Show an error message.
     *
     * @param message The message to show.
     */
    error(message?: string): void {
        if (message) {
            this.services.lsp.Connection?.console.error(message);
        }
    }

    /**
     * Show a warning message.
     *
     * @param message The message to show.
     */
    warn(message?: string): void {
        if (message) {
            this.services.lsp.Connection?.console.warn(message);
        }
    }

    /**
     * Show an information message.
     *
     * @param message The message to show.
     */
    info(message?: string): void {
        if (message) {
            this.services.lsp.Connection?.console.info(message);
        }
    }

    /**
     * Log a message.
     *
     * @param message The message to log.
     */
    log(message?: string): void {
        if (message) {
            this.services.lsp.Connection?.console.log(message);
        }
    }
}
