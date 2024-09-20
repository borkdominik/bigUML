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
package com.borkdominik.big.glsp.uml.uml.elements.control_flow;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ControlFlow;
import org.eclipse.uml2.uml.UMLFactory;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateEdgeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFEdgeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateEdgeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ControlFlowOperationHandler extends BGEMFEdgeOperationHandler<ControlFlow, ActivityNode, ActivityNode> {

   @Inject
   public ControlFlowOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateEdgeSemanticCommand<ControlFlow, ActivityNode, ActivityNode, ?> createSemanticCommand(
      final CreateEdgeOperation operation, final ActivityNode source, final ActivityNode target) {
      var argument = UMLCreateEdgeCommand.Argument
         .<ControlFlow, ActivityNode, ActivityNode> createEdgeArgumentBuilder()
         .supplier((s, t) -> {
            var controlFlow = UMLFactory.eINSTANCE.createControlFlow();

            controlFlow.setSource(source);
            controlFlow.setTarget(target);

            controlFlow.setActivity(source.getActivity());

            return controlFlow;
         })
         .build();

      return new UMLCreateEdgeCommand<>(commandContext, source, target, argument);
   }

}
