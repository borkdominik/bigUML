/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { injectable, postConstruct } from 'inversify';
import { ConfigurationTarget, WorkspaceConfiguration, workspace } from 'vscode';

export namespace SettingKeys {
    export const section = 'bigUML' as const;

    export const hideUnotation = 'hideUnotation' as const;
}

const filesExcludeSection = 'files.exclude';
const excludeUnotationGlob = '**/*.unotation';

@injectable()
export class Settings {
    @postConstruct()
    protected initialize(): void {
        workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration(SettingKeys.section)) {
                this.update({ override: true });
            }
        });

        this.update({ override: false });
    }

    configuration(): WorkspaceConfiguration {
        return workspace.getConfiguration(SettingKeys.section);
    }

    update(options: { override: boolean }): void {
        const config = this.configuration();

        this.hideUnotation(config.get(SettingKeys.hideUnotation)!, options.override);
    }

    protected async hideUnotation(value: boolean, override: boolean): Promise<void> {
        const workspaceConfiguration = workspace.getConfiguration();

        const excludeList: { [k: string]: boolean } = workspaceConfiguration.get(filesExcludeSection) ?? {};

        if (excludeList[excludeUnotationGlob] === undefined || (override && excludeList[excludeUnotationGlob] !== value)) {
            excludeList[excludeUnotationGlob] = value;

            await workspaceConfiguration.update(filesExcludeSection, excludeList, ConfigurationTarget.Workspace);
        }
    }
}
