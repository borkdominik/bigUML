/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
// eslint-disable-next-line header/header
import {UriSelection} from "@theia/core";
import {LabelProviderContribution} from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";
import {FileStat} from "@theia/filesystem/lib/common";
import {injectable} from "inversify";

@injectable()
export class UmlTreeLabelProviderContribution implements LabelProviderContribution {
    // FIXME
    // eslint-disable-next-line @typescript-eslint/ban-types
    canHandle(uri: object): number {
        let toCheck: any = uri;
        if (FileStat.is(toCheck)) {
            toCheck = new URI(toCheck.uri);
        } else if (UriSelection.is(uri)) {
            toCheck = UriSelection.getUri(uri);
        }
        if (toCheck instanceof URI) {
            if (toCheck.path.ext === ".uml") {
                return 1000;
            }
        }
        return 0;
    }

    getIcon(): string {
        return "umlmodelfile";
    }
}
