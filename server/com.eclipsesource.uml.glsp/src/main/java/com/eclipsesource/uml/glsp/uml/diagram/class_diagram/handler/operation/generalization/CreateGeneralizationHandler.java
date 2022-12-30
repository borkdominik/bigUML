/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.generalization;

import java.util.List;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.Classifier;

import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateEdgeBetweenNodesHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization.AddGeneralizationContribution;

public final class CreateGeneralizationHandler
   extends BaseCreateEdgeBetweenNodesHandler<Classifier, Classifier> {

   public CreateGeneralizationHandler() {
      super(ClassTypes.CLASS_GENERALIZATION);
   }

   @Override
   protected List<String> sources() {
      return List.of(ClassTypes.CLASS, ClassTypes.ABSTRACT_CLASS);
   }

   @Override
   protected List<String> targets() {
      return List.of(ClassTypes.CLASS, ClassTypes.ABSTRACT_CLASS);
   }

   @Override
   protected CCommand createCommand(final CreateEdgeOperation operation, final Classifier source,
      final Classifier target) {
      return AddGeneralizationContribution.create(source, target);
   }

}
