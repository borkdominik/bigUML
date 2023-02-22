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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.substitution;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.Classifier;

import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Substitution;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateEdgeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.substitution.CreateSubstitutionContribution;

public final class CreateSubstitutionHandler
   extends BaseCreateEdgeHandler<Classifier, Classifier> {

   public CreateSubstitutionHandler() {
      super(UmlClass_Substitution.TYPE_ID);
   }

   @Override
   protected CCommand createCommand(final CreateEdgeOperation operation, final Classifier source,
      final Classifier target) {
      return CreateSubstitutionContribution.create(source, target);
   }

}
