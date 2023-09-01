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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.node;

import org.eclipse.uml2.uml.Node;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class CreateNodeNodeSemanticCommand
   extends BaseCreateSemanticChildCommand<Node, Node> {

   public CreateNodeNodeSemanticCommand(final ModelContext context, final Node parent) {
      super(context, parent);
   }

   @Override
   protected Node createSemanticElement(final Node parent) {

      var nameGenerator = new ListNameGenerator(Node.class, parent.allNamespaces());

      var deploymentSpecifiaction = UMLFactory.eINSTANCE.createNode();
      deploymentSpecifiaction.setName(nameGenerator.newName());

      parent.getNestedNodes().add(deploymentSpecifiaction);

      return deploymentSpecifiaction;
   }

}
