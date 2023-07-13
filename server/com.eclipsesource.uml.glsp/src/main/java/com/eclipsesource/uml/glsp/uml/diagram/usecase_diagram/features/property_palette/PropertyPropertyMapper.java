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
package com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.features.property_palette;

import java.util.Optional;

import javax.inject.Inject;

import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_Property;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.property.UpdatePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.utils.MultiplicityUtil;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.TypeUtils;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.property.UpdatePropertyArgument;

public class PropertyPropertyMapper extends BaseDiagramElementPropertyMapper<Property> {

   @Inject
   private UmlModelServerAccess modelServerAccess;

   @Override
   public PropertyPalette map(final Property source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlUseCase_Property.Property.class, elementId)
         .text(UmlUseCase_Property.Property.NAME, "Name", source.getName())
         .text(UmlUseCase_Property.Property.MULTIPLICITY, "Multiplicity", MultiplicityUtil.getMultiplicity(source))
         .choice(
            UmlUseCase_Property.Property.TYPE,
            "Type",
            TypeUtils.asChoices(modelServerAccess.getUmlTypeInformation()),
            source.getType() == null ? "" : idGenerator.getOrCreateId(source.getType()))
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlUseCase_Property.Property.class, action);
      var handler = getHandler(UpdatePropertyHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdatePropertyArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
         case MULTIPLICITY:
            operation = handler.withArgument(
               new UpdatePropertyArgument.Builder()
                  .upperBound(MultiplicityUtil.getUpper(action.getValue()))
                  .lowerBound(MultiplicityUtil.getLower(action.getValue()))
                  .get());
            break;
         case TYPE:
            operation = handler.withArgument(
               new UpdatePropertyArgument.Builder()
                  .typeId(action.getValue())
                  .get());
            break;
      }

      return withContext(operation);
   }
}
