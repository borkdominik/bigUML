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
package com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.include;

import org.eclipse.uml2.uml.Include;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public class CreateIncludeSemanticCommand
   extends BaseCreateSemanticRelationCommand<Include, UseCase, UseCase> {

   public CreateIncludeSemanticCommand(final ModelContext context,
      final UseCase source, final UseCase target) {
      super(context, source, target);
   }

   @Override
   protected Include createSemanticElement(final UseCase source, final UseCase traget) {
      var includes = source.getIncludes();
      return source.createInclude(null, traget);
   }
}
