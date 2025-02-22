/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { TYPES, type ViewerOptions } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

export const SVGIdCreatorOptions = {
    svgId: 'svg',
    defId: 'def'
};

@injectable()
export class SVGIdCreatorService {
    @inject(TYPES.ViewerOptions) protected viewerOptions: ViewerOptions;

    createDefId(id: string): string {
        return `${this.viewerOptions.baseDiv}__${SVGIdCreatorOptions.svgId}__${SVGIdCreatorOptions.defId}__${id}`;
    }
}
