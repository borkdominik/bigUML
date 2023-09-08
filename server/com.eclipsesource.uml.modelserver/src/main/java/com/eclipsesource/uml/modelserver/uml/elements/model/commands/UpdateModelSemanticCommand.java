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
package com.eclipsesource.uml.modelserver.uml.elements.model.commands;

import java.util.List;

import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.package_.commands.UpdatePackageSemanticCommand;

public final class UpdateModelSemanticCommand
   extends BaseUpdateSemanticElementCommand<Model, UpdateModelArgument> {

   public UpdateModelSemanticCommand(final ModelContext context, final Model semanticElement,
      final UpdateModelArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Model semanticElement,
      final UpdateModelArgument updateArgument) {
      include(List.of(new UpdatePackageSemanticCommand(context, semanticElement, updateArgument)));

   }

}
