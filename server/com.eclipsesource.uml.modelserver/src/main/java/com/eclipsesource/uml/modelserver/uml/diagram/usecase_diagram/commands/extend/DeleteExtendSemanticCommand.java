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
package com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.extend;

import org.eclipse.uml2.uml.Extend;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public class DeleteExtendSemanticCommand extends BaseDeleteSemanticChildCommand<UseCase, Extend> {

   public DeleteExtendSemanticCommand(final ModelContext context, final Extend semanticElement) {
      super(context, semanticElement.getExtension(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final UseCase parent, final Extend child) {
      parent.getExtends().remove(child);
   }
}
