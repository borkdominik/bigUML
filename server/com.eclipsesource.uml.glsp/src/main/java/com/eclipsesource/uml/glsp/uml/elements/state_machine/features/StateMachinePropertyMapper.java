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
package com.eclipsesource.uml.glsp.uml.elements.state_machine.features;

import java.util.Optional;

import org.eclipse.uml2.uml.StateMachine;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.state_machine.StateMachineConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.state_machine.StateMachineOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.modelserver.uml.elements.state_machine.commands.UpdateStateMachineArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class StateMachinePropertyMapper extends RepresentationElementPropertyMapper<StateMachine> {

   @Inject
   public StateMachinePropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final StateMachine source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(StateMachineConfiguration.Property.class, elementId)
         .text(StateMachineConfiguration.Property.NAME, "Name", source.getName())
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(StateMachineConfiguration.Property.class, action);
      var handler = getHandler(StateMachineOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateStateMachineArgument.by()
                  .name(action.getValue())
                  .build());
            break;
      }

      return withContext(operation);

   }

}
