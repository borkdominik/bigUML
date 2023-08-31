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
package com.eclipsesource.uml.glsp.uml.elements.pseudostate;

import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Pseudostate;
import org.eclipse.uml2.uml.PseudostateKind;
import org.eclipse.uml2.uml.Region;

import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationRegistry;
import com.eclipsesource.uml.glsp.uml.handler.element.NodeOperationHandler;
import com.eclipsesource.uml.modelserver.uml.elements.pseudostate.commands.CreatePseudostateArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PseudostateOperationHandler extends NodeOperationHandler<Pseudostate, Region> {

   @Inject
   public PseudostateOperationHandler(@Assisted final Representation representation,
      final ElementConfigurationRegistry registry) {
      super(representation, registry.accessTyped(representation, Pseudostate.class).allTypeIds());
   }

   @Override
   protected CreatePseudostateArgument createArgument(final CreateNodeOperation operation, final Region parent) {
      var elementTypeId = operation.getElementTypeId();
      var config = configuration(PseudostateConfiguration.class);

      if (elementTypeId.equals(config.choiceTypeId())) {
         return new CreatePseudostateArgument(PseudostateKind.CHOICE_LITERAL);
      } else if (elementTypeId.equals(config.deepHistoryTypeId())) {
         return new CreatePseudostateArgument(PseudostateKind.DEEP_HISTORY_LITERAL);
      } else if (elementTypeId.equals(config.forkTypeId())) {
         return new CreatePseudostateArgument(PseudostateKind.FORK_LITERAL);
      } else if (elementTypeId.equals(config.initialStateTypeId())) {
         return new CreatePseudostateArgument(PseudostateKind.INITIAL_LITERAL);
      } else if (elementTypeId.equals(config.joinTypeId())) {
         return new CreatePseudostateArgument(PseudostateKind.JOIN_LITERAL);
      } else if (elementTypeId.equals(config.shallowHistoryTypeId())) {
         return new CreatePseudostateArgument(PseudostateKind.SHALLOW_HISTORY_LITERAL);
      }

      throw new IllegalStateException(String.format("The elementTypeId %s could not be handled", elementTypeId));
   }
}
