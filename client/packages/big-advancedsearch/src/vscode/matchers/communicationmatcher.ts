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

        for (const element of rootElements) {
            const typeFromEClass = element.eClass?.split('#//')[1];

            if (typeFromEClass === 'Interaction') {
                const interaction = element;
                const interactionName = interaction.name ?? '<<Interaction>>';
                idToName.set(interaction.id, interactionName);

                results.push({ id: interaction.id, type: 'Interaction', name: interactionName });

                for (const lifeline of interaction.lifeline ?? []) {
                    const lifelineName = lifeline.name ?? '<<Lifeline>>';
                    idToName.set(lifeline.id, lifelineName);
                    results.push({ id: lifeline.id, type: 'Lifeline', name: lifelineName, parentName: interactionName });
                }

                console.log(
                    'idToName map:',
                    Array.from(idToName.entries())
                        .map(([id, name]) => `${id}: ${name}`)
                        .join(', ')
                );

                for (const message of interaction.message ?? []) {
                    const messageName = message.name ?? '<<Unnamed Message>>';

                    const fromSpecId = message.sendEvent?.$ref;
                    const toSpecId = message.receiveEvent?.$ref;

                    const fragmentMap = new Map<string, any>();
                    for (const frag of interaction.fragment ?? []) {
                        fragmentMap.set(frag.id, frag);
                    }

                    const fromSpec = fragmentMap.get(fromSpecId);
                    const toSpec = fragmentMap.get(toSpecId);

                    const fromLifelineId = fromSpec?.covered?.[0]?.$ref;
                    const toLifelineId = toSpec?.covered?.[0]?.$ref;

                    const fromName = idToName.get(fromLifelineId) ?? 'Unknown';
                    const toName = idToName.get(toLifelineId) ?? 'Unknown';

                    results.push({
                        id: message.id,
                        type: 'Message',
                        name: messageName,
                        parentName: interactionName,
                        details: `Message from ${fromName} to ${toName}`
                    });
                }
            }
        }

        return results;
    }
}
