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
package com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.generalization;

import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public class DeleteGeneralizationSemanticCommand extends BaseDeleteSemanticChildCommand<Classifier, Generalization> {

   public DeleteGeneralizationSemanticCommand(final ModelContext context, final Generalization semanticElement) {
      super(context, semanticElement.getSpecific(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Classifier parent, final Generalization child) {
      parent.getGeneralizations().remove(child);
   }
}
