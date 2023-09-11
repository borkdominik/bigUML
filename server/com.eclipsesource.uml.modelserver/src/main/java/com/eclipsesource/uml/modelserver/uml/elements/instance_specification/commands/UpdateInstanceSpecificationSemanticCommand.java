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
package com.eclipsesource.uml.modelserver.uml.elements.instance_specification.commands;

import java.util.List;

import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.InstanceSpecification;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementSemanticCommand;

public final class UpdateInstanceSpecificationSemanticCommand
   extends BaseUpdateSemanticElementCommand<InstanceSpecification, UpdateInstanceSpecificationArgument> {

   public UpdateInstanceSpecificationSemanticCommand(final ModelContext context,
      final InstanceSpecification semanticElement,
      final UpdateInstanceSpecificationArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final InstanceSpecification semanticElement,
      final UpdateInstanceSpecificationArgument updateArgument) {
      include(List.of(new UpdateNamedElementSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.classifierId().ifPresent(arg -> {
         List<Classifier> classifiers = semanticElement.getClassifiers();
         String[] actualName = semanticElement.getName().split(":");
         String originalName = actualName[0];
         StringBuilder classifiersString = new StringBuilder();
         String updatedName;

         Classifier element = semanticElementAccessor.getElement(arg, Classifier.class).get();
         if (!classifiers.contains(element)) {

            classifiers.add(element); // Adds semantic element classifier to instance spec

            for (Classifier val : classifiers) {
               classifiersString.append(val.getName() + ",");
            }
            updatedName = originalName + ":" + classifiersString.substring(0, classifiersString.length() - 1);

            semanticElement.setName(updatedName);
         }

      });

   }

}
