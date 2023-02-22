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
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.shared.matcher.BaseCrossReferenceProcessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.DeletePropertySemanticCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.UpdatePropertyArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.UpdatePropertySemanticCommand;

public final class PropertyReferenceRemover extends BaseCrossReferenceProcessor<Property> {

   @Override
   protected List<Command> process(final ModelContext context, final Setting setting, final Property self,
      final EObject interest) {

      if (interest.equals(self.getType())) {
         return List.of(new UpdatePropertySemanticCommand(
            context,
            self,
            new UpdatePropertyArgument.Builder()
               .typeId("")
               .get()));
      } else if (interest.equals(self.getAssociation())) {
         return List.of(new DeletePropertySemanticCommand(context, self));
      }

      return List.of();
   }
}
