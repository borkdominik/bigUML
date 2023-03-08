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

import javax.inject.Inject;

import org.eclipse.uml2.uml.AggregationKind;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Property;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.UpdatePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.utils.MultiplicityUtil;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.AggregationKindUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.TypeUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.UpdatePropertyArgument;

public class PropertyPropertyMapper extends BaseDiagramElementPropertyMapper<Property> {

   @Inject
   private UmlModelServerAccess modelServerAccess;

   @Override
   public PropertyPalette map(final Property source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlClass_Property.Property.class, elementId)
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
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .text(UmlClass_Property.Property.MULTIPLICITY, "Multiplicity", MultiplicityUtil.getMultiplicity(source))
         .choice(
            UmlClass_Property.Property.TYPE,
            "Type",
            TypeUtils.asChoices(modelServerAccess.getUmlTypeInformation()),
            source.getType() == null ? "" : idGenerator.getOrCreateId(source.getType()))
         .choice(
            UmlClass_Property.Property.AGGREGATION,
            "Aggregation",
            AggregationKindUtils.asChoices(),
            source.getAggregation().getLiteral())

         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlClass_Property.Property.class, action);
      var handler = getHandler(UpdatePropertyHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdatePropertyArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
         case IS_DERIVED:
            operation = handler.withArgument(
               new UpdatePropertyArgument.Builder()
                  .isDerived(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case IS_ORDERED:
            operation = handler.withArgument(
               new UpdatePropertyArgument.Builder()
                  .isOrdered(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case IS_STATIC:
            operation = handler.withArgument(
               new UpdatePropertyArgument.Builder()
                  .isStatic(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case IS_DERIVED_UNION:
            operation = handler.withArgument(
               new UpdatePropertyArgument.Builder()
                  .isDerivedUnion(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case IS_READ_ONLY:
            operation = handler.withArgument(
               new UpdatePropertyArgument.Builder()
                  .isReadOnly(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case IS_UNIQUE:
            operation = handler.withArgument(
               new UpdatePropertyArgument.Builder()
                  .isUnique(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case IS_NAVIGABLE:
            operation = handler.withArgument(
               new UpdatePropertyArgument.Builder()
                  .isNavigable(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdatePropertyArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .get());
            break;
         case MULTIPLICITY:
            operation = handler.withArgument(
               new UpdatePropertyArgument.Builder()
                  .upperBound(MultiplicityUtil.getUpper(action.getValue()))
                  .lowerBound(MultiplicityUtil.getLower(action.getValue()))
                  .get());
            break;
         case AGGREGATION:
            operation = handler.withArgument(
               new UpdatePropertyArgument.Builder()
                  .aggregation(AggregationKind.get(action.getValue()))
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
