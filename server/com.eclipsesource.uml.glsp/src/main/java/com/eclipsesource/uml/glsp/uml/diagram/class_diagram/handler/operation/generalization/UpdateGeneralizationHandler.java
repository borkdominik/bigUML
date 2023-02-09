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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.generalization;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Generalization;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization.UpdateGeneralizationArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization.UpdateGeneralizationContribution;

public final class UpdateGeneralizationHandler
   extends BaseUpdateElementHandler<Generalization, UpdateGeneralizationArgument> {

   public UpdateGeneralizationHandler() {
      super(UmlClass_Generalization.ID);
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final Generalization element,
      final UpdateGeneralizationArgument updateArgument) {
      return UpdateGeneralizationContribution.create(element, updateArgument);
   }
}
