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
import { ConfigurationScope, ConfigurationTarget, WorkspaceConfiguration, WorkspaceFolder, workspace } from 'vscode';

export namespace SettingKeys {
    export const section = 'bigUML' as const;

    export const hideUnotation = 'hideUnotation' as const;
}

const filesSection = 'files';
const filesExcludeProperty = 'exclude';
const excludeUnotationGlob = '**/*.unotation';

interface Options {
    workspaces: readonly WorkspaceFolder[] | undefined;
}

@injectable()
export class Settings {
    @postConstruct()
    protected initialize(): void {
        workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration(SettingKeys.section)) {
                this.update({ workspaces: workspace.workspaceFolders });
            }
        });

        this.update({ workspaces: workspace.workspaceFolders });
    }

    configuration(scope?: ConfigurationScope): WorkspaceConfiguration {
        return workspace.getConfiguration(SettingKeys.section, scope);
    }

    update(options: Options): void {
        const config = this.configuration();

        this.hideUnotation(config.get(SettingKeys.hideUnotation)!, options);
    }

    protected async hideUnotation(value: boolean, options: Options): Promise<void> {
        for (const folder of options.workspaces ?? []) {
            const bigUMLConfiguration = this.configuration(folder);
            const filesConfiguration = workspace.getConfiguration(filesSection, folder);

            const excludeList: { [k: string]: boolean } = filesConfiguration.get(filesExcludeProperty) ?? {};

            if (bigUMLConfiguration.get(SettingKeys.hideUnotation) === false && excludeList[excludeUnotationGlob] === undefined) {
                return;
            }

            if (excludeList[excludeUnotationGlob] === undefined || excludeList[excludeUnotationGlob] !== value) {
                excludeList[excludeUnotationGlob] = value;

                await filesConfiguration.update(filesExcludeProperty, excludeList, ConfigurationTarget.WorkspaceFolder);
                await bigUMLConfiguration.update(SettingKeys.hideUnotation, value, ConfigurationTarget.WorkspaceFolder);
            }
        }
    }
}
