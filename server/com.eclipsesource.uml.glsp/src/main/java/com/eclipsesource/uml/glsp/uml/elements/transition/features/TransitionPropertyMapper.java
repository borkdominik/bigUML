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
package com.eclipsesource.uml.glsp.uml.elements.transition.features;

import java.util.Optional;

import org.eclipse.uml2.uml.Transition;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.transition.TransitionConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.transition.TransitionOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.modelserver.uml.elements.transition.commands.UpdateTransitionArgument;

public class TransitionPropertyMapper extends BaseDiagramElementPropertyMapper<Transition> {

   @Override
   public PropertyPalette map(final Transition source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(TransitionConfiguration.Property.class, elementId)
         .text(TransitionConfiguration.Property.NAME, "Name", source.getName())
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(TransitionConfiguration.Property.class, action);
      var handler = getHandler(TransitionOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateTransitionArgument.by()
                  .name(action.getValue())
                  .build());
            break;
      }

      return withContext(operation);

   }

}
