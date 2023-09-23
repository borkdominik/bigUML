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
package com.eclipsesource.uml.modelserver.uml.elements.information_flow.commands;

import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.InformationFlow;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public final class CreateInformationFlowSemanticCommand
   extends BaseCreateSemanticRelationCommand<InformationFlow, Classifier, Classifier> {

   public CreateInformationFlowSemanticCommand(final ModelContext context,
      final Classifier source, final Classifier target) {
      super(context, source, target);
   }

   @Override
   protected InformationFlow createSemanticElement(final Classifier source, final Classifier target) {
      InformationFlow informationFlow = UMLFactory.eINSTANCE.createInformationFlow();

      informationFlow.getInformationTargets().add(target);
      informationFlow.getInformationSources().add(source);
      informationFlow.setName("New Information Flow");

      this.context.model.getPackagedElements().add(informationFlow);

      return informationFlow;
   }
}
