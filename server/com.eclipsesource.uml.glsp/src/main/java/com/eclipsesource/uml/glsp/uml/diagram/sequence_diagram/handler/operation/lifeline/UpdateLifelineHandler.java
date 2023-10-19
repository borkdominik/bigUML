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
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.lifeline;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Lifeline;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.lifeline.UpdateLifelineArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.lifeline.UpdateLifelineContribution;

public final class UpdateLifelineHandler
   extends BaseUpdateElementHandler<Lifeline, UpdateLifelineArgument> {

   public UpdateLifelineHandler() {
      super(UmlSequence_Lifeline.typeId());
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final Lifeline element,
      final UpdateLifelineArgument updateArgument) {
      return UpdateLifelineContribution.create(element, updateArgument);
   }
}
