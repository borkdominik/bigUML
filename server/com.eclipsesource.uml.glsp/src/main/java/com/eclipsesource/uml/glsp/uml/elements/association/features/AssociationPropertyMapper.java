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
package com.eclipsesource.uml.glsp.uml.elements.association.features;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementPropertyItem;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.association.AssociationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.association.AssociationOperationHandler;
import com.eclipsesource.uml.glsp.uml.elements.property.PropertyConfiguration;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.MultiplicityUtil;
import com.eclipsesource.uml.glsp.uml.utils.element.AggregationKindUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.association.commands.UpdateAssociationArgument;

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

      items.addAll(this.propertyBuilder(AssociationConfiguration.Property.class, elementId)
         .text(AssociationConfiguration.Property.NAME, "Name", source.getName())
         .choice(
            AssociationConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .items());

      items.addAll(this.propertyBuilder(PropertyConfiguration.Property.class, memberEndFirstId)
         .text(PropertyConfiguration.Property.NAME, "Source Name", memberEndFirst.getName())
         .text(PropertyConfiguration.Property.MULTIPLICITY, "Source Multiplicity",
            MultiplicityUtil.getMultiplicity(memberEndFirst))
         /*- TODO: Bugs the association
         .bool(UmlClass_Property.Property.IS_NAVIGABLE, "Member End Navigable",
            memberEndFirst.isNavigable())
            */
         .choice(
            PropertyConfiguration.Property.AGGREGATION,
            "Source Aggregation",
            AggregationKindUtils.asChoices(),
            memberEndFirst.getAggregation().getLiteral())
         .items());

      items.addAll(this.propertyBuilder(PropertyConfiguration.Property.class, memberEndSecondId)
         .text(PropertyConfiguration.Property.NAME, "Target Name", memberEndSecond.getName())
         .text(PropertyConfiguration.Property.MULTIPLICITY, "Target Multiplicity",
            MultiplicityUtil.getMultiplicity(memberEndSecond))
         /*- TODO: Bugs the association
         .bool(UmlClass_Property.Property.IS_NAVIGABLE, "Member End Navigable",
            memberEndSecond.isNavigable())
            */
         .choice(
            PropertyConfiguration.Property.AGGREGATION,
            "Target Aggregation",
            AggregationKindUtils.asChoices(),
            memberEndSecond.getAggregation().getLiteral())
         .items());

      return new PropertyPalette(elementId, "Association", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(AssociationConfiguration.Property.class, action);
      var handler = getHandler(AssociationOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateAssociationArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateAssociationArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);
   }

}
