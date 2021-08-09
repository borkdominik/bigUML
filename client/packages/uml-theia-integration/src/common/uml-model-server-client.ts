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
import { ModelServerClient, ModelServerMessage, Response } from "@eclipse-emfcloud/modelserver-theia";

export enum UmlDiagramType {
    NONE = "",
    ACTIVITY = "ACTIVITY",
    CLASS = "CLASS",
    COMPONENT = "COMPONENT",
    DEPLOYMENT = "DEPLOYMENT",
    PACKAGE = "PACKAGE",
    SEQUENCE = "SEQUENCE",
    STATEMACHINE = "STATEMACHINE",
    USECASE = "USECASE"
}

export const UmlModelServerClient = Symbol("UmlModelServerClient");
export interface UmlModelServerClient extends ModelServerClient {
    createUmlResource(modelName: string, diagramType: UmlDiagramType): Promise<Response<ModelServerMessage>>;
}
