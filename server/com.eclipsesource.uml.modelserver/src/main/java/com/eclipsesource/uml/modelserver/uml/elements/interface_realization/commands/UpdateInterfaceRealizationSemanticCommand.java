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
package com.eclipsesource.uml.modelserver.uml.elements.interface_realization.commands;

import java.util.List;

import org.eclipse.uml2.uml.BehavioredClassifier;
import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.InterfaceRealization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.abstraction.commands.UpdateAbstractionSemanticCommand;

public class UpdateInterfaceRealizationSemanticCommand
   extends BaseUpdateSemanticElementCommand<InterfaceRealization, UpdateInterfaceRealizationArgument> {

   public UpdateInterfaceRealizationSemanticCommand(final ModelContext context,
      final InterfaceRealization semanticElement,
      final UpdateInterfaceRealizationArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final InterfaceRealization semanticElement,
      final UpdateInterfaceRealizationArgument updateArgument) {
      include(List.of(new UpdateAbstractionSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.implementingClassifierId().ifPresent(arg -> {
         semanticElement
            .setImplementingClassifier(semanticElementAccessor.getElement(arg, BehavioredClassifier.class).get());
      });

      updateArgument.contractId().ifPresent(arg -> {
         semanticElement
            .setContract(semanticElementAccessor.getElement(arg, Interface.class).get());

      });
   }

}
