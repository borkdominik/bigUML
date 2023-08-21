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
package com.eclipsesource.uml.glsp.uml.elements.package_import.features;

import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.PackageImport;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.package_import.PackageImportConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.package_import.PackageImportOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.PackageImportUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.package_import.commands.UpdatePackageImportArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PackageImportPropertyMapper extends RepresentationElementPropertyMapper<PackageImport> {

   @Inject
   public PackageImportPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final PackageImport source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(PackageImportConfiguration.Property.class, elementId)
         .choice(
            PackageImportConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .reference(
            PackageImportConfiguration.Property.IMPORTED_PACKAGE,
            "Imported Package",
            PackageImportUtils.asReferenceFromPackage(List.of(source.getImportedPackage()), idGenerator),
            List.of(),
            false)

         .items();

      return new PropertyPalette(elementId, "Package Import", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(PackageImportConfiguration.Property.class, action);
      var handler = getHandler(PackageImportOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdatePackageImportArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);
   }

}
