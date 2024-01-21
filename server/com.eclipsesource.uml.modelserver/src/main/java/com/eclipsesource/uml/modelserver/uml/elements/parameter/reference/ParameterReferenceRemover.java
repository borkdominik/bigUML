/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.elements.parameter.reference;

import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.uml2.uml.Parameter;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.behavior.cross_delete.ExistenceBasedCrossReferenceDeleteBehavior;
import com.eclipsesource.uml.modelserver.uml.elements.parameter.commands.UpdateParameterArgument;
import com.eclipsesource.uml.modelserver.uml.elements.parameter.commands.UpdateParameterSemanticCommand;

public final class ParameterReferenceRemover extends ExistenceBasedCrossReferenceDeleteBehavior<Parameter> {

   @Override
   protected List<Command> handle(final ModelContext context, final Setting setting, final Parameter self,
      final EObject interest) {
      if (interest.equals(self.getType())) {
         return List.of(new UpdateParameterSemanticCommand(
            context,
            self,
            UpdateParameterArgument.by()
               .typeId("")
               .build()));
      }
      return List.of();
   }
}
