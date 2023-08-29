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
package com.eclipsesource.uml.modelserver.uml.elements.generalization.commands;

import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public class CreateGeneralizationSemanticCommand
   extends BaseCreateSemanticRelationCommand<Generalization, Classifier, Classifier> {

   public CreateGeneralizationSemanticCommand(final ModelContext context,
      final Classifier source, final Classifier target) {
      super(context, source, target);
   }

   @Override
   protected Generalization createSemanticElement(final Classifier source, final Classifier target) {
      return source.createGeneralization(target);
   }
}
