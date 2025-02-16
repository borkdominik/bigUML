/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { injectable, postConstruct } from 'inversify';
import { type ConfigurationScope, ConfigurationTarget, workspace, type WorkspaceConfiguration, type WorkspaceFolder } from 'vscode';

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
