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
package com.borkdominik.big.glsp.uml.uml.elements.abstraction;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.Abstraction;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.UMLFactory;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateEdgeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFEdgeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateEdgeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class AbstractionOperationHandler extends BGEMFEdgeOperationHandler<Abstraction, NamedElement, NamedElement> {

   @Inject
   public AbstractionOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateEdgeSemanticCommand<Abstraction, NamedElement, NamedElement, ?> createSemanticCommand(
      final CreateEdgeOperation operation, final NamedElement source, final NamedElement target) {
      var argument = UMLCreateEdgeCommand.Argument
         .<Abstraction, NamedElement, NamedElement> createEdgeArgumentBuilder()
         .supplier((s, t) -> {
             var name = "";
             if (operation.getArgs() != null) {
                 name = operation.getArgs().getOrDefault("name", null);

             }
            var element = UMLFactory.eINSTANCE.createAbstraction();

            element.getClients().add(source);
            element.getSuppliers().add(target);
            element.setName(name);

            source.getNearestPackage().getPackagedElements().add(element);
            return element;
         })
         .build();

      return new UMLCreateEdgeCommand<>(commandContext, source, target, argument);
   }

}
