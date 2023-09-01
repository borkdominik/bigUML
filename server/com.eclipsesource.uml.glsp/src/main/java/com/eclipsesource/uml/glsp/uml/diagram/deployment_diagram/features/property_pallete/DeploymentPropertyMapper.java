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
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete;

import java.util.Optional;

import org.eclipse.uml2.uml.Deployment;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Deployment;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.deployment.UpdateDeploymentHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment.UpdateDeploymentArgument;

public class DeploymentPropertyMapper extends BaseDiagramElementPropertyMapper<Deployment> {

   @Override
   public PropertyPalette map(final Deployment source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlDeployment_Deployment.Property.class, elementId)
         .text(UmlDeployment_Deployment.Property.NAME, "Name", source.getName())
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlDeployment_Deployment.Property.class, action);
      var handler = getHandler(UpdateDeploymentHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdateDeploymentArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
      }

      return withContext(operation);

   }

}
