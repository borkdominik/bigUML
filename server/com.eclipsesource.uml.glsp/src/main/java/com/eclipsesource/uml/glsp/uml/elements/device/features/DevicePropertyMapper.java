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
package com.eclipsesource.uml.glsp.uml.elements.device.features;

import java.util.Optional;

import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.device.DeviceConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.device.DeviceOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.device.commands.UpdateDeviceArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class DevicePropertyMapper extends RepresentationElementPropertyMapper<Device> {

   @Inject
   public DevicePropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final Device source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(DeviceConfiguration.Property.class, elementId)
         .text(DeviceConfiguration.Property.NAME, "Name", source.getName())
         .bool(DeviceConfiguration.Property.IS_ABSTRACT, "Is abstract", source.isAbstract())
         .bool(DeviceConfiguration.Property.IS_ACTIVE, "Is active", source.isActive())
         .choice(DeviceConfiguration.Property.VISIBILITY_KIND, "Visibility", VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(DeviceConfiguration.Property.class, action);
      var handler = getHandler(DeviceOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateDeviceArgument.by()
                  .name(action.getValue())
                  .build());
            break;

         case IS_ABSTRACT:
            operation = handler.withArgument(
               UpdateDeviceArgument.by()
                  .isAbstract(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;

         case IS_ACTIVE:
            operation = handler.withArgument(
               UpdateDeviceArgument.by()
                  .isActive(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;

         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateDeviceArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);

   }

}
