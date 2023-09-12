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
package com.eclipsesource.uml.glsp.uml.elements.literal_specification.features;

import java.util.Optional;
import java.util.Set;

import org.eclipse.uml2.uml.LiteralBoolean;
import org.eclipse.uml2.uml.LiteralInteger;
import org.eclipse.uml2.uml.LiteralSpecification;
import org.eclipse.uml2.uml.LiteralString;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.literal_specification.LiteralSpecificationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.literal_specification.LiteralSpecificationOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.modelserver.uml.elements.literal_specification.commands.UpdateLiteralSpecificationArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class LiteralSpecificationPropertyMapper extends RepresentationElementPropertyMapper<LiteralSpecification> {

   @Inject
   public LiteralSpecificationPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public Set<Class<? extends LiteralSpecification>> getElementTypes() {
      return Set.of(getElementType(), LiteralBoolean.class, LiteralString.class, LiteralInteger.class);
   }

   @Override
   public PropertyPalette map(final LiteralSpecification source) {

      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(LiteralSpecificationConfiguration.Property.class, elementId)
         .text(LiteralSpecificationConfiguration.Property.NAME, "Name", source.getName())
         .text(LiteralSpecificationConfiguration.Property.VALUE, "Value", source.stringValue())
         .items();

      return new PropertyPalette(elementId, "LiteralSpecification", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(LiteralSpecificationConfiguration.Property.class, action);
      var handler = getHandler(LiteralSpecificationOperationHandler.class, action);

      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateLiteralSpecificationArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case VALUE:
            operation = handler.withArgument(
               UpdateLiteralSpecificationArgument.by()
                  .value(action.getValue())
                  .build());
            break;
      }

      return withContext(operation);
   }
}
