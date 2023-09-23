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
package com.eclipsesource.uml.glsp.uml.elements.model.features;

import java.util.Optional;

import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.model.ModelConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.model.ModelOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.model.commands.UpdateModelArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ModelPropertyMapper extends RepresentationElementPropertyMapper<Model> {

   @Inject
   public ModelPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final Model source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(ModelConfiguration.Property.class, elementId)
         .text(ModelConfiguration.Property.NAME, "Name", source.getName())
         .text(ModelConfiguration.Property.URI, "URI", source.getURI())
         .choice(ModelConfiguration.Property.VISIBILITY_KIND, "Visibility", VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(ModelConfiguration.Property.class, action);
      var handler = getHandler(ModelOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateModelArgument.by()
                  .name(action.getValue())
                  .build());
            break;

         case URI:
            operation = handler.withArgument(
               UpdateModelArgument.by()
                  .uri(action.getValue())
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateModelArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);

   }

}
