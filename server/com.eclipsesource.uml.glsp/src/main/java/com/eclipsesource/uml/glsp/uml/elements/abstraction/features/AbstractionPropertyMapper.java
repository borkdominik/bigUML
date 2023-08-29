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
package com.eclipsesource.uml.glsp.uml.elements.abstraction.features;

import java.util.Optional;

import org.eclipse.uml2.uml.Abstraction;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.abstraction.AbstractionConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.abstraction.AbstractionOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.abstraction.commands.UpdateAbstractionArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class AbstractionPropertyMapper extends RepresentationElementPropertyMapper<Abstraction> {

   @Inject
   public AbstractionPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final Abstraction source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(AbstractionConfiguration.Property.class, elementId)
         .text(AbstractionConfiguration.Property.NAME, "Name", source.getName())
         .choice(
            AbstractionConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .items();

      return new PropertyPalette(elementId, "Abstraction", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(AbstractionConfiguration.Property.class, action);
      var handler = getHandler(AbstractionOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateAbstractionArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateAbstractionArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);
   }

}
