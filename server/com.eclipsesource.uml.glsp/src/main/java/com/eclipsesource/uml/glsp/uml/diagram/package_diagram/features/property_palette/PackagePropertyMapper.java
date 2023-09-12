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

import java.util.Optional;

import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_Package;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.upackage.UpdatePackageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.utils.PackageVisibilityUtils;
import com.eclipsesource.uml.glsp.uml.elements.package_import.utils.PackageImportPropertyPaletteUtils;
import com.eclipsesource.uml.glsp.uml.elements.package_merge.utils.PackageMergeUtils;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.ElementImportUtils;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.upackage.UpdatePackageArgument;

public class PackagePropertyMapper extends BaseDiagramElementPropertyMapper<Package> {

   @Override
   public PropertyPalette map(final Package source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlPackage_Package.Property.class, elementId)
         .text(UmlPackage_Package.Property.NAME, "Name", source.getName())
         .text(UmlPackage_Package.Property.URI, "Uri", source.getURI())
         .choice(
            UmlPackage_Package.Property.VISIBILITY_KIND,
            "Visibility",
            PackageVisibilityUtils.getVisibilityChoices(),
            source.getVisibility().getLiteral())
         .reference(
            UmlPackage_Package.Property.ELEMENT_IMPORTS,
            "Element Import",
            ElementImportUtils.asReferenceFromElementImports(source.getElementImports(), idGenerator))
         .reference(
            UmlPackage_Package.Property.PACKAGE_IMPORTS,
            "Package Import",
            PackageImportPropertyPaletteUtils.asReferenceFromPackageImport(source.getPackageImports(), idGenerator))
         .reference(
            UmlPackage_Package.Property.PACKAGE_MERGES,
            "Package Merge",
            PackageMergeUtils.asReferences(source.getPackageMerges(), idGenerator))
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlPackage_Package.Property.class, action);
      var handler = getHandler(UpdatePackageHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdatePackageArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
         case URI:
            operation = handler.withArgument(
               new UpdatePackageArgument.Builder()
                  .uri(action.getValue())
                  .get());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdatePackageArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .get());
            break;
      }

      return withContext(operation);

   }

}
