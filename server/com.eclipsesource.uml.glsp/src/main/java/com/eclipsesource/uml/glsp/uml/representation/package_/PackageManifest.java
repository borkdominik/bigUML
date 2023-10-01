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
package com.eclipsesource.uml.glsp.uml.representation.package_;

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.uml.elements.abstraction.AbstractionDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.class_.ClassDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.dependency.DependencyDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.element_import.ElementImportDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.package_.PackageDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.package_import.PackageImportDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.package_merge.PackageMergeDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.usage.UsageDefinitionModule;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class PackageManifest extends DiagramManifest {

   @Override
   public String id() {
      return representation().getName();
   }

   @Override
   public Representation representation() {
      return Representation.PACKAGE;
   }

   @Override
   protected void configure() {
      super.configure();

      install(new PackageDefinitionModule(this));
      install(new PackageImportDefinitionModule(this));
      install(new PackageMergeDefinitionModule(this));
      install(new ElementImportDefinitionModule(this));
      install(new ClassDefinitionModule(this));
      install(new DependencyDefinitionModule(this));
      install(new AbstractionDefinitionModule(this));
      install(new UsageDefinitionModule(this));

      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(PackageToolPaletteConfiguration.class);
      });
   }
}