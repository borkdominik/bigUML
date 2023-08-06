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
package com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.generalization;

import javax.inject.Inject;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.actions.ActionDispatcher;
import org.eclipse.glsp.server.actions.ServerMessageAction;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.types.Severity;
import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_Generalization;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateEdgeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.generalization.CreateGeneralizationContribution;

public final class CreateGeneralizationHandler
   extends BaseCreateEdgeHandler<Classifier, Classifier> {

   @Inject
   private ActionDispatcher actionDispatcher;

   public CreateGeneralizationHandler() {
      super(UmlUseCase_Generalization.typeId());
   }

   @Override
   protected boolean isEdgeCreationValid(final Classifier source, final Classifier target) {
      if ((source instanceof Actor && target instanceof UseCase)
         || (source instanceof UseCase && target instanceof Actor)) {
         actionDispatcher.dispatch(new ServerMessageAction(Severity.ERROR,
            "Generalization between Actor and UseCase is not possible."));

         return false;
      }

      return true;
   }

   @Override
   protected CCommand createCommand(final CreateEdgeOperation operation, final Classifier source,
      final Classifier target) {
      return CreateGeneralizationContribution.create(source, target);
   }
}
