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
package com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.usecase;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_UseCase;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.usecase.UpdateUseCaseArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.usecase.UpdateUseCaseContribution;

public class UpdateUseCaseHandler
   extends BaseUpdateElementHandler<UseCase, UpdateUseCaseArgument> {

   public UpdateUseCaseHandler() {
      super(UmlUseCase_UseCase.typeId());
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final UseCase element,
      final UpdateUseCaseArgument updateArgument) {
      return UpdateUseCaseContribution.create(element, updateArgument);
   }
}
