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
package com.eclipsesource.uml.modelserver.core.routing;

import org.eclipse.emfcloud.modelserver.common.ModelServerPathsV2;

public interface UmlModelServerPaths {
   String PATH = "uml";
   String BASE_PATH = ModelServerPathsV2.BASE_PATH + "/" + PATH;
   String FORMAT_UML = "uml";
   String FORMAT_RAW_JSON = "raw-json";

   String UML_TYPES = "types";
}
