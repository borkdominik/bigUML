/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { SearchResult } from '../../common/searchresult.js';
import type { IMatcher } from './IMatcher.js';

export class CommunicationDiagramMatcher implements IMatcher {
    private readonly supportedTypes = ['interaction', 'lifeline', 'message'];

    supports(type: string): boolean {
        return this.supportedTypes.includes(type.toLowerCase());
    }

    supportsPartial(partialType: string): boolean {
        return this.supportedTypes.some(t => t.startsWith(partialType.toLowerCase()));
    }

    supportsList(): string[] {
        return this.supportedTypes;
    }

    match(model: any): SearchResult[] {
        const results: SearchResult[] = [];
        const idToName = new Map<string, string>();

        const sourceModel = model.getSourceModel();
        const rootElements = sourceModel?.packagedElement ?? [];

        // Loop through root elements to find Interaction elements
        for (const element of rootElements) {
            const typeFromEClass = element.eClass?.split('#//')[1];

            if (typeFromEClass === 'Interaction') {
                const interaction = element;
                const interactionName = interaction.name ?? '<<Interaction>>';
                idToName.set(interaction.id, interactionName);

                // add interaction node
                results.push({ id: interaction.id, type: 'Interaction', name: interactionName });

                // Iterate through lifeline elements within the interaction
                for (const lifeline of interaction.lifeline ?? []) {
                    const lifelineName = lifeline.name ?? '<<Lifeline>>';
                    idToName.set(lifeline.id, lifelineName);
                    results.push({ id: lifeline.id, type: 'Lifeline', name: lifelineName, parentName: interactionName });
                }

                // Iterate through messages within the interaction
                for (const message of interaction.message ?? []) {
                    const fromId = message.sendEvent?.$ref ?? 'unknown';
                    const toId = message.receiveEvent?.$ref ?? 'unknown';
                    const fromName = idToName.get(fromId) ?? fromId;
                    const toName = idToName.get(toId) ?? toId;
                    console.log('name ', toName);
                    results.push({
                        id: message.id,
                        type: 'Message',
                        name: `${fromName} → ${toName}`,
                        parentName: interactionName,
                        details: `Message from ${fromName} to ${toName}`
                    });
                }
            }
        }

        return results;
    }
}
