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
import "../css/diagram.css";
import "../css/edit-label.css";
import "../css/tool-palette.css";
import "reflect-metadata";

import createUmlDiagramContainer from "./di.config";

export * from "./model";
export * from "./views";
export * from "./features/edit-label";
export { createUmlDiagramContainer };
