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
package com.eclipsesource.uml.glsp.uml.elements.enumeration.features;

import java.util.Optional;

import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.enumeration.EnumerationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.enumeration.EnumerationOperationHandler;
import com.eclipsesource.uml.glsp.uml.elements.enumeration_literal.utils.EnumerationLiteralPropertyPaletteUtils;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.enumeration.commands.UpdateEnumerationArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class EnumerationPropertyMapper extends RepresentationElementPropertyMapper<Enumeration> {

   @Inject
   public EnumerationPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final Enumeration source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(EnumerationConfiguration.Property.class, elementId)
         .text(EnumerationConfiguration.Property.NAME, "Name", source.getName())
         .bool(EnumerationConfiguration.Property.IS_ABSTRACT, "Is abstract", source.isAbstract())
         .choice(
            EnumerationConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .reference(EnumerationLiteralPropertyPaletteUtils.asReference(this, elementId,
            EnumerationConfiguration.Property.OWNED_LITERALS, "Owned Literal", source.getOwnedLiterals()))
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(EnumerationConfiguration.Property.class, action);
      var handler = getHandler(EnumerationOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateEnumerationArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case IS_ABSTRACT:
            operation = handler.withArgument(
               UpdateEnumerationArgument.by()
                  .isAbstract(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateEnumerationArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);
   }

}
