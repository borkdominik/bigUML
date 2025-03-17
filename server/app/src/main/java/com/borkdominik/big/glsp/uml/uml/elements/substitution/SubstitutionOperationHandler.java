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
package com.borkdominik.big.glsp.uml.uml.elements.substitution;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Substitution;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateEdgeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFEdgeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateEdgeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class SubstitutionOperationHandler extends BGEMFEdgeOperationHandler<Substitution, Classifier, Classifier> {

   @Inject
   public SubstitutionOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateEdgeSemanticCommand<Substitution, Classifier, Classifier, ?> createSemanticCommand(
      final CreateEdgeOperation operation, final Classifier source, final Classifier target) {
      var argument = UMLCreateEdgeCommand.Argument
         .<Substitution, Classifier, Classifier> createEdgeArgumentBuilder()
         .supplier((s, t) -> {
            var name = "";
            if (operation.getArgs() != null) {
               name = operation.getArgs().getOrDefault("name", null);

            }
            return s.createSubstitution(name, t);
         })
         .build();

      return new UMLCreateEdgeCommand<>(commandContext, source, target, argument);
   }

}
