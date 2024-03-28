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
package com.borkdominik.big.glsp.uml.uml.elements.extend;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.Extend;
import org.eclipse.uml2.uml.UseCase;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateEdgeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFEdgeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateEdgeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ExtendOperationHandler extends BGEMFEdgeOperationHandler<Extend, UseCase, UseCase> {

   @Inject
   public ExtendOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateEdgeSemanticCommand<Extend, UseCase, UseCase, ?> createSemanticCommand(
      final CreateEdgeOperation operation, final UseCase source, final UseCase target) {
      var argument = UMLCreateEdgeCommand.Argument
         .<Extend, UseCase, UseCase> createEdgeArgumentBuilder()
         .supplier((s, t) -> {
            return s.createExtend(null, t);
         })
         .build();

      return new UMLCreateEdgeCommand<>(commandContext, source, target, argument);
   }

}
