/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { IdAstNode } from '@borkdominik-biguml/uml-model-server';
import { isPackageMerge } from '@borkdominik-biguml/uml-model-server/grammar';
import { injectable } from 'inversify';
import type { EdgeEnds, MutationExtension } from '../features/mutation/extension/mutation-extension.js';

/**
 * Where a new package merge runs, when one of its ends was dropped on a connector.
 *
 * The merges into one package are drawn as a single connector, and an end dropped on it names that
 * connector rather than a package - so it is read back to the package the connector runs into, and the
 * merge joins the set instead of ending on one of its lines. A connector also says which way round the
 * new merge goes, whichever end it was dropped on: it gathers packages into the one it runs into, so the
 * package is what the merge runs from. Nothing but a merge can be dropped on a connector; the client
 * sees to that (see `GPackageMergeEdge`).
 */
@injectable()
export class PackageMergeEdgeExtension implements MutationExtension {
    resolveEdgeEnds(source: IdAstNode | undefined, target: IdAstNode | undefined): EdgeEnds | undefined {
        const sourceConnector = isPackageMerge(source) ? source : undefined;
        const targetConnector = isPackageMerge(target) ? target : undefined;

        if (!sourceConnector && !targetConnector) {
            return undefined;
        }
        if (sourceConnector && targetConnector) {
            // Both ends on a connector, and so no package to gather. Left unresolved, which is reported
            // rather than stored.
            return {};
        }
        if (sourceConnector) {
            return { source: target, target: sourceConnector.target?.ref };
        }
        return { source, target: targetConnector!.target?.ref };
    }
}
