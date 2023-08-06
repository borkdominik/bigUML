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
package com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.usecase;

import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public class DeleteUseCaseSematicCommand extends BaseDeleteSemanticChildCommand<Object, UseCase> {

   public DeleteUseCaseSematicCommand(final ModelContext context, final UseCase semanticElement) {
      super(context, semanticElement.getModel(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Object parent, final UseCase child) {
      for (var subject : child.getSubjects()) {
         subject.getOwnedUseCases().remove(child);
      }
      try {
         var model = (Model) parent;
         model.getPackagedElements().remove(child);
      } catch (Exception e) {}
   }
}
