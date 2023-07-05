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
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public class CreateExtendSemanticCommand extends BaseCreateSemanticRelationCommand<Extend, UseCase, UseCase> {

   public CreateExtendSemanticCommand(final ModelContext context,
      final UseCase source, final UseCase target) {
      super(context, source, target);
   }

   @Override
   protected Extend createSemanticElement(final UseCase source, final UseCase target) {
      return source.createExtend("TODO: What is this name?", target);
   }
}
