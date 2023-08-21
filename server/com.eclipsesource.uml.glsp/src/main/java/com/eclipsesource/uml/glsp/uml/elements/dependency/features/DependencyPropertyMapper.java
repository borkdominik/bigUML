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
package com.eclipsesource.uml.glsp.uml.elements.dependency.features;

import java.util.Optional;

import org.eclipse.uml2.uml.Dependency;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.dependency.DependencyConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.dependency.DependencyOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.dependency.commands.UpdateDependencyArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class DependencyPropertyMapper extends RepresentationElementPropertyMapper<Dependency> {

   @Inject
   public DependencyPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final Dependency source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(DependencyConfiguration.Property.class, elementId)
         .text(DependencyConfiguration.Property.NAME, "Name", source.getName())
         .choice(
            DependencyConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .items();

      return new PropertyPalette(elementId, "Abstraction", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(DependencyConfiguration.Property.class, action);
      var handler = getHandler(DependencyOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateDependencyArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateDependencyArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);
   }

}
