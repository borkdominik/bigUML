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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette;

import java.util.Optional;

import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Property;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.UpdatePropertyMultiplicityHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.UpdatePropertyNameHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.utils.PropertyUtil;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;

public class PropertyPropertyMapper extends BaseDiagramElementPropertyMapper<Property> {

   @Override
   public PropertyPalette map(final Property source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = propertyBuilder(elementId)
         .text(UmlClass_Property.Property.NAME, "Name", source.getName())
         .text(UmlClass_Property.Property.MULTIPLICITY, "Multiplicity", PropertyUtil.getMultiplicity(source))
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      return operationBuilder()
         .map(UmlClass_Property.Property.NAME,
            (element, op) -> handlerMapper.asOperation(
               UpdatePropertyNameHandler.class,
               element,
               new UpdatePropertyNameHandler.Args(op.getValue())))
         .map(UmlClass_Property.Property.MULTIPLICITY,
            (element, op) -> handlerMapper.asOperation(
               UpdatePropertyMultiplicityHandler.class,
               element,
               new UpdatePropertyMultiplicityHandler.Args(op.getValue())))
         .find(action);
   }

}
