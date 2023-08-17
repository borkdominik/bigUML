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
package com.eclipsesource.uml.glsp.uml.elements.package_.features;

import java.util.Optional;

import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.package_.PackageConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.package_.PackageOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.PackageImportUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.PackageMergeUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.package_.commands.UpdatePackageArgument;

public class PackagePropertyMapper extends BaseDiagramElementPropertyMapper<Package> {

   @Override
   public PropertyPalette map(final Package source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(PackageConfiguration.Property.class, elementId)
         .text(PackageConfiguration.Property.NAME, "Name", source.getName())
         .text(PackageConfiguration.Property.URI, "Uri", source.getURI())
         .choice(
            PackageConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .reference(
            PackageConfiguration.Property.PACKAGE_IMPORTS,
            "Package Import",
            PackageImportUtils.asReferenceFromPackageImport(source.getPackageImports(), idGenerator))
         .reference(
            PackageConfiguration.Property.PACKAGE_MERGES,
            "Package Merge",
            PackageMergeUtils.asReferences(source.getPackageMerges(), idGenerator))

         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(PackageConfiguration.Property.class, action);
      var handler = getHandler(PackageOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdatePackageArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case URI:
            operation = handler.withArgument(
               UpdatePackageArgument.by()
                  .uri(action.getValue())
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdatePackageArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);

   }

}
