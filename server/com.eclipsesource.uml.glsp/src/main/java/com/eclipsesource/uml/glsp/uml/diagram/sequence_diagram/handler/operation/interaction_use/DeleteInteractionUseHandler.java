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
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.interaction_use;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.InteractionUse;

import com.eclipsesource.uml.glsp.uml.handler.operations.delete.BaseDeleteElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction_use.DeleteInteractionUseContribution;

public final class DeleteInteractionUseHandler extends BaseDeleteElementHandler<InteractionUse> {

   @Override
   protected CCommand createCommand(final InteractionUse element) {
      return DeleteInteractionUseContribution.create(element);
   }
}
