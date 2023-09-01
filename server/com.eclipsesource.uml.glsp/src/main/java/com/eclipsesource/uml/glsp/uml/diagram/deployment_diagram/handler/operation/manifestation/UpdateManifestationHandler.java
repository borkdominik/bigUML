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
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.manifestation;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Manifestation;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Manifestation;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.manifestation.UpdateManifestationArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.manifestation.UpdateManifestationContribution;

public final class UpdateManifestationHandler
   extends BaseUpdateElementHandler<Manifestation, UpdateManifestationArgument> {

   public UpdateManifestationHandler() {
      super(UmlDeployment_Manifestation.typeId());
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final Manifestation element,
      final UpdateManifestationArgument updateArgument) {
      return UpdateManifestationContribution.create(element, updateArgument);
   }
}
