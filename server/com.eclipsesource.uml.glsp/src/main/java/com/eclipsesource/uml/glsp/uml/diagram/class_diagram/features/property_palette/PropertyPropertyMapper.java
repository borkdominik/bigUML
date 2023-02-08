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
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.AggregationKind;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Property;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.UpdatePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.UpdatePropertyMultiplicityHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.UpdatePropertyNameHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.utils.PropertyUtil;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.UpdatePropertyArgument;

public class PropertyPropertyMapper extends BaseDiagramElementPropertyMapper<Property> {

   @Override
   public PropertyPalette map(final Property source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = propertyBuilder(elementId)
         .text(UmlClass_Property.Property.NAME, "Name", source.getName())
         .bool(UmlClass_Property.Property.IS_DERIVED, "Is derived", source.isDerived())
         .bool(UmlClass_Property.Property.IS_ORDERED, "Is ordered", source.isOrdered())
         .bool(UmlClass_Property.Property.IS_STATIC, "Is static", source.isStatic())
         .bool(UmlClass_Property.Property.IS_DERIVED_UNION, "Is derived union", source.isDerivedUnion())
         .bool(UmlClass_Property.Property.IS_READ_ONLY, "Is read only", source.isReadOnly())
         .bool(UmlClass_Property.Property.IS_UNIQUE, "Is unique", source.isUnique())
         .choice(
            UmlClass_Property.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKind.VALUES.stream().map(v -> v.getLiteral()).collect(Collectors.toList()),
            source.getVisibility().getLiteral())
         .text(UmlClass_Property.Property.MULTIPLICITY, "Multiplicity", PropertyUtil.getMultiplicity(source))
         .choice(
            UmlClass_Property.Property.AGGREGATION,
            "Aggregation",
            AggregationKind.VALUES.stream().map(v -> v.getLiteral()).collect(Collectors.toList()),
            source.getAggregation().getLiteral())

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
         .map(UmlClass_Property.Property.IS_DERIVED,
            (element, op) -> handlerMapper.asOperation(
               UpdatePropertyHandler.class,
               element,
               new UpdatePropertyArgument.Builder()
                  .isDerived(Boolean.parseBoolean(op.getValue()))
                  .build()))
         .map(UmlClass_Property.Property.IS_ORDERED,
            (element, op) -> handlerMapper.asOperation(
               UpdatePropertyHandler.class,
               element,
               new UpdatePropertyArgument.Builder()
                  .isOrdered(Boolean.parseBoolean(op.getValue()))
                  .build()))
         .map(UmlClass_Property.Property.IS_STATIC,
            (element, op) -> handlerMapper.asOperation(
               UpdatePropertyHandler.class,
               element,
               new UpdatePropertyArgument.Builder()
                  .isStatic(Boolean.parseBoolean(op.getValue()))
                  .build()))
         .map(UmlClass_Property.Property.IS_DERIVED_UNION,
            (element, op) -> handlerMapper.asOperation(
               UpdatePropertyHandler.class,
               element,
               new UpdatePropertyArgument.Builder()
                  .isDerivedUnion(Boolean.parseBoolean(op.getValue()))
                  .build()))
         .map(UmlClass_Property.Property.IS_READ_ONLY,
            (element, op) -> handlerMapper.asOperation(
               UpdatePropertyHandler.class,
               element,
               new UpdatePropertyArgument.Builder()
                  .isReadOnly(Boolean.parseBoolean(op.getValue()))
                  .build()))
         .map(UmlClass_Property.Property.IS_UNIQUE,
            (element, op) -> handlerMapper.asOperation(
               UpdatePropertyHandler.class,
               element,
               new UpdatePropertyArgument.Builder()
                  .isUnique(Boolean.parseBoolean(op.getValue()))
                  .build()))
         .map(UmlClass_Property.Property.VISIBILITY_KIND,
            (element, op) -> handlerMapper.asOperation(
               UpdatePropertyHandler.class,
               element,
               new UpdatePropertyArgument.Builder()
                  .visibilityKind(VisibilityKind.get(op.getValue()))
                  .build()))
         .map(UmlClass_Property.Property.MULTIPLICITY,
            (element, op) -> handlerMapper.asOperation(
               UpdatePropertyMultiplicityHandler.class,
               element,
               new UpdatePropertyMultiplicityHandler.Args(op.getValue())))
         .map(UmlClass_Property.Property.AGGREGATION,
            (element, op) -> handlerMapper.asOperation(
               UpdatePropertyHandler.class,
               element,
               new UpdatePropertyArgument.Builder()
                  .aggregation(AggregationKind.get(op.getValue()))
                  .build()))

         .find(action);
   }

}
