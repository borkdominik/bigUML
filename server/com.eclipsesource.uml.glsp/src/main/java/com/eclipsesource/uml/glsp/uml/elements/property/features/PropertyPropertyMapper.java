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
package com.eclipsesource.uml.glsp.uml.elements.property.features;

import java.util.Optional;
import java.util.stream.Collectors;

import javax.inject.Inject;

import org.eclipse.uml2.uml.AggregationKind;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.property.PropertyConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.property.PropertyOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.MultiplicityUtil;
import com.eclipsesource.uml.glsp.uml.utils.element.AggregationKindUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.TypeUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.property.commands.UpdatePropertyArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.assistedinject.Assisted;

public class PropertyPropertyMapper extends RepresentationElementPropertyMapper<Property> {

   @Inject
   public PropertyPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Inject
   private UmlModelServerAccess modelServerAccess;

   @Override
   public PropertyPalette map(final Property source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(PropertyConfiguration.Property.class, elementId)
         .text(PropertyConfiguration.Property.NAME, "Name", source.getName())
         .bool(PropertyConfiguration.Property.IS_DERIVED, "Is derived", source.isDerived())
         .bool(PropertyConfiguration.Property.IS_ORDERED, "Is ordered", source.isOrdered())
         .bool(PropertyConfiguration.Property.IS_STATIC, "Is static", source.isStatic())
         .bool(PropertyConfiguration.Property.IS_DERIVED_UNION, "Is derived union", source.isDerivedUnion())
         .bool(PropertyConfiguration.Property.IS_READ_ONLY, "Is read only", source.isReadOnly())
         .bool(PropertyConfiguration.Property.IS_UNIQUE, "Is unique", source.isUnique())
         .choice(
            PropertyConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .text(PropertyConfiguration.Property.MULTIPLICITY, "Multiplicity", MultiplicityUtil.getMultiplicity(source))
         .choice(
            PropertyConfiguration.Property.TYPE,
            "Type",
            TypeUtils
               .asChoices(modelServerAccess.getUmlTypeInformation().stream()
                  .filter(type -> this.modelState.getIndex().getEObject(type.id)
                     .map(element -> {
                        if (element instanceof NamedElement) {
                           var namedElement = (NamedElement) element;
                           if (namedElement.getName() != null && !namedElement.getName().isBlank()) {
                              return true;
                           }
                        }

                        return null;
                     })
                     .isPresent())
                  .collect(Collectors.toSet())),
            source.getType() == null ? "" : idGenerator.getOrCreateId(source.getType()))
         .choice(
            PropertyConfiguration.Property.AGGREGATION,
            "Aggregation",
            AggregationKindUtils.asChoices(),
            source.getAggregation().getLiteral())

         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(PropertyConfiguration.Property.class, action);
      var handler = getHandler(PropertyOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdatePropertyArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case IS_DERIVED:
            operation = handler.withArgument(
               UpdatePropertyArgument.by()
                  .isDerived(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case IS_ORDERED:
            operation = handler.withArgument(
               UpdatePropertyArgument.by()
                  .isOrdered(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case IS_STATIC:
            operation = handler.withArgument(
               UpdatePropertyArgument.by()
                  .isStatic(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case IS_DERIVED_UNION:
            operation = handler.withArgument(
               UpdatePropertyArgument.by()
                  .isDerivedUnion(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case IS_READ_ONLY:
            operation = handler.withArgument(
               UpdatePropertyArgument.by()
                  .isReadOnly(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case IS_UNIQUE:
            operation = handler.withArgument(
               UpdatePropertyArgument.by()
                  .isUnique(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case IS_NAVIGABLE:
            operation = handler.withArgument(
               UpdatePropertyArgument.by()
                  .isNavigable(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdatePropertyArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
         case MULTIPLICITY:
            operation = handler.withArgument(
               UpdatePropertyArgument.by()
                  .upperBound(MultiplicityUtil.getUpper(action.getValue()))
                  .lowerBound(MultiplicityUtil.getLower(action.getValue()))
                  .build());
            break;
         case AGGREGATION:
            operation = handler.withArgument(
               UpdatePropertyArgument.by()
                  .aggregation(AggregationKind.get(action.getValue()))
                  .build());
            break;
         case TYPE:
            operation = handler.withArgument(
               UpdatePropertyArgument.by()
                  .typeId(action.getValue())
                  .build());
            break;
      }

      return withContext(operation);
   }

}
