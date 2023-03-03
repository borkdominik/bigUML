/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { AnyObject } from '@eclipse-glsp/client';
import { UriSelection } from '@theia/core';
import { LabelProviderContribution } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { FileStat } from '@theia/filesystem/lib/common/files';
import { injectable } from 'inversify';
import { UmlDiagramLanguage } from '../common/uml-language';

@injectable()
export class UmlTreeLabelProviderContribution implements LabelProviderContribution {
    canHandle(uri: AnyObject): number {
        let toCheck: any = uri;
        if (FileStat.is(toCheck)) {
            toCheck = toCheck.resource;
        } else if (UriSelection.is(uri)) {
            toCheck = UriSelection.getUri(uri);
        }
        if (toCheck instanceof URI) {
            if (UmlDiagramLanguage.fileExtensions.includes(toCheck.path.ext)) {
                return 1000;
            }
        }
        return 0;
    }

    getIcon(): string {
        return 'umlmodelfile';
    }
}
