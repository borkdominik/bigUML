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
package com.borkdominik.big.glsp.uml.uml.elements.pseudostate;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Pseudostate;
import org.eclipse.uml2.uml.PseudostateKind;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.UMLFactory;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateNodeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFNodeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateNodeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PseudostateOperationHandler extends BGEMFNodeOperationHandler<Pseudostate, Region> {

   @Inject
   public PseudostateOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateNodeSemanticCommand<Pseudostate, Region, ?> createSemanticCommand(
      final CreateNodeOperation operation,
      final Region parent) {
      var argument = UMLCreateNodeCommand.Argument
         .<Pseudostate, Region> createChildArgumentBuilder()
         .supplier((x) -> createNode(operation, x))
         .build();

      return new UMLCreateNodeCommand<>(commandContext, parent, argument);
   }

   protected Pseudostate createNode(final CreateNodeOperation operation, final Region parent) {
      PseudostateKind kind;

      if (operation.getElementTypeId().equals(UMLTypes.CHOICE.prefix(representation))) {
         kind = PseudostateKind.CHOICE_LITERAL;
      } else if (operation.getElementTypeId().equals(UMLTypes.DEEP_HISTORY.prefix(representation))) {
         kind = PseudostateKind.DEEP_HISTORY_LITERAL;
      } else if (operation.getElementTypeId().equals(UMLTypes.FORK.prefix(representation))) {
         kind = PseudostateKind.FORK_LITERAL;
      } else if (operation.getElementTypeId().equals(UMLTypes.INITIAL_STATE.prefix(representation))) {
         kind = PseudostateKind.INITIAL_LITERAL;
      } else if (operation.getElementTypeId().equals(UMLTypes.JOIN.prefix(representation))) {
         kind = PseudostateKind.JOIN_LITERAL;
      } else if (operation.getElementTypeId().equals(UMLTypes.SHALLOW_HISTORY.prefix(representation))) {
         kind = PseudostateKind.SHALLOW_HISTORY_LITERAL;
      } else {
         throw new IllegalStateException("Provided typeId " + operation.getElementTypeId() + " is not supported.");
      }

      var pseudostate = UMLFactory.eINSTANCE.createPseudostate();
      pseudostate.setKind(kind);

      parent.getSubvertices().add(pseudostate);

      return pseudostate;
   }
}
