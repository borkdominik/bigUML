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

import org.eclipse.uml2.uml.ElementImport;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_ElementImport;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.element_import.UpdateElementImportHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.utils.PackageVisibilityUtils;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.ElementImportUtils;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.element_import.UpdateElementImportArgument;

public class ElementImportPropertyMapper extends BaseDiagramElementPropertyMapper<ElementImport> {

   @Override
   public PropertyPalette map(final ElementImport source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlPackage_ElementImport.Property.class, elementId)
         .choice(
            UmlPackage_ElementImport.Property.VISIBILITY_KIND,
            "Visibility",
            PackageVisibilityUtils.getVisibilityChoices(),
            source.getVisibility().getLiteral())
         .reference(
            UmlPackage_ElementImport.Property.IMPORTED_ELEMENT,
            "Imported Element",
            ElementImportUtils.asReferenceFromPackageableElement(List.of(source.getImportedElement()), idGenerator),
            List.of(),
            false)
         .text(
            UmlPackage_ElementImport.Property.ALIAS,
            "Alias",
            source.getAlias())
         .items();

      return new PropertyPalette(elementId, "Element Import", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlPackage_ElementImport.Property.class, action);
      var handler = getHandler(UpdateElementImportHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdateElementImportArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .get());
            break;
         case ALIAS:
            operation = handler.withArgument(
               new UpdateElementImportArgument.Builder()
                  .alias(action.getValue())
                  .get());
            break;
      }

      return withContext(operation);
   }

}
