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
package com.eclipsesource.uml.glsp.uml.diagram.package_diagram.features.property_palette;

import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.PackageMerge;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_PackageMerge;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.PackageImportUtils;

public class PackageMergePropertyMapper extends BaseDiagramElementPropertyMapper<PackageMerge> {

   @Override
   public PropertyPalette map(final PackageMerge source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlPackage_PackageMerge.Property.class, elementId)
         .reference(
            UmlPackage_PackageMerge.Property.MERGED_PACKAGE,
            "Merged Package",
            PackageImportUtils.asReferenceFromPackage(List.of(source.getMergedPackage()), idGenerator),
            List.of(),
            false)

         .items();

      return new PropertyPalette(elementId, "Package Merge", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      return withContext(null);
   }

}
