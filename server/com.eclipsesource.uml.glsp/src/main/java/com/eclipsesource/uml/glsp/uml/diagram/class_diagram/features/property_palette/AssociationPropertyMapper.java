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

import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementPropertyItem;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Association;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Property;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association.UpdateAssociationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.utils.MultiplicityUtil;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.AggregationKindUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.UpdateAssociationArgument;

public class AssociationPropertyMapper extends BaseDiagramElementPropertyMapper<Association> {

   @Override
   public PropertyPalette map(final Association source) {
      var elementId = idGenerator.getOrCreateId(source);

      var memberEnds = source.getMemberEnds();
      var memberEndFirst = memberEnds.get(0);
      var memberEndFirstId = idGenerator.getOrCreateId(memberEndFirst);
      var memberEndSecond = memberEnds.get(1);
      var memberEndSecondId = idGenerator.getOrCreateId(memberEndSecond);

      List<ElementPropertyItem> items = new ArrayList<>();

      items.addAll(this.propertyBuilder(UmlClass_Association.Property.class, elementId)
         .text(UmlClass_Association.Property.NAME, "Name", source.getName())
         .choice(
            UmlClass_Association.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .items());

      items.addAll(this.propertyBuilder(UmlClass_Property.Property.class, memberEndFirstId)
         .text(UmlClass_Property.Property.NAME, "Source Name", memberEndFirst.getName())
         .text(UmlClass_Property.Property.MULTIPLICITY, "Source Multiplicity",
            MultiplicityUtil.getMultiplicity(memberEndFirst))
         /*- TODO: Bugs the association
         .bool(UmlClass_Property.Property.IS_NAVIGABLE, "Member End Navigable",
            memberEndFirst.isNavigable())
            */
         .choice(
            UmlClass_Property.Property.AGGREGATION,
            "Source Aggregation",
            AggregationKindUtils.asChoices(),
            memberEndFirst.getAggregation().getLiteral())
         .items());

      items.addAll(this.propertyBuilder(UmlClass_Property.Property.class, memberEndSecondId)
         .text(UmlClass_Property.Property.NAME, "Target Name", memberEndSecond.getName())
         .text(UmlClass_Property.Property.MULTIPLICITY, "Target Multiplicity",
            MultiplicityUtil.getMultiplicity(memberEndSecond))
         /*- TODO: Bugs the association
         .bool(UmlClass_Property.Property.IS_NAVIGABLE, "Member End Navigable",
            memberEndSecond.isNavigable())
            */
         .choice(
            UmlClass_Property.Property.AGGREGATION,
            "Target Aggregation",
            AggregationKindUtils.asChoices(),
            memberEndSecond.getAggregation().getLiteral())
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
                  .get());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdateAssociationArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .get());
            break;
      }

      return withContext(operation);
   }

}
