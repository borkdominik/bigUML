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
package com.eclipsesource.uml.glsp.uml.elements.literal_specification;

import java.util.Set;

import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.LiteralBoolean;
import org.eclipse.uml2.uml.LiteralInteger;
import org.eclipse.uml2.uml.LiteralSpecification;
import org.eclipse.uml2.uml.LiteralString;
import org.eclipse.uml2.uml.Slot;

import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationRegistry;
import com.eclipsesource.uml.glsp.uml.handler.element.NodeOperationHandler;
import com.eclipsesource.uml.modelserver.uml.elements.literal_specification.commands.AddLiteralSpecificationArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class LiteralSpecificationOperationHandler
   extends NodeOperationHandler<LiteralSpecification, Slot> {

   @Override
   public Set<Class<? extends LiteralSpecification>> getElementTypes() {
      return Set.of(getElementType(), LiteralBoolean.class, LiteralString.class, LiteralInteger.class);
   }

   @Inject
   public LiteralSpecificationOperationHandler(@Assisted final Representation representation,
      final ElementConfigurationRegistry registry) {
      super(representation, Set.of(
         registry.accessTyped(representation, LiteralSpecification.class, LiteralSpecificationConfiguration.class)
            .literalBooleanTypeId(),

         registry.accessTyped(representation, LiteralSpecification.class, LiteralSpecificationConfiguration.class)
            .literalStringTypeId(),

         registry.accessTyped(representation, LiteralSpecification.class, LiteralSpecificationConfiguration.class)
            .literalIntegerTypeId()));
   }

   @Override
   protected Object createArgument(final CreateNodeOperation operation, final Slot parent) {
      var configuration = configurationFor(LiteralSpecification.class, LiteralSpecificationConfiguration.class);
      if (operation.getElementTypeId().equals(configuration.literalBooleanTypeId())) {
         return new AddLiteralSpecificationArgument(LiteralBoolean.class);
      } else if (operation.getElementTypeId().equals(configuration.literalStringTypeId())) {
         return new AddLiteralSpecificationArgument(LiteralString.class);
      } else if (operation.getElementTypeId().equals(configuration.literalIntegerTypeId())) {
         return new AddLiteralSpecificationArgument(LiteralInteger.class);
      }

      throw new IllegalArgumentException();
   }
}
