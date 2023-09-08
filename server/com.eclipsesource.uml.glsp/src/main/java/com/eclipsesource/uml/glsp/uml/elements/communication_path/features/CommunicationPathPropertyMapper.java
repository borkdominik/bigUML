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
package com.eclipsesource.uml.glsp.uml.elements.communication_path.features;

import java.util.Optional;

import org.eclipse.uml2.uml.CommunicationPath;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.communication_path.CommunicationPathConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.communication_path.CommunicationPathOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.modelserver.uml.elements.communication_path.commands.UpdateCommunicationPathArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class CommunicationPathPropertyMapper extends RepresentationElementPropertyMapper<CommunicationPath> {

   @Inject
   public CommunicationPathPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final CommunicationPath source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(CommunicationPathConfiguration.Property.class, elementId)
         .text(CommunicationPathConfiguration.Property.NAME, "Name", source.getName())
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(CommunicationPathConfiguration.Property.class, action);
      var handler = getHandler(CommunicationPathOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateCommunicationPathArgument.by()
                  .name(action.getValue())
                  .build());
            break;
      }

      return withContext(operation);

   }

}
