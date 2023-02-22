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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.reference;

import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.uml2.uml.Parameter;

import com.eclipsesource.uml.modelserver.shared.matcher.BaseCrossReferenceProcessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.parameter.UpdateParameterArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.parameter.UpdateParameterSemanticCommand;

public final class ParameterReferenceRemover extends BaseCrossReferenceProcessor<Parameter> {

   @Override
   public List<Command> process(final ModelContext context, final Setting setting, final EObject interest) {
      if (selfType.isInstance(setting.getEObject())) {
         return process(context, setting, selfType.cast(setting.getEObject()), interest);
      }

      return List.of();
   }

   @Override
   protected List<Command> process(final ModelContext context, final Setting setting, final Parameter self,
      final EObject interest) {
      if (interest.equals(self.getType())) {
         return List.of(new UpdateParameterSemanticCommand(
            context,
            self,
            new UpdateParameterArgument.Builder()
               .typeId("")
               .get()));
      }
      return List.of();
   }
}
