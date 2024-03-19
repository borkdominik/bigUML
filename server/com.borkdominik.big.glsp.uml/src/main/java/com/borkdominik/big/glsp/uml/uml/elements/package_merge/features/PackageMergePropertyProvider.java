/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.package_merge.features;

import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.uml2.uml.PackageMerge;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyBuilder;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyItem;
import com.borkdominik.big.glsp.server.features.property_palette.provider.integrations.BGEMFElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.elements.package_import.utils.PackageImportPropertyPaletteUtils;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PackageMergePropertyProvider extends BGEMFElementPropertyProvider<PackageMerge> {

   public static final String MERGED_PACKAGE = "mergedPackage";

   @Inject
   public PackageMergePropertyProvider(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes, Set.of());
   }

   @Override
   public List<ElementPropertyItem> doProvide(final PackageMerge element) {
      var elementId = providerContext.idGenerator().getOrCreateId(element);
      var builder = new ElementPropertyBuilder(elementId)
         .reference(
            MERGED_PACKAGE,
            "Merged Package",
            PackageImportPropertyPaletteUtils.asReferenceFromPackage(List.of(element.getMergedPackage()),
               providerContext.idGenerator()),
            List.of(),
            false);

      return builder.items();
   }
}
