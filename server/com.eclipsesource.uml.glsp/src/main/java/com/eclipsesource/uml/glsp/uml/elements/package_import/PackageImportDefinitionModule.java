/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.package_import;

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.uml.manifest.edge.EdgeFactoryDefinition;

public class PackageImportDefinitionModule extends EdgeFactoryDefinition {

   public PackageImportDefinitionModule(final DiagramManifest manifest) {
      super(manifest.id(), manifest.representation(), PackageImportFactory.class);
   }
}
