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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.model;

import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;

public final class UpdateModelSemanticCommand
   extends BaseUpdateSemanticElementCommand<Model, UpdateModelArgument> {

   public UpdateModelSemanticCommand(final ModelContext context, final Model semanticElement,
      final UpdateModelArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Model semanticElement,
      final UpdateModelArgument updateArgument) {

      updateArgument.name().ifPresent(arg -> {
         semanticElement.setName(arg);
      });

      updateArgument.uri().ifPresent(arg -> {
         semanticElement.setURI(arg);
      });

      updateArgument.visibilityKind().ifPresent(arg -> {
         semanticElement.setVisibility(arg);
      });

      updateArgument.label().ifPresent(arg -> {
         throw new UnsupportedOperationException();
      });

   }

}
