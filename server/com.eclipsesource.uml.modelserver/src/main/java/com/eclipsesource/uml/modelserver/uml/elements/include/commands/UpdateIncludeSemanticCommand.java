/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.elements.include.commands;

import java.util.List;

import org.eclipse.uml2.uml.Include;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementSemanticCommand;

public class UpdateIncludeSemanticCommand
   extends BaseUpdateSemanticElementCommand<Include, UpdateIncludeArgument> {

   public UpdateIncludeSemanticCommand(final ModelContext context, final Include semanticElement,
      final UpdateIncludeArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Include semanticElement,
      final UpdateIncludeArgument updateArgument) {
      include(List.of(new UpdateNamedElementSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.includingCaseId().ifPresent(arg -> {
         semanticElement.setIncludingCase(semanticElementAccessor.getElement(arg, UseCase.class).get());
      });

      updateArgument.additionId().ifPresent(arg -> {
         semanticElement.setAddition(semanticElementAccessor.getElement(arg, UseCase.class).get());
      });
   }
}
