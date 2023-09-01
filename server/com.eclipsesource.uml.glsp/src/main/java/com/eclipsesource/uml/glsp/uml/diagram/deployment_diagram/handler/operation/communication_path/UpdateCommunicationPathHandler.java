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
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.communication_path;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.CommunicationPath;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_CommunicationPath;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.communication_path.UpdateCommunicationPathArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.communication_path.UpdateCommunicationPathContribution;

public final class UpdateCommunicationPathHandler
   extends BaseUpdateElementHandler<CommunicationPath, UpdateCommunicationPathArgument> {

   public UpdateCommunicationPathHandler() {
      super(UmlDeployment_CommunicationPath.typeId());
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final CommunicationPath element,
      final UpdateCommunicationPathArgument updateArgument) {
      return UpdateCommunicationPathContribution.create(element, updateArgument);
   }
}
