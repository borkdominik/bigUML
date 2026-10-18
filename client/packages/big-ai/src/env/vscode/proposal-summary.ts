/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import type { ProposeDiagramInput } from '../common/index.js';

/**
 * Renders a deterministic Markdown summary of a proposed diagram from its
 * structured spec. The output never depends on model formatting, so the gate
 * that reads it back (turn metadata) cannot be confused by wording or markup.
 */
export function formatProposalSummary(proposal: ProposeDiagramInput): string {
    const lines: string[] = [];
    lines.push('### Proposed diagram');
    lines.push('');
    lines.push(`- **Diagram type:** ${proposal.diagramType}`);
    lines.push(`- **Diagram file:** \`${proposal.filePath}\``);
    lines.push('- **Entities:**');
    for (const entity of proposal.entities) {
        const members: string[] = [];
        if ('properties' in entity || 'operations' in entity) {
            for (const property of entity.properties ?? []) {
                members.push(property.typeName ? `${property.name}: ${property.typeName}` : property.name);
            }
            for (const operation of entity.operations ?? []) {
                members.push(`${operation.name}()`);
            }
        }
        const memberText = members.length > 0 ? ` — ${members.join(', ')}` : '';
        lines.push(`  - \`${entity.name}\` (${entity.elementType})${memberText}`);
    }

    const relationships = proposal.relationships ?? [];
    if (relationships.length > 0) {
        lines.push('- **Relationships:**');
        for (const relationship of relationships) {
            const label = 'name' in relationship && relationship.name ? ` (${relationship.name})` : '';
            const guard = 'guard' in relationship && relationship.guard ? ` [${relationship.guard}]` : '';
            const weight = 'weight' in relationship && relationship.weight !== undefined ? ` weight=${relationship.weight}` : '';
            lines.push(
                `  - \`${relationship.sourceName}\` → \`${relationship.targetName}\` — ${relationship.relationType}${label}${guard}${weight}`
            );
        }
    } else {
        lines.push('- **Relationships:** none');
    }

    lines.push('');
    lines.push('Approve to generate, or tell me what to change.');
    return lines.join('\n');
}
