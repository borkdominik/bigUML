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
package com.eclipsesource.uml.glsp.uml.elements.element_import.features;

import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.ElementImport;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.element_import.ElementImportConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.element_import.ElementImportOperationHandler;
import com.eclipsesource.uml.glsp.uml.elements.package_.utils.PackageVisibilityKindUtils;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.ElementImportUtils;
import com.eclipsesource.uml.modelserver.uml.elements.element_import.commands.UpdateElementImportArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ElementImportPropertyMapper extends RepresentationElementPropertyMapper<ElementImport> {

   @Inject
   public ElementImportPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final ElementImport source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(ElementImportConfiguration.Property.class, elementId)
         .choice(
            ElementImportConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            PackageVisibilityKindUtils.getVisibilityChoices(),
            source.getVisibility().getLiteral())
         .reference(
            ElementImportConfiguration.Property.IMPORTED_ELEMENT,
            "Imported Element",
            ElementImportUtils.asReferenceFromPackageableElement(List.of(source.getImportedElement()), idGenerator),
            List.of(),
            false)
         .text(
            ElementImportConfiguration.Property.ALIAS,
            "Alias",
            source.getAlias())
         .items();

      return new PropertyPalette(elementId, "Element Import", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(ElementImportConfiguration.Property.class, action);
      var handler = getHandler(ElementImportOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateElementImportArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
         case ALIAS:
            operation = handler.withArgument(
               UpdateElementImportArgument.by()
                  .alias(action.getValue())
                  .build());
            break;
      }

      return withContext(operation);
   }

}
