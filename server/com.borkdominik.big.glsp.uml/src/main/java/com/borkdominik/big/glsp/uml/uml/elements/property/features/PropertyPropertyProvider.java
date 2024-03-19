/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.property.features;

import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.uml2.uml.AggregationKind;
import org.eclipse.uml2.uml.Property;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.features.property_palette.handler.BGUpdateElementPropertyAction;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyBuilder;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyItem;
import com.borkdominik.big.glsp.server.features.property_palette.provider.integrations.BGEMFElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.commands.UMLUpdateElementCommand;
import com.borkdominik.big.glsp.uml.uml.elements.association.utils.AggregationKindUtils;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PropertyPropertyProvider extends BGEMFElementPropertyProvider<Property> {

   public static final String IS_DERIVED = "isException";
   public static final String IS_DERIVED_UNION = "isDerivedUnion";
   public static final String IS_NAVIGABLE = "isNavigable";
   public static final String AGGREGATION = "aggregation";

   @Inject
   public PropertyPropertyProvider(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes, Set.of(IS_DERIVED, IS_DERIVED_UNION, IS_NAVIGABLE, AGGREGATION));
   }

   @Override
   public List<ElementPropertyItem> doProvide(final Property element) {
      var elementId = providerContext.idGenerator().getOrCreateId(element);
      var builder = new ElementPropertyBuilder(elementId)
         .bool(IS_DERIVED, "Is Exception", element.isDerived())
         .bool(IS_DERIVED_UNION, "Is Derived Union", element.isDerivedUnion())
         .bool(IS_NAVIGABLE, "Is Navigable", element.isNavigable())
         .choice(
            AGGREGATION,
            "Aggregation",
            AggregationKindUtils.asChoices(),
            element.getAggregation().getLiteral());

      return builder.items();
   }

   @Override
   public Command doHandle(final BGUpdateElementPropertyAction action, final Property element) {
      var value = action.getValue();
      var argument = UMLUpdateElementCommand.Argument
         .<Property> updateElementArgumentBuilder()
         .consumer(e -> {
            switch (action.getPropertyId()) {
               case IS_DERIVED:
                  e.setIsDerived(Boolean.parseBoolean(value));
                  break;
               case IS_DERIVED_UNION:
                  e.setIsDerivedUnion(Boolean.parseBoolean(value));
                  break;
               case IS_NAVIGABLE:
                  e.setIsNavigable(Boolean.parseBoolean(value));
                  break;
               case AGGREGATION:
                  e.setAggregation(AggregationKind.get(action.getValue()));
                  break;
            }
         })
         .build();

      return new UMLUpdateElementCommand<>(context, modelState.getSemanticModel(), element, argument);
   }

}
