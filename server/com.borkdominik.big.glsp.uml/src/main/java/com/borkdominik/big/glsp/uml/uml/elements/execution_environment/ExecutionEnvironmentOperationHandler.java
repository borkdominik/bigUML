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
package com.borkdominik.big.glsp.uml.uml.elements.execution_environment;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.Node;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UMLFactory;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFNodeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.elements.node.commands.CreateNestedNodeCommand;
import com.borkdominik.big.glsp.uml.uml.elements.packageable_element.CreatePackagableElementCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ExecutionEnvironmentOperationHandler extends BGEMFNodeOperationHandler<ExecutionEnvironment, Element> {

   @Inject
   public ExecutionEnvironmentOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateSemanticCommand<ExecutionEnvironment> createSemanticCommand(
      final CreateNodeOperation operation,
      final Element parent) {
      if (parent instanceof Package p) {
         var argument = CreatePackagableElementCommand.Argument
            .<ExecutionEnvironment> createPackageableElementArgumentBuilder()
            .supplier((x) -> UMLFactory.eINSTANCE.createExecutionEnvironment())
            .build();

         return new CreatePackagableElementCommand<>(commandContext, p, argument);
      } else if (parent instanceof Node n) {
         var argument = CreateNestedNodeCommand.Argument
            .<ExecutionEnvironment> createNestedNodeArgumentBuilder()
            .supplier((x) -> UMLFactory.eINSTANCE.createExecutionEnvironment())
            .build();

         return new CreateNestedNodeCommand<>(commandContext, n, argument);
      }

      throw new IllegalArgumentException(String.format("Parent %s can not be handled", parent.getClass().getName()));
   }

}
