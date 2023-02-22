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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette;

import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.PackageImport;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_PackageImport;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.package_import.UpdatePackageImportHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.PackageImportUtils;
import com.eclipsesource.uml.glsp.uml.utils.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.package_import.UpdatePackageImportArgument;

public class PackageImportPropertyMapper extends BaseDiagramElementPropertyMapper<PackageImport> {

   @Override
   public PropertyPalette map(final PackageImport source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlClass_PackageImport.Property.class, elementId)
         .choice(
            UmlClass_PackageImport.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .reference(
            UmlClass_PackageImport.Property.IMPORTED_PACKAGE,
            "Imported Package",
            PackageImportUtils.asReferenceFromPackage(List.of(source.getImportedPackage()), idGenerator),
            List.of(),
            false)

         .items();

      return new PropertyPalette(elementId, "Package Import", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlClass_PackageImport.Property.class, action);
      var handler = getHandler(UpdatePackageImportHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdatePackageImportArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .get());
            break;
      }

      return withContext(operation);
   }

}
