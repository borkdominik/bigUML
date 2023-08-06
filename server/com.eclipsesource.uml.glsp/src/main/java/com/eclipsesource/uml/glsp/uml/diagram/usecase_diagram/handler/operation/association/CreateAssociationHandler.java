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
package com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.association;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_Association;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateEdgeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.association.CreateAssociationContribution;

public class CreateAssociationHandler extends BaseCreateEdgeHandler<Actor, UseCase> {

   public CreateAssociationHandler() {
      super(UmlUseCase_Association.typeId());
   }

   @Override
   protected CCommand createCommand(final CreateEdgeOperation operation, final Actor source, final UseCase target) {
      return CreateAssociationContribution.create(source, target);
   }
}
