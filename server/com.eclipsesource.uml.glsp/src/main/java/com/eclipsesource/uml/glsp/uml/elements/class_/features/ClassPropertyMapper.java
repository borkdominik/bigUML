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
package com.eclipsesource.uml.glsp.uml.elements.class_.features;

import java.util.Optional;

import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.class_.ClassConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.class_.ClassOperationHandler;
import com.eclipsesource.uml.glsp.uml.elements.operation.utils.OperationPropertyPaletteUtils;
import com.eclipsesource.uml.glsp.uml.elements.property.utils.PropertyPropertyPaletteUtils;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.class_.commands.UpdateClassArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ClassPropertyMapper extends RepresentationElementPropertyMapper<Class> {

   @Inject
   public ClassPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final Class source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(ClassConfiguration.Property.class, elementId)
         .text(ClassConfiguration.Property.NAME, "Name", source.getName())
         .bool(ClassConfiguration.Property.IS_ABSTRACT, "Is abstract", source.isAbstract())
         .bool(ClassConfiguration.Property.IS_ACTIVE, "Is active", source.isActive())
         .choice(
            ClassConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .reference(PropertyPropertyPaletteUtils.asReference(this, elementId,
            ClassConfiguration.Property.OWNED_ATTRIBUTES, "Owned Attribute", source.getOwnedAttributes()))
         .reference(OperationPropertyPaletteUtils.asReference(this, elementId,
            ClassConfiguration.Property.OWNED_OPERATIONS, "Owned Operation", source.getOwnedOperations()))
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(ClassConfiguration.Property.class, action);
      var handler = getHandler(ClassOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateClassArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case IS_ABSTRACT:
            operation = handler.withArgument(
               UpdateClassArgument.by()
                  .isAbstract(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case IS_ACTIVE:
            operation = handler.withArgument(
               UpdateClassArgument.by()
                  .isActive(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateClassArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);

   }

}
