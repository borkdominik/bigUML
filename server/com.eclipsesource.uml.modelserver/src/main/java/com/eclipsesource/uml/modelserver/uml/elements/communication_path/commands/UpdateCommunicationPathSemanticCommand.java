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
package com.eclipsesource.uml.modelserver.uml.elements.communication_path.commands;

import java.util.List;

import org.eclipse.uml2.uml.CommunicationPath;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.association.commands.UpdateAssociationSemanticCommand;

public final class UpdateCommunicationPathSemanticCommand
   extends BaseUpdateSemanticElementCommand<CommunicationPath, UpdateCommunicationPathArgument> {

   public UpdateCommunicationPathSemanticCommand(final ModelContext context, final CommunicationPath semanticElement,
      final UpdateCommunicationPathArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final CommunicationPath semanticElement,
      final UpdateCommunicationPathArgument updateArgument) {
      include(List.of(new UpdateAssociationSemanticCommand(context, semanticElement, updateArgument)));

   }

}
