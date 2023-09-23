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
package com.eclipsesource.uml.glsp.uml.elements.package_merge.features;

import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.PackageMerge;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.package_import.utils.PackageImportPropertyPaletteUtils;
import com.eclipsesource.uml.glsp.uml.elements.package_merge.PackageMergeConfiguration;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PackageMergePropertyMapper extends RepresentationElementPropertyMapper<PackageMerge> {

   @Inject
   public PackageMergePropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final PackageMerge source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(PackageMergeConfiguration.Property.class, elementId)
         .reference(
            PackageMergeConfiguration.Property.MERGED_PACKAGE,
            "Imported Package",
            PackageImportPropertyPaletteUtils.asReferenceFromPackage(List.of(source.getMergedPackage()), idGenerator),
            List.of(),
            false)

         .items();

      return new PropertyPalette(elementId, "PackageMerge", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      return withContext(null);
   }

}
