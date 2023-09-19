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
package com.eclipsesource.uml.glsp.uml.elements.information_flow.features;

import java.util.Optional;

import org.eclipse.uml2.uml.InformationFlow;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.information_flow.InformationFlowConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.information_flow.InformationFlowOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.modelserver.uml.elements.information_flow.commands.UpdateInformationFlowArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class InformationFlowPropertyMapper extends RepresentationElementPropertyMapper<InformationFlow> {

   @Inject
   public InformationFlowPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final InformationFlow source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(InformationFlowConfiguration.Property.class, elementId)
         .text(InformationFlowConfiguration.Property.NAME, "Name", source.getName())
         .items();

      return new PropertyPalette(elementId, "Information Flow", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var handler = getHandler(InformationFlowOperationHandler.class, action);
      UpdateOperation operation = null;

      operation = handler.withArgument(
         UpdateInformationFlowArgument.by()
            .name(action.getValue())
            .build());

      return withContext(operation);

   }
}
