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
import "../../src/browser/style/common.css";
import "../../src/browser/style/uml-colors.css";

import { FrontendApplicationContribution, LabelProviderContribution } from "@theia/core/lib/browser";
import { ContainerModule } from "inversify";

import { UmlFrontendContribution } from "./frontend-contribution";
import { UmlTreeLabelProviderContribution } from "./label-provider";

export default new ContainerModule(bind => {
    bind(FrontendApplicationContribution).to(UmlFrontendContribution).inSingletonScope();
    bind(LabelProviderContribution).to(UmlTreeLabelProviderContribution).inSingletonScope();
});
