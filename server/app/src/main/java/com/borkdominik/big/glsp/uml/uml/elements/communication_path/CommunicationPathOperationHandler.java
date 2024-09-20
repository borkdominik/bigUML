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
package com.borkdominik.big.glsp.uml.uml.elements.communication_path;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.AggregationKind;
import org.eclipse.uml2.uml.CommunicationPath;
import org.eclipse.uml2.uml.Node;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFEdgeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateEdgeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class CommunicationPathOperationHandler extends BGEMFEdgeOperationHandler<CommunicationPath, Node, Node> {

   @Inject
   public CommunicationPathOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateSemanticCommand<CommunicationPath> createSemanticCommand(
      final CreateEdgeOperation operation, final Node source, final Node target) {
      var argument = UMLCreateEdgeCommand.Argument
         .<CommunicationPath, Node, Node> createEdgeArgumentBuilder()
         .supplier((s, t) -> {
            return source.createCommunicationPath(true,
               AggregationKind.NONE_LITERAL,
               target.getName(),
               1, 1,
               target,
               true,
               AggregationKind.NONE_LITERAL,
               source.getName(),
               1, 1);
         })
         .initName(true)
         .build();

      return new UMLCreateEdgeCommand<>(commandContext, source, target, argument);
   }

}
