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
package com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.subject;

import java.util.ArrayList;

import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public class DeleteSubjectSemanticCommand extends BaseDeleteSemanticChildCommand<Model, Component> {

   public DeleteSubjectSemanticCommand(final ModelContext context, final Component semanticElement) {
      super(context, semanticElement.getModel(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Model parent, final Component child) {
      ArrayList<UseCase> ucs = new ArrayList<>();
      for (var uc : child.getOwnedUseCases()) {
         ucs.add(uc);
      }
      parent.getPackagedElements().remove(child);
      for (var uc : ucs) {
         uc.getSubjects().remove(child);
         parent.getPackagedElements().add(uc);
      }

   }
}
