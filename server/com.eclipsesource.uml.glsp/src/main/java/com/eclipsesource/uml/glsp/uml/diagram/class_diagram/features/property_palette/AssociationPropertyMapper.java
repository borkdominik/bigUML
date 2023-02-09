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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.AggregationKind;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementPropertyItem;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Association;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Property;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association.UpdateAssociationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.utils.PropertyUtil;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.UpdateAssociationArgument;

public class AssociationPropertyMapper extends BaseDiagramElementPropertyMapper<Association> {

   @Override
   public PropertyPalette map(final Association source) {
      var elementId = idGenerator.getOrCreateId(source);

      var memberEnds = source.getMemberEnds();
      var memberEndSource = memberEnds.get(0);
      var memberEndSourceId = idGenerator.getOrCreateId(memberEndSource);
      var memberEndTarget = memberEnds.get(1);
      var memberEndTargetId = idGenerator.getOrCreateId(memberEndTarget);

      List<ElementPropertyItem> items = new ArrayList<>();

      items.addAll(this.<UmlClass_Association.Property> propertyBuilder(elementId)
         .text(UmlClass_Association.Property.NAME, "Name", source.getName())
         .choice(
            UmlClass_Association.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKind.VALUES.stream().map(v -> v.getLiteral()).collect(Collectors.toList()),
            source.getVisibility().getLiteral())
         .items());

      items.addAll(this.<UmlClass_Property.Property> propertyBuilder(memberEndSourceId)
         .text(UmlClass_Property.Property.NAME, "Source Name", memberEndSource.getName())
         .text(UmlClass_Property.Property.MULTIPLICITY, "Source Multiplicity",
            PropertyUtil.getMultiplicity(memberEndSource))
         .bool(UmlClass_Property.Property.IS_NAVIGABLE, "Source Navigable",
            memberEndSource.isNavigable())
         .choice(
            UmlClass_Property.Property.AGGREGATION,
            "Source Aggregation",
            AggregationKind.VALUES.stream().map(v -> v.getLiteral()).collect(Collectors.toList()),
            memberEndSource.getAggregation().getLiteral())
         .items());

      items.addAll(this.<UmlClass_Property.Property> propertyBuilder(memberEndTargetId)
         .text(UmlClass_Property.Property.NAME, "Target Name", memberEndTarget.getName())
         .text(UmlClass_Property.Property.MULTIPLICITY, "Target Multiplicity",
            PropertyUtil.getMultiplicity(memberEndTarget))
         .bool(UmlClass_Property.Property.IS_NAVIGABLE, "Target Navigable",
            memberEndTarget.isNavigable())
         .choice(
            UmlClass_Property.Property.AGGREGATION,
            "Target Aggregation",
            AggregationKind.VALUES.stream().map(v -> v.getLiteral()).collect(Collectors.toList()),
            memberEndTarget.getAggregation().getLiteral())
         .items());

      return new PropertyPalette(elementId, "Association", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlClass_Association.Property.class, action);
      var handler = getHandler(UpdateAssociationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdateAssociationArgument.Builder()
                  .name(action.getValue())
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdateAssociationArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);
   }

}
