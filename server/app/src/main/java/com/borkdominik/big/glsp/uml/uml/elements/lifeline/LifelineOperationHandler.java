/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.lifeline;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateNodeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFNodeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateNodeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class LifelineOperationHandler extends BGEMFNodeOperationHandler<Lifeline, Interaction> {

   @Inject
   public LifelineOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateNodeSemanticCommand<Lifeline, Interaction, ?> createSemanticCommand(
      final CreateNodeOperation operation,
      final Interaction parent) {
      var argument = UMLCreateNodeCommand.Argument
         .<Lifeline, Interaction> createChildArgumentBuilder()
         .supplier((x) -> x.createLifeline(null))
         .build();

      return new UMLCreateNodeCommand<>(commandContext, parent, argument);
   }

}
