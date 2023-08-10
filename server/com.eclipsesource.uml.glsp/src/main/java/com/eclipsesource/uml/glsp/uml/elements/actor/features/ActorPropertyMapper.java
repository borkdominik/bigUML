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
package com.eclipsesource.uml.glsp.uml.elements.actor.features;

import java.util.Optional;

import org.eclipse.uml2.uml.Actor;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.actor.ActorDefaultHandler;
import com.eclipsesource.uml.glsp.uml.elements.actor.ActorConfiguration;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.modelserver.uml.elements.actor.commands.UpdateActorArgument;

public class ActorPropertyMapper extends BaseDiagramElementPropertyMapper<Actor> {

   @Override
   public PropertyPalette map(final Actor source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(ActorConfiguration.Property.class, elementId)
         .text(ActorConfiguration.Property.NAME, "Name", source.getName())
         .bool(ActorConfiguration.Property.IS_ABSTRACT, "Is abstract", source.isAbstract())
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(ActorConfiguration.Property.class, action);
      var handler = getHandler(ActorDefaultHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdateActorArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
         case IS_ABSTRACT:
            operation = handler.withArgument(
               new UpdateActorArgument.Builder()
                  .isAbstract(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
      }

      return withContext(operation);
   }
}
