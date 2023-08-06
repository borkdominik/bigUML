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
package com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.subject;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Component;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_Subject;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.subject.UpdateSubjectArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.subject.UpdateSubjectContribution;

public class UpdateSubjectHandler extends BaseUpdateElementHandler<Component, UpdateSubjectArgument> {

   public UpdateSubjectHandler() {
      super(UmlUseCase_Subject.typeId());
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final Component element,
      final UpdateSubjectArgument updateArgument) {
      return UpdateSubjectContribution.create(element, updateArgument);
   }
}
