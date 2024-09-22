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
package com.borkdominik.big.glsp.uml.uml.elements.information_flow;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.InformationFlow;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.UMLFactory;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateEdgeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFEdgeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateEdgeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class InformationFlowOperationHandler
   extends BGEMFEdgeOperationHandler<InformationFlow, NamedElement, NamedElement> {

   @Inject
   public InformationFlowOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateEdgeSemanticCommand<InformationFlow, NamedElement, NamedElement, ?> createSemanticCommand(
      final CreateEdgeOperation operation, final NamedElement source, final NamedElement target) {
      var argument = UMLCreateEdgeCommand.Argument
         .<InformationFlow, NamedElement, NamedElement> createEdgeArgumentBuilder()
         .supplier((s, t) -> {
            var informationFlow = UMLFactory.eINSTANCE.createInformationFlow();
            informationFlow.getInformationSources().add(source);
            informationFlow.getInformationTargets().add(target);
            source.getNearestPackage().getPackagedElements().add(informationFlow);
            return informationFlow;
         })
         .build();

      return new UMLCreateEdgeCommand<>(commandContext, source, target, argument);
   }

}
