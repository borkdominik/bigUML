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
package com.eclipsesource.uml.modelserver.uml.elements.control_flow.commands;

import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ControlFlow;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public class CreateControlFlowSemanticCommand
   extends BaseCreateSemanticRelationCommand<ControlFlow, ActivityNode, ActivityNode> {

   public CreateControlFlowSemanticCommand(final ModelContext context,
      final ActivityNode source, final ActivityNode target) {
      super(context, source, target);
   }

   @Override
   protected ControlFlow createSemanticElement(final ActivityNode source, final ActivityNode target) {
      var controlFlow = UMLFactory.eINSTANCE.createControlFlow();

      controlFlow.setSource(source);
      controlFlow.setTarget(target);

      controlFlow.setActivity(source.getActivity());

      return controlFlow;
   }

}
