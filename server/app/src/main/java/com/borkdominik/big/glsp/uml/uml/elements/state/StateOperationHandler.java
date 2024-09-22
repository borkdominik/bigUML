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
package com.borkdominik.big.glsp.uml.uml.elements.state;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.State;
import org.eclipse.uml2.uml.UMLFactory;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateNodeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFNodeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateNodeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class StateOperationHandler extends BGEMFNodeOperationHandler<State, Element> {

   @Inject
   public StateOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateNodeSemanticCommand<State, Element, ?> createSemanticCommand(
      final CreateNodeOperation operation,
      final Element parent) {
      var argument = UMLCreateNodeCommand.Argument
         .<State, Element> createChildArgumentBuilder()
         .supplier((x) -> {
            if (x instanceof Region par) {
               var state = UMLFactory.eINSTANCE.createState();

               par.getSubvertices().add(state);

               return state;
            } else if (x instanceof State par) {

               var state = UMLFactory.eINSTANCE.createState();
               var region = UMLFactory.eINSTANCE.createRegion();

               par.getRegions().add(region);
               region.getSubvertices().add(state);

               return state;
            }

            return null;
         })
         .build();

      return new UMLCreateNodeCommand<>(commandContext, parent, argument);
   }

}
