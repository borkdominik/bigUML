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

import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Device;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.device.UpdateDeviceHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.device.UpdateDeviceArgument;

public class DevicePropertyMapper extends BaseDiagramElementPropertyMapper<Device> {

   @Override
   public PropertyPalette map(final Device source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlDeployment_Device.Property.class, elementId)
         .text(UmlDeployment_Device.Property.NAME, "Name", source.getName())
         .bool(UmlDeployment_Device.Property.IS_ABSTRACT, "Is abstract", source.isAbstract())
         .bool(UmlDeployment_Device.Property.IS_ACTIVE, "Is active", source.isActive())
         .choice(UmlDeployment_Device.Property.VISIBILITY_KIND, "Visibility", VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlDeployment_Device.Property.class, action);
      var handler = getHandler(UpdateDeviceHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdateDeviceArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;

         case IS_ABSTRACT:
            operation = handler.withArgument(
               new UpdateDeviceArgument.Builder()
                  .isAbstract(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;

         case IS_ACTIVE:
            operation = handler.withArgument(
               new UpdateDeviceArgument.Builder()
                  .isActive(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;

         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdateDeviceArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .get());
            break;
      }

      return withContext(operation);

   }

}
