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
package com.eclipsesource.uml.modelserver.uml.elements.generalization.commands;

import java.util.List;

import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.element.UpdateElementSemanticCommand;

public class UpdateGeneralizationSemanticCommand
   extends BaseUpdateSemanticElementCommand<Generalization, UpdateGeneralizationArgument> {

   public UpdateGeneralizationSemanticCommand(final ModelContext context, final Generalization semanticElement,
      final UpdateGeneralizationArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Generalization semanticElement,
      final UpdateGeneralizationArgument updateArgument) {
      include(List.of(new UpdateElementSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.isSubstitutable().ifPresent(arg -> {
         semanticElement.setIsSubstitutable(arg);
      });

      updateArgument.generalId().ifPresent(arg -> {
         semanticElement.setGeneral(semanticElementAccessor.getElement(arg, Classifier.class).get());
      });

      updateArgument.specificId().ifPresent(arg -> {
         semanticElement.setSpecific(semanticElementAccessor.getElement(arg, Classifier.class).get());
      });
   }

}
