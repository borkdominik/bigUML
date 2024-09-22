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
package com.borkdominik.big.glsp.uml.uml.representation.package_;

import org.eclipse.emf.common.util.Enumerator;

import com.borkdominik.big.glsp.server.core.features.direct_editing.implementations.BGEMFDefaultDirectEditHandler;
import com.borkdominik.big.glsp.server.core.handler.operation.delete.implementations.BGEMFDefaultDeleteHandler;
import com.borkdominik.big.glsp.server.core.manifest.BGRepresentationManifest;
import com.borkdominik.big.glsp.uml.uml.customizations.UMLDefaultPropertyPaletteProvider;
import com.borkdominik.big.glsp.uml.uml.customizations.UMLDefaultReconnectElementHandler;
import com.borkdominik.big.glsp.uml.uml.elements.abstraction.AbstractionElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.class_.ClassElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.dependency.DependencyElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.element_import.ElementImportElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.package_.PackageElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.package_import.PackageImportElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.package_merge.PackageMergeElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.usage.UsageElementManifest;
import com.borkdominik.big.glsp.uml.unotation.Representation;

public class UMLPackageManifest extends BGRepresentationManifest {

   @Override
   public Enumerator representation() {
      return Representation.PACKAGE;
   }

   @Override
   protected void configure() {
      super.configure();

      bindToolPalette(PackageToolPaletteProvider.class);
      bindDefaultDeleteOperation(BGEMFDefaultDeleteHandler.class);
      bindDefaultDirectEdit(BGEMFDefaultDirectEditHandler.class);
      bindDefaultReconnectOperation(UMLDefaultReconnectElementHandler.class);
      bindDefaultPropertyPalette(UMLDefaultPropertyPaletteProvider.class);

      install(new PackageElementManifest(this));
      install(new PackageImportElementManifest(this));
      install(new PackageMergeElementManifest(this));
      install(new ElementImportElementManifest(this));

      install(new ClassElementManifest(this));
      install(new DependencyElementManifest(this));
      install(new AbstractionElementManifest(this));
      install(new UsageElementManifest(this));
   }
}
