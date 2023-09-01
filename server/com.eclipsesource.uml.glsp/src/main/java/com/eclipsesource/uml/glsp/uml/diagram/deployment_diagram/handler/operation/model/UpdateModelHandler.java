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
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.model;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Model;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.model.UpdateModelArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.model.UpdateModelContribution;

public final class UpdateModelHandler extends BaseUpdateElementHandler<Model, UpdateModelArgument> {

   public UpdateModelHandler() {
      super(UmlDeployment_Model.typeId());
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final Model element,
      final UpdateModelArgument updateArgument) {
      return UpdateModelContribution.create(element, updateArgument);
   }

}
