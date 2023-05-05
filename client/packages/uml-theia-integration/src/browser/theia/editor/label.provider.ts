/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { AnyObject } from '@eclipse-glsp/client';
import { UriSelection } from '@theia/core';
import { LabelProviderContribution } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { FileStat } from '@theia/filesystem/lib/common/files';
import { injectable } from 'inversify';
import { UTDiagramLanguage } from '../../../common/language';

@injectable()
export class LabelProvider implements LabelProviderContribution {
    canHandle(uri: AnyObject): number {
        let toCheck: any = uri;
        if (FileStat.is(toCheck)) {
            toCheck = toCheck.resource;
        } else if (UriSelection.is(uri)) {
            toCheck = UriSelection.getUri(uri);
        }
        if (toCheck instanceof URI) {
            if (UTDiagramLanguage.fileExtensions.includes(toCheck.path.ext)) {
                return 1000;
            }
        }
        return 0;
    }

    getIcon(): string {
        return 'umlmodelfile';
    }
}
